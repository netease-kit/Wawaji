#include "login_form.h"
#include "gui/main/main_form.h"
#include "chatroom/gui/meeting_frontpage.h"


using namespace ui;

void LoginForm::DoBeforeLogin()
{
	std::string username = user_name_edit_->GetUTF8Text();
	StringHelper::Trim( username );
	std::wstring user_name_temp = nbase::UTF8ToUTF16(username);
	user_name_temp = StringHelper::MakeLowerString(user_name_temp);
	username = nbase::UTF16ToUTF8(user_name_temp);
	if( username.empty() )
	{
		usericon_->SetEnabled(false);
		ShowLoginTip(L"帐号为空");
		return;
	}

	std::string password = password_edit_->GetUTF8Text();
	StringHelper::Trim( password );
	bool def_token = false;
	if (password.empty())
	{
		WWJ_INFO wwj_info = nim_ui::LoginManager::GetInstance()->wwj_info_;
		if (!wwj_info.token_.empty())
		{
			password = wwj_info.token_;
			def_token = true;
		}
		else if (!wwj_info.password_.empty())
		{
			password = wwj_info.password_;
		}
	}
	if( password.empty() )
	{
		passwordicon_->SetEnabled(false);
		ShowLoginTip(L"密码为空");
		return;
	}

	usericon_->SetEnabled(true);
	passwordicon_->SetEnabled(true);

	StartLogin(username, password, def_token);
}

void LoginForm::DoRegisterAccount()
{
	std::string username = user_name_edit_->GetUTF8Text();
	StringHelper::Trim(username);
	std::string password = password_edit_->GetUTF8Text();
	StringHelper::Trim(password);
	std::string nickname = nick_name_edit_->GetUTF8Text();
	StringHelper::Trim(nickname);
	if (password.length() < 6 || password.length() > 128)
	{
		ShowLoginTip(L"密码为6~128位字母或者数字组合");
	}
	else if (nickname.empty())
	{
		ShowLoginTip(L"昵称为汉字、字母或数字的组合");
	}
	else 
	{
		btn_register_->SetEnabled(false);
		btn_login_->SetVisible(false);

		password = QString::GetMd5(password);
		nim_ui::UserManager::GetInstance()->InvokeRegisterAccount(username, password, nickname, ToWeakCallback([this](int res, const std::string& err_msg) {
			if (res == 200) 
			{
				register_ok_toast_->SetVisible(true);
				nbase::ThreadManager::PostDelayedTask(ToWeakCallback([this]() {
					register_ok_toast_->SetVisible(false);
				}), nbase::TimeDelta::FromSeconds(2));

				nbase::ThreadManager::PostDelayedTask(ToWeakCallback([this]() {
					SetTaskbarTitle(L"登录");
					FindControl(L"enter_panel")->SetBkImage(L"user_password.png");
					FindControl(L"nick_name_panel")->SetVisible(false);
					FindControl(L"enter_login")->SetVisible(false);
					FindControl(L"register_account")->SetVisible(true);
					btn_register_->SetEnabled(true);
					btn_register_->SetVisible(false);
					btn_login_->SetVisible(true);
				}), nbase::TimeDelta::FromMilliseconds(2500));
			}
			else
			{
				if (res == 601) {
					ShowLoginTip(L"帐号为6~32位字母或者数字组合");
				}
				else if (res == 602) {
					ShowLoginTip(L"此帐号已存在");
				}
				else if (res == 603) {
					ShowLoginTip(L"输入昵称超长");
				}
				else {
					ShowLoginTip(nbase::UTF8ToUTF16(err_msg));
				}
				btn_register_->SetEnabled(true);
			}
		}));
	}

}

void LoginForm::StartLogin( std::string username, std::string password, bool md5)
{
	user_name_edit_->SetEnabled(false);
	password_edit_->SetEnabled(false);

	login_error_tip_->SetVisible(false);
	login_ing_tip_->SetVisible(true);

	btn_login_->SetVisible(false);
	btn_cancel_->SetVisible(true);

	nim_ui::LoginManager::GetInstance()->DoLogin(username, password, md5);
}

void LoginForm::RegLoginManagerCallback()
{
	nim_ui::OnLoginError cb_result = [this](int error){
		this->OnLoginError(error);
	};

	nim_ui::OnCancelLogin cb_cancel = [this]{
		this->OnCancelLogin();
	};

	nim_ui::OnHideWindow cb_hide = [this]{
		this->ShowWindow(false, false);
	};

	nim_ui::OnDestroyWindow cb_destroy = [this]{
		::DestroyWindow(this->GetHWND());
	};

	//nim_ui::OnShowMainWindow cb_show_main = [this]{
	//	nim_ui::WindowsManager::SingletonShow<MainForm>(MainForm::kClassName);
	//};
	nim_ui::OnShowMainWindow cb_show_chatroom = [this] {
		//gq meeting demo
		nim_ui::WindowsManager::SingletonShow<nim_chatroom::MeetingFrontpage>(nim_chatroom::MeetingFrontpage::kClassName);
	};

	nim_ui::LoginManager::GetInstance()->RegLoginManagerCallback(ToWeakCallback(cb_result),
		ToWeakCallback(cb_cancel),
		ToWeakCallback(cb_hide),
		ToWeakCallback(cb_destroy),
		ToWeakCallback(cb_show_chatroom));
}

