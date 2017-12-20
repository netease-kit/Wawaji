#include "chatroom_form.h"
#include "gui/meeting_frontpage.h"
#include "module/service/notify_center.h"
#include "module/session/session_util.h"
#include "live_stream/live_stream.h"
#include "util/user.h"

namespace nim_chatroom
{
const LPTSTR ChatroomForm::kClassName = L"ChatroomForm";
using namespace ui;
ChatroomForm::ChatroomForm(__int64 room_id)
{
	room_id_ = room_id;

	exit_ = false;
	game_play_type_ = kGptNone;
	game_step_ = kGameStepEmpty;
	game_stop_ = false;
	game_get_member_try_num_ = 0;
	game_camera_front_ = true;
	game_ret_success_ = false;
	serial_ = 0;
	game_handle_ = NULL;
	paint_pic_ = false;
}

ChatroomForm::~ChatroomForm()
{
	nbase::NAutoLock auto_lock(&serial_opt_lock_);
	delete game_handle_;
	game_handle_ = NULL;
}

ui::Control* ChatroomForm::CreateControl(const std::wstring& pstrClass)
{
	if (pstrClass == _T("BitmapControl"))
	{
		return new ui::BitmapControl(&nim_comp::VideoManager::GetInstance()->video_frame_mng_);
	}
	return NULL;
}

std::wstring ChatroomForm::GetSkinFolder()
{
	return L"chatroom";
}

std::wstring ChatroomForm::GetSkinFile()
{
	return L"chatroom.xml";
}

ui::UILIB_RESOURCETYPE ChatroomForm::GetResourceType() const
{
	return ui::UILIB_RESOURCETYPE::UILIB_FILE;
}

std::wstring ChatroomForm::GetZIPFileName() const
{
	return L"chatroom.zip";
}

std::wstring ChatroomForm::GetWindowClassName() const
{
	return kClassName;
}

std::wstring ChatroomForm::GetWindowId() const
{
	return nbase::Int64ToString16(room_id_);
}

UINT ChatroomForm::GetClassStyle() const
{
	return (UI_CLASSSTYLE_FRAME | CS_DBLCLKS);
}

LRESULT ChatroomForm::OnClose(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	if (kAllowClose == wParam)
	{
		exit_ = true;
		bHandled = FALSE;
		return 0;
	}
	else
	{
		exit_ = true;
		ShowWindow(false, false);
		if (room_id_ != 0)
			ChatRoom::Exit(room_id_);
		bHandled = FALSE;
		return 0;
	}

	bHandled = TRUE;
	return 0;
}

void ChatroomForm::InitWindow()
{
	m_pRoot->AttachBubbledEvent(ui::kEventAll, nbase::Bind(&ChatroomForm::Notify, this, std::placeholders::_1));
	m_pRoot->AttachBubbledEvent(ui::kEventClick, nbase::Bind(&ChatroomForm::OnClicked, this, std::placeholders::_1));

	unregister_cb.Add(nim_comp::NotifyCenter::GetInstance()->RegNotify(NT_LINK, nbase::Bind(&ChatroomForm::OnRelink, this, std::placeholders::_1)));

	name_ = (ui::Label*)FindControl(L"title");


	screen_[0] = (ui::BitmapControl*)FindControl(L"video_screen_0");
	screen_[0]->SetAccount("1");
	screen_[1] = (ui::BitmapControl*)FindControl(L"video_screen_1");
	screen_[1]->SetAccount("2");
	screen_[2] = (ui::BitmapControl*)FindControl(L"video_screen_2");
	screen_[2]->SetAccount(nim_ui::LoginManager::GetInstance()->GetAccount());
	screen_[3] = (ui::BitmapControl*)FindControl(L"video_screen_3");

	camera_device_1_ = (Combo*)FindControl(L"camera1");
	camera_device_2_ = (Combo*)FindControl(L"camera2");
	InitDeviceList(camera_device_1_);
	InitDeviceList(camera_device_2_);
	camera_device_1_->SetDataID(L"1");
	camera_device_2_->SetDataID(L"2");

	paint_checkbox_ = (CheckBox*)FindControl(L"paint_cb");
	paint_checkbox_->Selected(false, false);
	stop_checkbox_ = (CheckBox*)FindControl(L"stop");
	stop_checkbox_->Selected(false, false);

	log_edit_ = (RichEdit*)FindControl(L"log_edit");

	{
		std::wstring dir = nim_ui::UserConfig::GetInstance()->GetUserDataPath();
		std::string path;
		nbase::ReadFileToString(dir+L"1", path);
		if (!path.empty())
		{
			nim::VChat::StartDeviceEx("1", path, 640, 480, nullptr);
		}
		nbase::ReadFileToString(dir + L"2", path);
		if (!path.empty())
		{
			nim::VChat::StartDeviceEx("2", path, 640, 480, nullptr);
		}
	}

	InitGameHandle(GetConfigValue("com_id"));
	GameReset();
	if (GetConfigValueNum("kLiveStream", 1) == 1)
	{
		WWJCameraLiveStream::GetInstance()->SetErrorCb(nbase::Bind(&ChatroomForm::OnLsErrorCb, this, std::placeholders::_1, std::placeholders::_2));
		WWJCameraLiveStream::GetInstance()->SetStartCb(nbase::Bind(&ChatroomForm::OnLsStartCb, this, std::placeholders::_1, std::placeholders::_2));
		WWJCameraLiveStream::GetInstance()->StartLiveStream();
	}
	if (GetConfigValueNum("kH5Stream", 1) == 1)
	{
		rts_stream_1_.StartRtsStream("1", nbase::StringPrintf("%lld_1", room_id_));
		rts_stream_2_.StartRtsStream("2", nbase::StringPrintf("%lld_2", room_id_));
	}
}

void ChatroomForm::OnRelink(const Json::Value &json)
{

}

LRESULT ChatroomForm::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	if (uMsg == WM_SIZE)
	{
		if (wParam == SIZE_RESTORED)
			OnWndSizeMax(false);
		else if (wParam == SIZE_MAXIMIZED)
			OnWndSizeMax(true);
	}
	else if (uMsg == WM_KEYDOWN && paint_pic_)
	{
		switch (wParam)
		{
		case VK_LEFT:
			DoGameControl(kGctMove, "left");
			break;
		case VK_RIGHT:
			DoGameControl(kGctMove, "right");
			break;
		case VK_UP:
			DoGameControl(kGctMove, "up");
			break;
		case VK_DOWN:
			DoGameControl(kGctMove, "down");
			break;
		case VK_SPACE:
			DoGameControl(kGctGo, "");
			break;
		default:
			DoGameControl(kGctAddCoins, "");
			break;
		}
	}

