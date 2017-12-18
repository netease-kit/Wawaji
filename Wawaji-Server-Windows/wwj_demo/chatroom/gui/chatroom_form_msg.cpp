#include "chatroom_form.h"
//#include "chatroom_frontpage.h"
#include "nim_chatroom_helper.h"


#define ROOMMSG_R_N _T("\r\n")
namespace nim_chatroom
{

using namespace ui;


void ChatroomForm::RequestEnter(const __int64 room_id)
{
	if (room_id == 0)
	{
		RequestRoomError(L"频道号为空！");
		return;
	}
	//join_room_timer_.Cancel();
	//StdClosure task = nbase::Bind(&ChatroomForm::RequestRoomError, this, L"获取房间信息超时，尝试注销重登");
	//nbase::ThreadManager::PostDelayedTask(kThreadUI, join_room_timer_.ToWeakCallback(task), nbase::TimeDelta::FromMilliseconds(70));

	room_id_ = room_id;
	//获取聊天室登录信息
	nim::PluginIn::ChatRoomRequestEnterAsync(room_id_, nbase::Bind(&ChatroomForm::OnChatRoomRequestEnterCallback, this, std::placeholders::_1, std::placeholders::_2));
}

__int64 ChatroomForm::GetRoomId()
{
	return room_id_;
}

void ChatroomForm::OnReceiveMsgCallback(const ChatRoomMessage& result)
{
}

void ChatroomForm::OnEnterCallback(int error_code, const ChatRoomInfo& info, const ChatRoomMemberInfo& my_info)
{
	if (error_code != nim::kNIMResSuccess)
	{
		AddText(nbase::StringPrintf("enter room err code %d", error_code), GAME_CLR_WINNING);
		//RequestRoomError(creater_id_.empty() ? L"加入房间失败" : L"房间连接中断");
		return;
	}
	if (info.id_ == 0)
	{
		return;
	}

	room_id_ = info.id_;
	has_enter_ = true;

	OnGetChatRoomInfoCallback(room_id_, error_code, info);
}

void ChatroomForm::OnGetChatRoomInfoCallback(__int64 room_id, int error_code, const ChatRoomInfo& info)
{
	if (error_code != nim::kNIMResSuccess || room_id != room_id_)
	{
		RequestRoomError(L"获取房间信息失败");
		return;
	}

	StdClosure cb = [=](){
		//time_refresh_ = time(NULL);
		info_ = info;
		ASSERT(!info.creator_id_.empty());
		creater_id_ = info.creator_id_;

		std::wstring room_name = nbase::StringPrintf(L"房间号：%lld", room_id_);
		name_->SetText(room_name);
		AddText(nbase::StringPrintf("enter room success %d", room_id_), GAME_CLR_STEP);

		//MeetingInit();

		{
			paint_video_timer_.Cancel();
			StdClosure task = nbase::Bind(&ChatroomForm::PaintVideo, this);
			nbase::ThreadManager::PostRepeatedTask(kThreadUI, paint_video_timer_.ToWeakCallback(task), nbase::TimeDelta::FromMilliseconds(64));

			GetNextMember();
		}
	};
	Post2UI(cb);
}

void ChatroomForm::OnNotificationCallback(const ChatRoomNotification& notification)
{	
	if (notification.id_ == kNIMChatRoomNotificationIdQueueChanged)
	{
		if (game_step_ == kGameStepEmpty)
		{
			GetNextMember();
		}
	}
}
void ChatroomForm::GetNextMember()
{
	if (game_step_ == kGameStepEmpty && !game_stop_)
	{
		game_step_ = kGameStepGetMember;
		CheckGameHanle();
		nbase::ThreadManager::PostDelayedTask(kThreadUI, nbase::Bind(&ChatroomForm::DoGetNextMember, this), nbase::TimeDelta::FromMilliseconds(1500));
	}
}
void ChatroomForm::DoGetNextMember()
{
	if (game_step_ == kGameStepGetMember)
	{
		game_get_member_try_num_++;
		nim_chatroom::ChatRoom::QueueHeaderAsync(room_id_, nbase::Bind(&ChatroomForm::GetNextMemberCallback, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3));
	}
}
void ChatroomForm::GetNextMemberCallback(int64_t room_id, int error_code, const ChatRoomQueueElement& element)
{
	Post2UI(nbase::Bind(&ChatroomForm::DoNextMemberCallback, this, room_id, error_code, element));
}
void ChatroomForm::DoNextMemberCallback(int64_t room_id, int error_code, const ChatRoomQueueElement& element)
{
	if (game_step_ == kGameStepGetMember)
	{
		if (error_code == 200)
		{
			GameReset();
			//Json::Value valus;
			//Json::Reader reader;
			//if (reader.parse(element.value_, valus))
			{
				game_uid_ = element.key_;//valus["accid"].asString();
				if (!game_uid_.empty())
				{
					GamePlayType play_type = kGptVChat;
					Json::Value values;
					Json::Reader reader;
					if (reader.parse(element.value_, values))
					{
						if (values["webrtc"].asInt() > 0)
						{
							AddText("webrtc player");
							play_type = kGptWebrtc;
						}
						if (values["h5"].asInt() > 0)
						{
							AddText("h5 player");
							play_type = kGptH5;
						}
						std::string name = values["nick"].asString();
						if (!name.empty())
						{
							AddText(nbase::StringPrintf("next member %s", name.c_str()));
						}
					}
					game_play_type_ = play_type;
					game_step_ = kGameStepInvite;
					game_session_id_ = nim::Tool::GetUuid();
					game_que_key_ = element.key_;
					//StartVChat(game_uid_, webrtc);
					GameInvite(game_uid_);
					return;
				}
			}
			nim_chatroom::ChatRoom::QueuePollAsync(room_id_, element.key_, nim_chatroom::ChatRoom::QueuePollCallback(), "");
		}
		game_step_ = kGameStepEmpty;
		int32_t delay_time = 60 * 3;
		if (game_get_member_try_num_ <= 3)
		{
			delay_time = 2;
		}
		else
		{
			game_get_member_try_num_ = 3;
			if (error_code == 404)
			{
				return;
			}
		}
		nbase::ThreadManager::PostDelayedTask(kThreadUI, nbase::Bind(&ChatroomForm::GetNextMember, this), nbase::TimeDelta::FromSeconds(delay_time));
	}
}

void ChatroomForm::OnGetMembersCallback(__int64 room_id, int error_code, const std::list<ChatRoomMemberInfo>& infos)
{
	if (error_code != nim::kNIMResSuccess || room_id_ != room_id)
		return;
}

void ChatroomForm::GetMsgHistoryCallback(__int64 room_id, int error_code, const std::list<ChatRoomMessage>& msgs)
{
	if (error_code != nim::kNIMResSuccess || room_id_ != room_id)
		return;
}

void ChatroomForm::SetMemberAttributeCallback(__int64 room_id, int error_code, const ChatRoomMemberInfo& info)
{
	if (error_code != nim::kNIMResSuccess || room_id_ != room_id)
		return;

}

void ChatroomForm::TempMuteCallback(__int64 room_id, int error_code, const ChatRoomMemberInfo& info)
{
	if (error_code != nim::kNIMResSuccess || room_id_ != room_id)
		return;
}

void ChatroomForm::KickMemberCallback(__int64 room_id, int error_code)
{
	if (error_code != nim::kNIMResSuccess || room_id_ != room_id)
		return;

}

void ChatroomForm::OnChatRoomRequestEnterCallback(int error_code, const std::string& result)
{
	StdClosure closure_err = ToWeakCallback([this, error_code]()
	{
		RequestRoomError(L"进入房间失败");
	});
	if (error_code != nim::kNIMResSuccess)
	{
		if (error_code == nim::kNIMResForbidden 
			|| error_code == nim::kNIMResNotExist
			|| error_code == nim::kNIMLocalResAPIErrorInitUndone
			|| error_code == nim::kNIMLocalResAPIErrorLoginUndone
			|| error_code == nim::kNIMResTimeoutError)
		{
			StdClosure closure = ToWeakCallback([this, error_code]()
			{
				std::wstring kick_tip_str = L"进入房间失败";
				if (error_code == nim::kNIMResForbidden)
					kick_tip_str = ui::MutiLanSupport::GetInstance()->GetStringViaID(L"STRID_CHATROOM_TIP_BLACKLISTED");
				else if (error_code == nim::kNIMResNotExist)
					kick_tip_str = L"房间不存在";

				RequestRoomError(kick_tip_str);
			});
			Post2UI(closure);
		}
		else
		{
			Post2UI(closure_err);
			QLOG_APP(L"OnChatRoomRequestEnterCallback error: error id={0}") << error_code;
		}
		return;
	}
	
	if (!result.empty())
	{
		StdClosure cb = [result, this](){
			room_enter_token_ = result;
			ChatRoomEnterInfo info;
			//Json::Value values;
			//Json::Reader reader;
			//std::string test_string = "{\"remote\":{\"mapmap\":{\"int\":1,\"boolean\":false,\"list\":[1,2,3],\"string\":\"string, lalala\"}}}";
			//if (reader.parse(test_string, values))
			//	info.SetExt(values);
			//info.SetNotifyExt(values);
			bool bRet = ChatRoom::Enter(room_id_, room_enter_token_, info);
			if (bRet)
			{
				this->CenterWindow();
				this->ShowWindow();
			}
			else
			{
				QLOG_APP(L"ChatRoom::Enter error");

				RequestRoomError(L"进入房间失败，请重试");
			}
		};
		Post2UI(cb);
	}
	else
	{
		Post2UI(closure_err);
	}

}

void ChatroomForm::OnRegLinkConditionCallback(__int64 room_id, const NIMChatRoomLinkCondition condition)
{
	if (room_id_ != room_id)
		return;

	if (condition == kNIMChatRoomLinkConditionAlive && has_enter_)
	{
		//GetHistorys();
	}
	else if (condition == kNIMChatRoomLinkConditionDead)
	{
		//msg_list_->SetText(L"");
		//input_edit_->SetText(L"");
	}
}
//收到会议相关权限消息
void ChatroomForm::RecMeetingMsg(const std::string &uid, const std::string json)
{
	if (exit_)
	{
		return;
	}
	Json::Value values;
	Json::Reader reader;
	if (reader.parse(json, values) && values["command"].isInt())
	{
		std::string data = values["data"].asString();
		int type = values["command"].asInt();
		int64_t serial = values["serial"].asInt64();

		RecGameControl(uid, type, data, serial);
	}

}
void ChatroomForm::SendP2PCustomMsg(const std::string &uid, const std::string json, bool offline)
{
	nim::SysMessage msg;
	msg.receiver_accid_ = uid;
	msg.sender_accid_ = nim_comp::LoginManager::GetInstance()->GetAccount();
	msg.msg_setting_.need_offline_ = (offline ? nim::BS_TRUE : nim::BS_FALSE);
	msg.msg_setting_.need_push_ = nim::BS_FALSE;
	msg.attach_ = json;
	msg.type_ = nim::kNIMSysMsgTypeCustomP2PMsg;
	msg.client_msg_id_ = QString::GetGUID();
	msg.timetag_ = 1000 * nbase::Time::Now().ToTimeT();

	nim::SystemMsg::SendCustomNotificationMsg(msg.ToJsonString());
}
void ChatroomForm::AddText(const std::string &text, COLORREF clr)
{
	if (text.empty()) return;
	// 
	QLOG_APP(L"step:{0}, {1}") << game_step_ << text;

	nbase::Time::TimeStruct qt = nbase::Time::Now().ToTimeStruct(true);
	std::string log_txt = nbase::StringPrintf("[%02d:%02d:%02d] %s", qt.hour_, qt.minute_, qt.second_, text.c_str());
	if (log_edit_->GetTextLength() != 0)
	{
		log_edit_->SetSel(-1, -1);
		log_edit_->ReplaceSel(ROOMMSG_R_N, false);
	}
	int32_t lSelBegin = log_edit_->GetTextLength();
	log_edit_->SetSel(-1, -1);
	log_edit_->ReplaceSel(nbase::UTF8ToUTF16(log_txt), false);
	int32_t lSelEnd = log_edit_->GetTextLength();

	CHARFORMAT2 cf;
	log_edit_->GetDefaultCharFormat(cf); //获取消息字体
	cf.dwMask |= CFM_COLOR;
	cf.crTextColor = clr;
	log_edit_->SetSel(lSelBegin, lSelEnd);
	log_edit_->SetSelectionCharFormat(cf);
	log_edit_->SetSel(-1, -1);
	log_edit_->EndDown();
}



}