void LoginForm::OnLoginError( int error )
{
	OnCancelLogin();

	if (error == nim::kNIMResUidPassError)
	{
		usericon_->SetEnabled(false);
		passwordicon_->SetEnabled(false);
		ShowLoginTip(L"用户名或密码错误，请重新输入");
	}
	else if (error == nim::kNIMResConnectionError)
	{
		ShowLoginTip(L"网络出现问题，请确认网络连接");
	}
	else if (error == nim::kNIMResExist)
	{
		ShowLoginTip(L"你在其他设备上登录过，请重新登录");
	}
	else
	{
		std::wstring tip = nbase::StringPrintf(L"登录失败，错误码：%d", error);
		ShowLoginTip(tip);
	}
}

void LoginForm::OnCancelLogin()
{
	usericon_->SetEnabled(true);
	passwordicon_->SetEnabled(true);

	user_name_edit_->SetEnabled(true);
	password_edit_->SetEnabled(true);

	login_ing_tip_->SetVisible(false);
	login_error_tip_->SetVisible(false);

	btn_login_->SetVisible(true);
	btn_cancel_->SetVisible(false);
	btn_cancel_->SetEnabled(true);
}

void LoginForm::ShowLoginTip(std::wstring tip_text)
{
	login_ing_tip_->SetVisible(false);

	login_error_tip_->SetText(tip_text);
	login_error_tip_->SetVisible(true);
}
void LoginForm::InitWWJInfo()
{
	nim_ui::LoginManager::GetInstance()->wwj_info_.uid_ = GetConfigValue("kAccount");
	nim_ui::LoginManager::GetInstance()->wwj_info_.password_ = GetConfigValue("kPwd");
	nim_ui::LoginManager::GetInstance()->wwj_info_.room_id_ = GetConfigValue("kRoomId");
	nim_ui::LoginManager::GetInstance()->wwj_info_.push_url1_ = GetConfigValue("pushUrl1");
	nim_ui::LoginManager::GetInstance()->wwj_info_.push_url2_ = GetConfigValue("pushUrl2");
	std::string query_key = GetConfigValue("kQueryKey");
	if (!query_key.empty())
	{
		auto http_cb = [this](bool ret, int response_code, const std::string& reply)
		{
			int32_t code = response_code;
			if (ret && response_code == 200)
			{
				Json::Value values;
				Json::Reader reader;
				if (reader.parse(reply, values))
				{
					code = values["code"].asInt();
					if (code==200 && values["data"].isObject())
					{
						WWJ_INFO wwj_info;
						wwj_info.uid_ = values["data"]["creator"].asString();
						wwj_info.token_ = values["data"]["creatorToken"].asString();
						wwj_info.room_id_ = values["data"]["roomId"].asString();
						wwj_info.push_url1_ = values["data"]["pushUrl1"].asString();
						wwj_info.push_url2_ = values["data"]["pushUrl2"].asString();
						nim_ui::LoginManager::GetInstance()->wwj_info_ = wwj_info;
						ResetWWJInfo();
						Post2UI(nbase::Bind(&LoginForm::DoBeforeLogin, this));
					}
				}
			}
		};
		std::string api_addr = GetConfigValue("kTestUrl");
		if (api_addr.empty())
		{
			api_addr = "https://apptest.netease.im/appdemo";
		}
		api_addr += "/dollsCatcher/host/query";
		api_addr = nbase::StringPrintf("%s?roomId=%s", api_addr.c_str(), query_key.c_str());
		nim_http::HttpRequest request(api_addr, "", 0, ToWeakCallback(http_cb));
		request.AddHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		request.SetMethodAsPost();
		nim_http::PostRequest(request);
	}
	else
	{
		ResetWWJInfo();
		WWJ_INFO wwj_info = nim_ui::LoginManager::GetInstance()->wwj_info_;
		if (!wwj_info.uid_.empty() && \
			!wwj_info.password_.empty() && \
			!wwj_info.room_id_.empty() && \
			!wwj_info.push_url1_.empty() && \
			!wwj_info.push_url2_.empty())
		{
			Post2UI(nbase::Bind(&LoginForm::DoBeforeLogin, this));
		}
	}
}
void LoginForm::ResetWWJInfo()
{
	user_name_edit_->SetUTF8Text(nim_ui::LoginManager::GetInstance()->wwj_info_.uid_);
}
