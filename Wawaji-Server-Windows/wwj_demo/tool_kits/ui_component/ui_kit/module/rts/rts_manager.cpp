
#include "rts_manager.h"
#include "../video/video_manager.h"

namespace nim_comp
{
	RtsManager::RtsManager()
	{

	}

	RtsManager::~RtsManager()
	{

	}

	bool RtsManager::StartRtsForm(int channel_type, std::string uid, std::string session_id)
	{
		RtsForm *rts_form = (RtsForm*)GetRtsFromBySessionId(session_id);
		if (rts_form)
		{
			if (session_id.empty())
			{
				rts_form->ShowWindow();
				::BringWindowToTop(rts_form->GetHWND());
			}
			return false;
		}
		else
		{
			if ((channel_type & nim::kNIMRtsChannelTypeVchat) > 0)
			{
				if (IsRtsFormExist(nim::kNIMRtsChannelTypeVchat, true) || VideoManager::GetInstance()->IsVideoChatFormExist(true))
				{
					return false;
				}
			}
			bool my_rts = false;
			if (session_id.empty())
			{
				session_id = QString::GetGUID();
				my_rts = true;
			}
			RtsForm *window = new RtsForm(channel_type, uid, session_id);
			window->Create(NULL, L"白板", WS_OVERLAPPEDWINDOW & ~WS_MAXIMIZEBOX, 0);
			window->CenterWindow();
			window->ShowWindow();
			window->ShowStartUI(my_rts);
			::BringWindowToTop(window->GetHWND());
			return true;
		}
		return false;
	}

	void RtsManager::OnStartRtsNotify(const std::string& session_id, int channel_type, const std::string& uid, const std::string& custom_info)
	{
		if (!StartRtsForm(channel_type, uid, session_id))
		{
			nim::Rts::Ack(session_id, channel_type, false, false, false, nim::Rts::AckCallback());
		}
	}
	void RtsManager::OnAckNotifyCallback(const std::string& session_id, int channel_type, bool accept, const std::string& uid)
	{
		RtsForm *rts_form = (RtsForm*)GetRtsFromBySessionId(session_id);
		if (rts_form)
		{
			rts_form->OnAckNotifyCallback(session_id, channel_type, accept, uid);
		}
	}
	void RtsManager::OnSyncAckNotifyCallback(const std::string& session_id, int channel_type, bool accept)
	{
		RtsForm *rts_form = (RtsForm*)GetRtsFromBySessionId(session_id);
		if (rts_form)
		{
			rts_form->OnSyncAckNotifyCallback(session_id, channel_type, accept);
		}
	}
	void RtsManager::OnConnectNotifyCallback(const std::string& session_id, int channel_type, int code, const std::string& json)
	{
		QLOG_ERR(L"OnConnectNotifyCallback {0} {1} {2}, json:{3}") << session_id << channel_type << code << json;
		RtsForm *rts_form = (RtsForm*)GetRtsFromBySessionId(session_id);
		if (rts_form)
		{
			rts_form->OnConnectNotifyCallback(session_id, channel_type, code, json);
		}
		else
		{
			RtsStatusCbInfo *cb_info = GetRtsStatusCbBySessionId(session_id);
			if (cb_info && cb_info->connect_cb_)
			{
				cb_info->connect_cb_(session_id, channel_type, code, json);
			}
		}
	}
	void RtsManager::OnMemberNotifyCallback(const std::string& session_id, int channel_type, const std::string& uid, int code)
	{
		RtsForm *rts_form = (RtsForm*)GetRtsFromBySessionId(session_id);
		if (rts_form)
		{
			rts_form->OnMemberNotifyCallback(session_id, channel_type, uid, code);
		}
		else
		{
			RtsStatusCbInfo *cb_info = GetRtsStatusCbBySessionId(session_id);
			if (cb_info && cb_info->member_cb_)
			{
				cb_info->member_cb_(session_id, channel_type, uid, code, 0);
			}
		}
	}
	void RtsManager::OnHangupNotifyCallback(const std::string& session_id, const std::string& uid)
	{
		RtsForm *rts_form = (RtsForm*)GetRtsFromBySessionId(session_id);
		if (rts_form)
		{
			rts_form->OnHangupNotifyCallback(session_id, uid);
		}
	}
	void RtsManager::OnControlNotifyCallback(const std::string& session_id, const std::string& info, const std::string& uid)
	{
		QLOG_ERR(L"OnControlNotifyCallback {0} {1} {2}") << session_id << info << uid;
		RtsForm *rts_form = (RtsForm*)GetRtsFromBySessionId(session_id);
		if (rts_form)
		{
			rts_form->OnControlNotify(session_id, uid, info);
		}
	}
	void RtsManager::OnRecDataCallback(const std::string& session_id, int channel_type, const std::string& uid, const std::string& data)
	{
		RtsForm *rts_form = (RtsForm*)GetRtsFromBySessionId(session_id);
		if (rts_form)
		{
			rts_form->OnRecDataCallback(session_id, channel_type, uid, data);
		}
		else
		{
			RtsStatusCbInfo *cb_info = GetRtsStatusCbBySessionId(session_id);
			if (cb_info && cb_info->rec_data_cb_)
			{
				cb_info->rec_data_cb_(session_id, channel_type, uid, data);
			}
		}
	}
	WindowEx* RtsManager::GetRtsFromBySessionId(const std::string& session_id)
	{
		WindowList wnd_list = WindowsManager::GetInstance()->GetWindowsByClassName(RtsForm::kClassName);
		for (auto it : wnd_list)
		{
			RtsForm *rts_form = dynamic_cast<RtsForm*>(it);
			if (rts_form->GetSessionId() == session_id)
			{
				return rts_form;
			}
		}
		return nullptr;
	}
	bool RtsManager::IsRtsFormExist(int channel_type, bool show)
	{
		WindowList wnd_list = WindowsManager::GetInstance()->GetWindowsByClassName(RtsForm::kClassName);
		for (auto it : wnd_list)
		{
			RtsForm *rts_form = dynamic_cast<RtsForm*>(it);
			if ((rts_form->GetType() & channel_type) > 0)
			{
				rts_form->ShowWindow();
				::BringWindowToTop(rts_form->GetHWND());
				return true;
			}
		}
		return false;
	}
	void RtsManager::AddRtsStatusCb(const std::string& session_id, RtsStatusCbInfo info)
	{
		map_rts_cb_list_[session_id] = info;
	}
	void RtsManager::RemoveRtsStatusCb(const std::string& session_id)
	{
		auto it = map_rts_cb_list_.find(session_id);
		if (it != map_rts_cb_list_.end())
		{
			map_rts_cb_list_.erase(it);
		}
	}
	RtsStatusCbInfo* RtsManager::GetRtsStatusCbBySessionId(const std::string& session_id)
	{
		auto it = map_rts_cb_list_.find(session_id);
		if (it != map_rts_cb_list_.end())
		{
			return &it->second;
		}
		return nullptr;
	}
}