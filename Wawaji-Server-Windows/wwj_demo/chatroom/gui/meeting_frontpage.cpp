#include "meeting_frontpage.h"
#include "chatroom_form.h"
#include "callback/chatroom_callback.h"
#include "shared/xml_util.h"
#include "shared/ui/ui_menu.h"
#include "base/util/string_number_conversions.h"
#include "gui/about/about_form.h"
#include "util/user.h"

namespace nim_chatroom
{
const LPTSTR MeetingFrontpage::kClassName = L"MeetingFrontpage";
using namespace ui;
#define LOGOFF_MSG	101

MeetingFrontpage::MeetingFrontpage()
{
}

MeetingFrontpage::~MeetingFrontpage()
{
}

std::wstring MeetingFrontpage::GetSkinFolder()
{
	return L"chatroom";
}

std::wstring MeetingFrontpage::GetSkinFile()
{
	return L"meeting_frontpage.xml";
}

ui::UILIB_RESOURCETYPE MeetingFrontpage::GetResourceType() const
{
	return ui::UILIB_RESOURCETYPE::UILIB_FILE;
}

std::wstring MeetingFrontpage::GetZIPFileName() const
{
	return L"meeting_frontpage.zip";
}

std::wstring MeetingFrontpage::GetWindowClassName() const
{
	return kClassName;
}

std::wstring MeetingFrontpage::GetWindowId() const
{
	return kClassName;
}

UINT MeetingFrontpage::GetClassStyle() const
{
	return (UI_CLASSSTYLE_FRAME | CS_DBLCLKS);
}

void MeetingFrontpage::InitWindow()
{
	m_pRoot->AttachBubbledEvent(ui::kEventClick, nbase::Bind(&MeetingFrontpage::OnClicked, this, std::placeholders::_1));

	id_edit_ = (ui::RichEdit*)FindControl(L"edit_room_id");
	name_edit_ = (ui::RichEdit*)FindControl(L"edit_room_name");
	InitHeader();

	ui::Button* menu_button = (ui::Button*)FindControl(L"menu_button");
	menu_button->AttachClick(nbase::Bind(&MeetingFrontpage::MainMenuButtonClick, this, std::placeholders::_1));

	unregister_cb.Add(nim_ui::UserManager::GetInstance()->RegUserInfoChange(nbase::Bind(&MeetingFrontpage::OnUserInfoChange, this, std::placeholders::_1)));
	unregister_cb.Add(nim_ui::PhotoManager::GetInstance()->RegPhotoReady(nbase::Bind(&MeetingFrontpage::OnUserPhotoReady, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)));

	std::string def_rooom_id = nim_ui::LoginManager::GetInstance()->wwj_info_.room_id_;
	if (!def_rooom_id.empty())
	{
		id_edit_->SetUTF8Text(def_rooom_id);
		Post2UI(nbase::Bind(&MeetingFrontpage::OnJoinRoom, this));
	}
}

LRESULT MeetingFrontpage::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{

	return __super::HandleMessage(uMsg, wParam, lParam);
}

bool MeetingFrontpage::Notify(ui::EventArgs * msg)
{
	return false;
}
bool MeetingFrontpage::OnClicked(ui::EventArgs * msg)
{
	std::wstring name = msg->pSender->GetName();
	if (name == L"close_btn")
	{
		auto cb = [this](MsgBoxRet ret)
		{
			if (ret == MB_YES)
			{
				Close();
			}
		};
		ShowMsgBox(m_hWnd, L"确定退出程序？", ToWeakCallback(nbase::Bind(cb, std::placeholders::_1)), L"提示", L"确定", L"取消");
	}
	else if (name == L"join_room")
	{
		OnJoinRoom();
	}
	//else if (name == L"create_room")
	//{
	//	std::string name = name_edit_->GetUTF8Text();
	//	if (name.empty())
	//	{
	//		ShowMsgBox(m_hWnd, L"房间名称不能为空！", nullptr, L"提示", L"确定", L"");
	//	} 
	//	else
	//	{
	//		CreateMyRoomInfo(name, "announcement", "ext");
	//	}
	//}
	return false;
}

LRESULT MeetingFrontpage::OnClose(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bool chatroom = false;
	nim_comp::WindowList list = nim_ui::WindowsManager::GetInstance()->GetWindowsByClassName(ChatroomForm::kClassName);
	for (auto &it : list)
	{
		ChatroomForm* form = static_cast<ChatroomForm*>(it);
		form->Close();
		chatroom = true;
	}
	if (chatroom)
	{
		nbase::ThreadManager::PostDelayedTask(nbase::Bind(&MeetingFrontpage::Logout, this, wParam == LOGOFF_MSG), nbase::TimeDelta::FromSeconds(2));
	} 
	else
	{
		Logout(wParam == LOGOFF_MSG);
	}
	bHandled = TRUE;
	return 0;
}
void MeetingFrontpage::Logout(bool logoff)
{
	LoginStatus status = nim_comp::LoginManager::GetInstance()->GetLoginStatus();
	if (status == LoginStatus_EXIT)
		return;
	if (logoff)
	{
		QCommand::Set(kCmdRestart, L"true");
		std::wstring wacc = nbase::UTF8ToUTF16(nim_ui::LoginManager::GetInstance()->GetAccount());
		QCommand::Set(kCmdAccount, wacc);
		nim_ui::LoginManager::GetInstance()->DoLogout(false, nim::kNIMLogoutChangeAccout);
	}
	else
	{
		nim_ui::LoginManager::GetInstance()->DoLogout(false);
	}
}

void MeetingFrontpage::OnUserInfoChange(const std::list<nim::UserNameCard> &uinfos)
{
	for (auto iter = uinfos.cbegin(); iter != uinfos.cend(); iter++)
	{
		if (nim_ui::LoginManager::GetInstance()->IsEqual(iter->GetAccId()))
		{
			InitHeader();
			break;
		}
	}
}

void MeetingFrontpage::OnUserPhotoReady(PhotoType type, const std::string& account, const std::wstring& photo_path)
{
	if (type == kUser && nim_ui::LoginManager::GetInstance()->GetAccount() == account)
		FindControl(L"header_image")->SetBkImage(photo_path);
}

void MeetingFrontpage::InitHeader()
{
	std::string my_id = nim_ui::LoginManager::GetInstance()->GetAccount();
	nim_ui::UserManager* user_service = nim_ui::UserManager::GetInstance();
	FindControl(L"header_image")->SetBkImage(nim_ui::PhotoManager::GetInstance()->GetUserPhoto(my_id));
	((ui::Label*)FindControl(L"name"))->SetText(user_service->GetUserName(my_id, false));
}
bool MeetingFrontpage::CheckRoomSingle()
{
	nim_comp::WindowList list = nim_ui::WindowsManager::GetInstance()->GetWindowsByClassName(ChatroomForm::kClassName);
	if (list.size() > 0)
	{
		return false;
	}

	return !create_room_;
}
void MeetingFrontpage::OnJoinRoom()
{
	std::wstring edit_txt = id_edit_->GetText();
	uint64_t id = 0;
	nbase::StringToUint64(edit_txt, &id);
	if (id == 0)
	{
		ShowMsgBox(m_hWnd, L"房间不存在！", nullptr, L"提示", L"确定", L"");
	}
	else
	{
		JoinRoom(id);
	}
}

void MeetingFrontpage::JoinRoom(int64_t id)
{
	if (!CheckRoomSingle())
	{
		ShowMsgBox(GetHWND(), L"已存在正在进行的会话", nullptr, L"提示", L"确定", L"");
		return;
	}
	if (id != 0)
	{
		ChatroomForm* chat_form = new ChatroomForm(id);
		chat_form->Create(NULL, ChatroomForm::kClassName, WS_OVERLAPPEDWINDOW & ~WS_MAXIMIZEBOX, 0, false);
		//chat_form->CenterWindow();
		//chat_form->ShowWindow();
		chat_form->RequestEnter(id);
	}
}

//收到会议相关权限消息
void MeetingFrontpage::RecMeetingMsg(const std::string &uid, const std::string json)
{
	Json::Value value;
	Json::Reader reader;
	if (reader.parse(json, value) && value.isObject())
	{
		nim_comp::WindowList list = nim_ui::WindowsManager::GetInstance()->GetWindowsByClassName(ChatroomForm::kClassName);
		if (list.size() > 0)
		{
			((ChatroomForm*)list.front())->RecMeetingMsg(uid, json);
		}
	}
}
bool MeetingFrontpage::MainMenuButtonClick(ui::EventArgs* param)
{
	RECT rect = param->pSender->GetPos();
	CPoint point;
	point.x = rect.left - 15;
	point.y = rect.bottom + 10;
	ClientToScreen(m_hWnd, &point);
	PopupMainMenu(point);
	return true;
}

void MeetingFrontpage::PopupMainMenu(POINT point)
{
	//创建菜单窗口
	CMenuWnd* pMenu = new CMenuWnd(NULL);
	STRINGorID xml(L"main_menu2.xml");
	pMenu->Init(xml, _T("xml"), point);
	//注册回调
	EventCallback look_log_cb = [this](ui::EventArgs* param){
		std::wstring dir = nim_ui::UserConfig::GetInstance()->GetUserDataPath();
		std::wstring tip = nbase::StringPrintf(L"当前用户数据目录：%s", dir.c_str());
		ShowMsgBox(m_hWnd, tip, MsgboxCallback(), L"提示", L"知道了", L"");
		auto cb_open_dir = [dir](){
			HINSTANCE inst = ::ShellExecute(NULL, L"open", dir.c_str(), NULL, NULL, SW_SHOW);
			int ret = (int)inst;
			if (ret > 32)
			{
				QLOG_APP(L"open user data path: {0}") << dir.c_str();
			}
			else
			{
				QLOG_ERR(L"failed to open user data path: {0}") << dir.c_str();
			}
		};
		nbase::ThreadManager::PostTask(kThreadGlobalMisc, cb_open_dir);
		return false;
	};
	CMenuElementUI* look_log = (CMenuElementUI*)pMenu->FindControl(L"look_log");
	look_log->AttachSelect(look_log_cb);

	EventCallback about_cb = [this](ui::EventArgs* param){
		nim_ui::WindowsManager::SingletonShow<AboutForm>(AboutForm::kClassName);
		return false;
	};
	CMenuElementUI* about = (CMenuElementUI*)pMenu->FindControl(L"about");
	about->AttachSelect(about_cb);

	EventCallback logoff_cb = [this](ui::EventArgs* param){
		Close(LOGOFF_MSG);
		return true;
	};
	CMenuElementUI* logoff = (CMenuElementUI*)pMenu->FindControl(L"logoff");
	logoff->AttachSelect(logoff_cb);

	EventCallback quit_cb = [this](ui::EventArgs* param){
		Close();
		return true;
	};
	CMenuElementUI* quit = (CMenuElementUI*)pMenu->FindControl(L"quit");
	quit->AttachSelect(quit_cb);
	//显示
	pMenu->Show();
}

}