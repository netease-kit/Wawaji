#include "chatroom_form.h"
//#include "game_cmd/serial_win32.h"

namespace nim_chatroom
{
using namespace nim_wwj;
using namespace ui;

typedef std::function<void(nim_wwj::wwj_callback_func_type_e type, int code, nim_wwj::wwj_device_status_e status)> WWJ_CB;
WWJ_CB wwj_cb_ = nullptr;
void on_wwj_callback(nim_wwj::wwj_callback_func_type_e type, int code, nim_wwj::wwj_device_status_e status)
{
	if (wwj_cb_)
	{
		Post2UI(nbase::Bind(wwj_cb_, type, code, status));
	}
}
int32_t GetConfigValueNum(const std::string& key, int32_t def_value)
{
	int32_t ret = def_value;
	std::string value = GetConfigValue(key);
	if (!value.empty())
	{
		ret = atoi(value.c_str());
	}
	return ret;
}
void ChatroomForm::RecGameControl(const std::string &uid, int32_t command, const std::string &data, int64_t serial)
{
	//AddText(nbase::StringPrintf("rec:%s, cmd:%d, data:%s", uid.c_str(), command, data.c_str()));
	//if (command == 0)
	//{
	//	game_uid_ == uid;
	//}
	int32_t ret = -1;
	if (uid == game_uid_)
	{
		switch (command)
		{
		case kGctMove:
		{
			if (game_step_ == kGameStepStart)
			{
				ret = DoGameControl(command, data);
			}
			break;
		}
		case kGctGo:
		{
			if (game_step_ == kGameStepStart)
			{
				AddText("rec gamer go");
				GameTimeout();
				ret = 0;
			}
			break;
		}
		case kGctCamera:
		{
			if (data == "1")
			{
				game_camera_front_ = true;
				ret = 0;
				screen_[2]->SetAccount("1");
			}
			else if (data == "2")
			{
				game_camera_front_ = false;
				ret = 0;
				screen_[2]->SetAccount("2");
			}
			break;
		}
		case kGctH5Accpt:
		case kGctH5Reject:
		{
			if (game_step_ == kGameStepInvite && data == game_session_id_ && game_play_type_ == kGptH5)
			{
				if (command == kGctH5Accpt)
				{
					GameStart();
				}
				else if (command == kGctH5Reject)
				{
					GameEnd();
				}
			}
			break;
		}
		}
	}
	QLOG_APP(L"rec control step:{0}, cmd:{1}, data:{2}, ret:{3}") << game_step_ << command << data << ret;
	if (1)
	{
		int32_t code = 0;
		if (ret == 0)
		{
			code = 200;
		}
		Json::FastWriter fs;
		Json::Value value;
		value["command"] = kGctAck;
		value["data"]["command"] = command;
		value["data"]["data"] = data;
		value["serial"] = serial;
		value["code"] = code;
		std::string json_value = fs.write(value);
		SendP2PCustomMsg(uid, json_value, false);
	}
}
int32_t ChatroomForm::DoGameControl(int32_t command, const std::string &data)
{
	
	int32_t ret = -1;
	switch (command)
	{
	case kGctMove:
	{
		nbase::ThreadManager::PostTask(kThreadSerialOpt, ToWeakCallback([=]()
		{
			nbase::NAutoLock auto_lock(&serial_opt_lock_);
			if (data == "left")
			{
				 game_handle_->SerialDirectectOpt(kleft);
			}
			else if (data == "right")
			{
				game_handle_->SerialDirectectOpt(kright);
			}
			else if (data == "up")
			{
				 game_handle_->SerialDirectectOpt(kfront);
			}
			else if (data == "down")
			{
				 game_handle_->SerialDirectectOpt(kback);
			}
		}));
		ret = true;
		break;
	}
	case kGctGo:
	{
		ret = game_handle_->SerialDirectectOpt(kclaw);
		break;
	}
	case kGctAddCoins:
	{
		game_handle_->Pay(1);
		break;
	}
	}
	return ret;
}

bool ChatroomForm::InitGameHandle(const std::string &com)
{
	if (game_handle_ == NULL)
	{
		SerialControlFactory factory;
		int32_t mainbord_index=GetConfigValueNum("kGameMainBordIndex", 0);
		game_handle_ = factory.createWwjControl((nim_wwj::PRODUCTTYPE)mainbord_index);
	}
	game_handle_->CloseSerial();
	if (game_handle_->OpenSerial(com.c_str()))
	{
		serial_param_t param;
		param.bound_rate = GetConfigValueNum("kGameMainBoardBaudRate", 38400);
		param.byte_size = 8;
		param.stop_bits = 1;
		param.fbinary = 1;
		param.fparity = 0;
		param.parity = NOPARITY;
		if (game_handle_->SetSerialParam(param))
		{
			game_handle_->SetOptFuncCb(on_wwj_callback);
			//初始化娃娃机设置参数
			wwj_set_param_t set_param = game_handle_->GetSettingParam();
			set_param.prize_pattern = GetConfigValueNum("kGamePrizePattern", 0);
			set_param.power_time = GetConfigValueNum("kGamePowerTime", 20);
			set_param.power_claw = GetConfigValueNum("kGamePowerClaw", 38);
			set_param.top_claw_power = GetConfigValueNum("kGameTopPower", 20);
			set_param.weak_claw_power = GetConfigValueNum("kGameWeakPower", 20);
			game_handle_->SetSettingParam(set_param);
			//初始化天车移动的步进值
			game_handle_->SerialSetStepSize(GetConfigValueNum("kGameStepSize", 70));
			wwj_cb_ = nbase::Bind(&ChatroomForm::OnGameRetCallback, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3);

			AddText("Init Game Ok!", GAME_CLR_STEP);
			return true;
		}
	}
	AddText("Init Game Error!", GAME_CLR_WINNING);
	return false;
}
void ChatroomForm::CheckGameHanle()
{
	game_handle_->QueryDeviceInfo();
}
void ChatroomForm::OnGameRetCallback(int32_t type, int32_t code, int32_t status)
{
	AddText(nbase::StringPrintf("game ret type %d, code %d status %d step %d", type, code, status, game_step_));
	if (type == kgamecheckaccount)
	{
		std::wstring error_tip;
		switch (status)
		{
		case error:
			error_tip = L"串口调用失败";
			break;
		case left_error:
			error_tip = L"向左故障";
			break;
		case right_error:
			error_tip = L"向右故障";
			break;
		case front_error:
			error_tip = L"向前故障";
			break;
		case back_error:
			error_tip = L"向后故障";
			break;
		case down_error:
			error_tip = L"向上故障";
			break;
		case up_error:
			error_tip = L"向右故障";
			break;
		case shake_error:
			error_tip = L"摇晃故障";
			break;
		case light_eye_error:
			error_tip = L"光眼故障";
			break;
		}
		if (!error_tip.empty())
		{
			AddText(nbase::UTF16ToUTF8(error_tip), GAME_CLR_WINNING);
		}
	}
	else if (type == kgamepay)
	{
		if (code != 200)
		{
			AddText("!!add coins err!!", GAME_CLR_WINNING);
		}
		else
		{//移动下天车，保证游戏进行
			DoGameControl(kGctMove, "right");
		}
	}
	else if (game_step_ == kGameStepClaw && type == kgameend)
	{
		game_step_ = kGameStepEnd;
		StdClosure task = nbase::Bind(&ChatroomForm::GameEnd, this);
		nbase::ThreadManager::PostDelayedTask(kThreadUI, game_ret_timer_.ToWeakCallback(task), nbase::TimeDelta::FromSeconds(GAME_END_TIME_OUT));
	}
	else if (game_step_ == kGameStepEnd && type == kgameprize)
	{
		AddText(nbase::StringPrintf("game success %d", code), GAME_CLR_STEP);
		if (code == kSerialOptSuccess)
			game_ret_success_ = true;
		else
			game_ret_success_ = false;
		GameEnd();
	}
}
bool ChatroomForm::CloseGameHandle()
{
	game_handle_->CloseSerial();
	return true;
}
bool ChatroomForm::ResetClaw()
{
	if (game_handle_->CrownBlockReset())
	{
		return true;
	}
	return false;
}
void ChatroomForm::GameInvite(const std::string& uid)
{
	if (game_step_ == kGameStepInvite)
	{
		AddText(nbase::StringPrintf("game invite %s", uid.c_str()), GAME_CLR_STEP);
		//ResetClaw();
		game_ret_timer_.Cancel();
		game_go_timer_.Cancel();
		game_start_timer_.Cancel();
		StdClosure task = nbase::Bind(&ChatroomForm::GameEnd, this);
		nbase::ThreadManager::PostDelayedTask(kThreadUI, game_start_timer_.ToWeakCallback(task), nbase::TimeDelta::FromSeconds(GAME_START_TIME_OUT));


		switch (game_play_type_)
		{
			break;
		case kGptWebrtc:
			StartVChat(uid, true);
			break;
		case kGptH5:
			H5Invite(uid);
			break;
		case kGptVChat:
		default:
			StartVChat(uid, false);
			break;
		}
	}
}
void ChatroomForm::GameStart()
{
	AddText(nbase::StringPrintf("game start %s", game_uid_.c_str()), GAME_CLR_STEP);
	DoGameControl(kGctAddCoins, "");
	game_step_ = kGameStepStart;
	game_ret_timer_.Cancel();
	game_go_timer_.Cancel();
	game_start_timer_.Cancel();

	StdClosure task = nbase::Bind(&ChatroomForm::GameTimeout, this);
	nbase::ThreadManager::PostDelayedTask(kThreadUI, game_start_timer_.ToWeakCallback(task), nbase::TimeDelta::FromSeconds(GAME_GO_TIME_OUT));
}
void ChatroomForm::GameTimeout()
{
	if (game_step_ == kGameStepStart)
	{
		AddText("gamer go", GAME_CLR_STEP);
		game_step_ = kGameStepClaw;

		game_go_timer_.Cancel();
		game_ret_timer_.Cancel();
		game_start_timer_.Cancel();
		StdClosure claw_task = nbase::Bind(&ChatroomForm::GameClaw, this);
		nbase::ThreadManager::PostDelayedTask(kThreadUI, game_ret_timer_.ToWeakCallback(claw_task), nbase::TimeDelta::FromMilliseconds(100));
		StdClosure task = nbase::Bind(&ChatroomForm::GameEnd, this);
		nbase::ThreadManager::PostDelayedTask(kThreadUI, game_ret_timer_.ToWeakCallback(task), nbase::TimeDelta::FromSeconds(GAME_RET_TIME_OUT));
	}
}
void ChatroomForm::GameClaw()
{
	int32_t ret = DoGameControl(kGctGo, "");
	QLOG_APP(L"game control go! ret {0}") << ret;
}
void ChatroomForm::GameEnd()
{
	EndVChat();
	nim_chatroom::ChatRoom::QueuePollCallback cb = nim_chatroom::ChatRoom::QueuePollCallback();
	if (game_step_ >= kGameStepClaw)
	{
		Json::FastWriter fs;
		Json::Value value;
		value["command"] = kGctRetNotify;
		value["data"] = game_ret_success_ ? "true" : "false";
		value["serial"] = GetSerial();
		std::string json_value = fs.write(value);
		auto task = nbase::Bind(&ChatroomForm::SendP2PCustomMsg, this, game_uid_, json_value, false);
		cb = nbase::Bind(&ChatroomForm::QueuePollCb, this, task, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3);
		QLOG_APP(L"Add ret msg Send {0} {1}") << game_uid_ << json_value;
	}
	nim_chatroom::ChatRoom::QueuePollAsync(room_id_, game_que_key_, cb, "");
	game_ret_timer_.Cancel();
	game_go_timer_.Cancel();
	game_start_timer_.Cancel();
	AddText(nbase::StringPrintf("game over %s, ret %d", game_uid_.c_str(), game_ret_success_), GAME_CLR_STEP);

	GameReset();

	GetNextMember();
}
void ChatroomForm::GameReset()
{
	game_play_type_ = kGptNone;
	game_step_ = kGameStepEmpty;
	game_ret_success_ = false;
	game_camera_front_ = true;
	game_uid_ = "";
	game_que_key_ = "";
	game_session_id_ = "";
	game_get_member_try_num_ = 0;
	screen_[2]->SetAccount("1");
	screen_[3]->SetAccount("");
}
void ChatroomForm::QueuePollCb(const StdClosure &task, int64_t room_id, int error_code, const ChatRoomQueueElement& element)
{
	QLOG_APP(L"QueuePollCb {0} {1}") << room_id << error_code;
	Post2UI(task);
}
int64_t ChatroomForm::GetSerial()
{
	return ++serial_;
}

void ChatroomForm::H5Invite(const std::string& uid)
{
	Json::FastWriter fs;
	Json::Value value;
	value["command"] = kGctH5Invite;
	value["data"] = game_session_id_;
	value["serial"] = GetSerial();
	std::string json_value = fs.write(value);
	SendP2PCustomMsg(uid, json_value, false);
}

}