#include "chatroom_form.h"
#include "meeting_frontpage.h"
#include "base/util/string_util.h"
#include "module/video/video_manager.h"

namespace nim_chatroom
{

using namespace ui;

void ChatroomForm::InitDeviceList(Combo* combo)
{
	std::list<nim_comp::MEDIA_DEVICE_DRIVE_INFO> device;
	device = nim_comp::VideoManager::GetInstance()->GetDeviceInfo(nim::kNIMDeviceTypeVideo);

	combo->RemoveAll();

	if (device.empty())
	{
		std::wstring str = L"未找到摄像头";

		ListContainerElement* label = new ListContainerElement;
		label->SetFixedHeight(30);
		label->SetTextPadding(UiRect(10, 1, 30, 1));
		label->SetText(str);
		label->SetEnabled(false);

		combo->Add(label);
		combo->SelectItem(0);
		combo->SetEnabled(false);
	}
	else
	{
		for (auto i = device.begin(); i != device.end(); i++)
		{
			ListContainerElement* label = new ListContainerElement;
			label->SetClass(L"listitem");
			label->SetFixedHeight(30);
			label->SetTextPadding(UiRect(10, 1, 30, 1));
			label->SetUTF8Text(i->friendly_name_);
			label->SetUTF8DataID(i->device_path_);

			combo->Add(label);
		}
		combo->SetEnabled(true);
	}
}
void ChatroomForm::StartDevice(Combo* combo)
{
	nim::VChat::EndDeviceEx(combo->GetUTF8DataID());
	int k = combo->GetCurSel();
	ASSERT(k >= 0 && k < combo->GetCount());

	ListContainerElement* label = (ListContainerElement*)combo->GetItemAt(k);
	if (label)
	{
		std::string path = label->GetUTF8DataID();
		if (!path.empty())
		{
			nim::VChat::StartDeviceEx(combo->GetUTF8DataID(), path, CAMERA_W, CAMERA_H, nullptr);

			std::wstring dir = nim_ui::UserConfig::GetInstance()->GetUserDataPath();
			std::wstring file = dir + combo->GetDataID();
			nbase::WriteFile(file, path);
		}
	}
}
void ChatroomForm::StopDevice()
{
	nim::VChat::EndDeviceEx(camera_device_1_->GetUTF8DataID());
	nim::VChat::EndDeviceEx(camera_device_2_->GetUTF8DataID());
}

void ChatroomForm::PaintVideo()
{
	if (paint_pic_)
	{
		for (int i = 0; i < 4; ++i)
		{
			if (screen_[i] && screen_[i]->IsVisible() && !screen_[i]->GetAccount().empty())
			{
				bool ret = false;
				if (nim_ui::LoginManager::GetInstance()->IsEqual(screen_[i]->GetAccount()))
				{
					ret = screen_[i]->Refresh(this, true);
				}
				else
				{
					ret = screen_[i]->Refresh(this, false);
				}
				if (!ret && !screen_[i]->GetAccount().empty() && screen_[i]->IsRefreshTimeout())
				{
					screen_[i]->Clear();
					screen_[i]->Invalidate();
				}
			}
		}
	}
	if (game_step_ >= kGameStepStart)
	{
		std::string camera_id = "1";
		if (!game_camera_front_)
		{
			camera_id = "2";
		}
		int64_t time = 0;
		int32_t width = CAMERA_W;
		int32_t height = CAMERA_H;
		int32_t size = width * height * 3 / 2;
		std::string yuv_data;
		yuv_data.append(size, (char)0);
		bool ret = nim_comp::VideoManager::GetInstance()->video_frame_mng_.GetVideoFrame(camera_id, time, (char*)yuv_data.c_str(), width, height, false, false);
		if (ret)
		{
			size = width * height * 3 / 2;
			nim::VChat::CustomVideoData(0, yuv_data.c_str(), size, width, height, "");
		}
	}
}
void ChatroomForm::StartVChat(const std::string& uid, bool webrtc)
{
	if (game_step_ == kGameStepInvite)
	{
		AddText(nbase::StringPrintf("game invite %s", uid.c_str()), GAME_CLR_STEP);
		//ResetClaw();
		game_ret_timer_.Cancel();
		game_go_timer_.Cancel();
		game_start_timer_.Cancel();
		StdClosure task = nbase::Bind(&ChatroomForm::OnVChatStartCallback, this, 0);
		nbase::ThreadManager::PostDelayedTask(kThreadUI, game_start_timer_.ToWeakCallback(task), nbase::TimeDelta::FromSeconds(GAME_START_TIME_OUT));

		Json::FastWriter fs;
		Json::Value value;
		value[nim::kNIMVChatSessionId] = game_session_id_;
		value[nim::kNIMVChatUids].append(uid);
		value[nim::kNIMVChatNeedBadge] = 0;
		value[nim::kNIMVChatNeedFromNick] = 0;
		value[nim::kNIMVChatPushEnable] = 0;
		value[nim::kNIMVChatCustomVideo] = 1;
		value[nim::kNIMVChatKeepCalling] = 0;
		std::string record_key = GetConfigValue("kVideoRecord");
		if (!record_key.empty() && atoi(record_key.c_str()) > 0)
		{
			value[nim::kNIMVChatVideoRecord] = 1;
		}
		if (webrtc)
		{
			value[nim::kNIMVChatWebrtc] = 1;
		}
		if (1)
		{
			value[nim::kNIMVChatVideoQuality] = nim::kNIMVChatVideoQualitySuper;
		}
		std::string json_value = fs.write(value);
		if (!nim::VChat::Start(nim::kNIMVideoChatModeVideo, nbase::UTF16ToUTF8(L"开始游戏"), "", json_value))
		{
			AddText("vchat start error", GAME_CLR_WINNING);
			OnVChatStartCallback(0);
		}
		else
		{
			auto start_cb = nbase::Bind(&ChatroomForm::OnVChatStartCallback, this, std::placeholders::_1);
			auto connect_cb = nbase::Bind(&ChatroomForm::OnVChatConnectCallback, this, std::placeholders::_1);
			auto people_cb = nbase::Bind(&ChatroomForm::OnVChatPeopleChangeCallback, this, std::placeholders::_1, std::placeholders::_2);
			nim_comp::VideoManager::GetInstance()->SetChatRoomCb(start_cb, connect_cb, people_cb);
			screen_[3]->SetAccount(game_uid_);

			//nim::VChat::StartDevice(nim::kNIMDeviceTypeAudioIn, "", 0, 0, 0, nullptr);
		}
	}
}
void ChatroomForm::EndVChat()
{
	nim_comp::VideoManager::GetInstance()->SetChatRoomCb();
	Json::FastWriter fs;
	Json::Value value;
	value[nim::kNIMVChatSessionId] = game_session_id_;
	std::string json_value = fs.write(value);
	nim::VChat::End(json_value);

	//nim::VChat::EndDevice(nim::kNIMDeviceTypeAudioIn);
}
void ChatroomForm::OnVChatStartCallback(int code)
{
	if (game_step_ == kGameStepInvite)
	{
		if (code != 200)
		{
			EndVChat();
			GameEnd();
		}
	}
}
void ChatroomForm::OnVChatConnectCallback(int code)
{
	if (code != 200)
	{
		AddText(nbase::StringPrintf("game connect over %s, code %d", game_uid_.c_str(), code), GAME_CLR_WINNING);
		EndVChat();
		if (game_step_ == kGameStepStart)
		{
			GameTimeout();
		}
		else if (game_step_ < kGameStepStart)
		{
			GameEnd();
		}
	}
	else
	{
		nim::VChat::SetVideoFrameScaleType(nim::kNIMVChatVideoFrameScale1x1);
	}
}
void ChatroomForm::OnVChatPeopleChangeCallback(std::string uid, bool join_type)
{
	if (join_type && game_step_ == kGameStepInvite)
	{
		AddText(nbase::StringPrintf("game start %s", uid.c_str()), GAME_CLR_STEP);
		DoGameControl(kGctAddCoins, "");
		game_step_ = kGameStepStart;
		game_ret_timer_.Cancel();
		game_go_timer_.Cancel();
		game_start_timer_.Cancel();

		StdClosure task = nbase::Bind(&ChatroomForm::GameTimeout, this);
		nbase::ThreadManager::PostDelayedTask(kThreadUI, game_start_timer_.ToWeakCallback(task), nbase::TimeDelta::FromSeconds(GAME_GO_TIME_OUT));
		//std::wstring path = nim_ui::UserConfig::GetInstance()->GetUserDataPath() + L"\\self.mp4";
		//nbase::DeleteFile(path);
		//nim::VChat::StartRecord(nbase::UTF16ToUTF8(path), "", nim::VChat::Mp4OptCallback());
	}
	else if (!join_type && game_step_ == kGameStepStart)
	{
		GameTimeout();
	}
}
void ChatroomForm::OnLsErrorCb(int32_t type, int32_t code)
{
	AddText(nbase::StringPrintf("ls num %d error %d", type, code), GAME_CLR_WINNING);
}
void ChatroomForm::OnLsStartCb(int32_t type, bool ret)
{
	if (ret)
	{
		AddText(nbase::StringPrintf("ls num %d start ok", type), GAME_CLR_STEP);
	} 
	else
	{
		AddText(nbase::StringPrintf("ls num %d start fail", type), GAME_CLR_WINNING);
	}
}


}