	return __super::HandleMessage(uMsg, wParam, lParam);
}
void ChatroomForm::OnFinalMessage(HWND hWnd)
{
	rts_stream_1_.StopRtsStream();
	rts_stream_2_.StopRtsStream();
	WWJCameraLiveStream::GetInstance()->StopLiveStream();
	EndVChat();
    CloseGameHandle();
	StopDevice();

	__super::OnFinalMessage(hWnd);
}

bool ChatroomForm::Notify(ui::EventArgs * msg)
{
	std::wstring name = msg->pSender->GetName();
	if (msg->Type == ui::kEventSelect || msg->Type == ui::kEventUnSelect)
	{
		if (name == L"camera1")
		{
			StartDevice(camera_device_1_);
		}
		else if (name == L"camera2")
		{
			StartDevice(camera_device_2_);
		}
		else if (name == L"paint_cb")
		{
			paint_pic_ = paint_checkbox_->IsSelected();
			if (!paint_pic_)
			{
				for (int i = 0; i < 4; ++i)
				{
					screen_[i]->Clear();
					screen_[i]->Invalidate();
				}
			}
		}
		else if (name == L"stop")
		{
			game_stop_ = stop_checkbox_->IsSelected();
			if (!game_stop_)
			{
				GetNextMember();
			}
		}
	}
	return true;
}

bool ChatroomForm::OnClicked(ui::EventArgs* param)
{
	std::wstring name = param->pSender->GetName();
	if (name == L"close_btn")
	{
		//if (master_)
		//{
		//	ShowMsgBox(m_hWnd, L"确定结束？", nbase::Bind(&ChatroomForm::OnEndMeeting, this, std::placeholders::_1), L"提示", L"确定结束", L"取消");
		//} 
		//else
		{
			Close();
		}
	}

	return true;
}

void ChatroomForm::OnWndSizeMax(bool max)
{
	if (!m_pRoot)
		return;

	FindControl(L"maxbtn")->SetVisible(!max);
	FindControl(L"restorebtn")->SetVisible(max);
}

void ChatroomForm::RequestRoomError(std::wstring tip)
{
	if (!exit_)
	{
		exit_ = true;
		this->Close();
		if (!tip.empty())
		{
			nim_chatroom::MeetingFrontpage* meeting_form = static_cast<nim_chatroom::MeetingFrontpage*>(nim_ui::WindowsManager::GetInstance()->GetWindow(nim_chatroom::MeetingFrontpage::kClassName, nim_chatroom::MeetingFrontpage::kClassName));
			if (meeting_form != NULL)
			{
				ShowMsgBox(meeting_form->GetHWND(), tip, nullptr, L"提示", L"确定", L"");
			}
		}
	}
}
}
