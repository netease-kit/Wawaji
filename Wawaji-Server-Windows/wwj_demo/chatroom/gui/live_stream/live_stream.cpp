#include "live_stream.h"
#include "module/video/video_manager.h"
WWJCameraLiveStream::WWJCameraLiveStream()
{
	push_rtmp_url_1_ = nim_ui::LoginManager::GetInstance()->wwj_info_.push_url1_;
	push_rtmp_url_2_ = nim_ui::LoginManager::GetInstance()->wwj_info_.push_url2_;
	livestreaming_session_1_.LoadLivestreamingDll();
	livestreaming_session_2_.LoadLivestreamingDll();
	wwj_ls_error_cb_ = nullptr;
	wwj_ls_start_cb_ = nullptr;
}

WWJCameraLiveStream::~WWJCameraLiveStream()
{
	wwj_ls_error_cb_ = nullptr;
	wwj_ls_start_cb_ = nullptr;
	livestreaming_session_1_.UnLoadLivestreamingDll();
	livestreaming_session_2_.UnLoadLivestreamingDll();
	QLOG_APP(L" ~WWJCameraLiveStream success!");
}

bool WWJCameraLiveStream::LiveStreamInit()
{
	if (push_rtmp_url_1_.empty() || push_rtmp_url_2_.empty())
	{
		assert(false);
		return false;
	}

	QLOG_APP(L"Init live stream.");
	if (!livestreaming_session_1_.IsLsInit())
	{
		nim_livestream::LsErrorCallback error_cb1 = [this](EN_NLSS_ERRCODE errCode)
		{
			if (EN_NLSS_ERR_AUDIOSTART == errCode)
			{
				QLOG_ERR(L"On starting live stream audio start error.");
			}
			else if (EN_NLSS_ERR_VIDEOSTART == errCode)
			{
				QLOG_ERR(L"On starting live stream video start error.");
			}
			else if (EN_NLSS_ERR_NETTIMEOUT == errCode)
			{
				livestreaming_session_1_.OnLiveStreamError(); //将直播状态改为未开启
				QLOG_APP(L" live stream error.");
			}
			else if (EN_NLSS_ERR_URLINVALID == errCode)
			{
				QLOG_APP(L" live stream phsh rtmp url stop invalid .");
			}
			if (wwj_ls_error_cb_)
			{
				Post2UI(nbase::Bind(wwj_ls_error_cb_, 1, errCode));
			}
		};
		error_cb1 = init_live_stream_flag_1_.ToWeakCallback(error_cb1);
		if (livestreaming_session_1_.InitSession(push_rtmp_url_1_, "1", error_cb1))
		{
			livestreaming_session_1_.SetVideoMng(&nim_comp::VideoManager::GetInstance()->video_frame_mng_);
			QLOG_APP(L"Init live stream 1  success.");
		}
	}
	if (!livestreaming_session_2_.IsLsInit())
	{
		nim_livestream::LsErrorCallback error_cb2 = [this](EN_NLSS_ERRCODE errCode)
		{
			if (EN_NLSS_ERR_AUDIOSTART == errCode)
			{
				QLOG_ERR(L"On starting live stream audio start error.");
			}
			else if (EN_NLSS_ERR_VIDEOSTART == errCode)
			{
				QLOG_ERR(L"On starting live stream video start error.");
			}
			else if (EN_NLSS_ERR_NETTIMEOUT == errCode)
			{
				livestreaming_session_2_.OnLiveStreamError(); //将直播状态改为未开启
				QLOG_APP(L" live stream error .");
			}
			else if (EN_NLSS_ERR_URLINVALID == errCode)
			{
				QLOG_APP(L" live stream phsh rtmp url stop invalid.");
			}
			if (wwj_ls_error_cb_)
			{
				Post2UI(nbase::Bind(wwj_ls_error_cb_, 2, errCode));
			}
		};
		error_cb2 = init_live_stream_flag_2_.ToWeakCallback(error_cb2);
	
		if (livestreaming_session_2_.InitSession(push_rtmp_url_2_,"2", error_cb2))
		{
			livestreaming_session_2_.SetVideoMng(&nim_comp::VideoManager::GetInstance()->video_frame_mng_);
			QLOG_APP(L"Init live stream 2  success.");
		}
	}
	if (livestreaming_session_1_.IsLsInit() && livestreaming_session_2_.IsLsInit())
	{
		return true;
	}
	QLOG_ERR(L"Init live stream error.");
	return false;
}

void WWJCameraLiveStream::StartLiveStream()
{
	if (is_starting_live_stream_)
	{
		QLOG_ERR(L"On starting live stream. Skip this operation");
		return;
	}
	if (is_stopping_live_stream_)
	{
		QLOG_ERR(L"On stopping live stream. Skip this operation");
		return;
	}

	if (!LiveStreamInit())
	{
		QLOG_ERR(L"init live stream error. Skip this operation");
		return;
	}

	auto cb = [this](int32_t type, bool ret)
	{
		is_starting_live_stream_ = false;
		start_live_stream_timer_.Cancel();
		if (ret)
		{
			QLOG_APP(L"start live stream success!");
		}
		else
		{
			QLOG_ERR(L"stop live stream error!");
		}
		if (wwj_ls_start_cb_)
		{
			Post2UI(nbase::Bind(wwj_ls_start_cb_, type, ret));
		}
	};
	QLOG_APP(L"Start live stream.");
	is_starting_live_stream_ = true;
	nim_livestream::OptCallback cb1 = start_live_stream_flag_.ToWeakCallback(nbase::Bind(cb, 1, std::placeholders::_1));
	if (!livestreaming_session_1_.OnStartLiveStream(cb1))
		cb1(false);
	else
	{
		start_live_stream_timeout_ = false;
		start_live_stream_timer_.Cancel();
		StdClosure time_out_cb = start_live_stream_timer_.ToWeakCallback(nbase::Bind(&WWJCameraLiveStream::OnStartLiveStreamTimeout, this));
		nbase::ThreadManager::PostDelayedTask(time_out_cb, nbase::TimeDelta::FromSeconds(30));
	}
	nim_livestream::OptCallback cb2 = start_live_stream_flag_.ToWeakCallback(nbase::Bind(cb, 2, std::placeholders::_1));
	if (!livestreaming_session_2_.OnStartLiveStream(cb2))
		cb2(false);
	else
	{
		start_live_stream_timeout_ = false;
		start_live_stream_timer_.Cancel();
		StdClosure time_out_cb = start_live_stream_timer_.ToWeakCallback(nbase::Bind(&WWJCameraLiveStream::OnStartLiveStreamTimeout, this));
		nbase::ThreadManager::PostDelayedTask(time_out_cb, nbase::TimeDelta::FromSeconds(30));
	}
}

void WWJCameraLiveStream::StopLiveStream()
{
	if (is_starting_live_stream_)
	{
		QLOG_ERR(L"On starting live stream. Skip this operation");
		return;
	}
	if (is_stopping_live_stream_)
	{
		QLOG_ERR(L"On stopping live stream. Skip this operation");
		return;
	}

	nim_livestream::OptCallback cb = [this](bool ret)
	{
		is_stopping_live_stream_ = false;
		if (ret)
		{
			QLOG_APP(L"stop live stream success!");
		}
		else
		{
			QLOG_ERR(L"stop live stream error!");
		}
	};
	QLOG_APP(L"Stop live stream.");
	is_stopping_live_stream_ = true;
	livestreaming_session_1_.OnStopLiveStream(stop_live_stream_flag_.ToWeakCallback(cb));
	livestreaming_session_2_.OnStopLiveStream(stop_live_stream_flag_.ToWeakCallback(cb));
}

void WWJCameraLiveStream::OnStartLiveStreamTimeout()
{
	is_starting_live_stream_ = false;
	start_live_stream_timeout_ = true;
	start_live_stream_flag_.Cancel(); //不再执行StartLiveStream的回调
	livestreaming_session_1_.OnStopLiveStream(nullptr); //停止推流
	livestreaming_session_2_.OnStopLiveStream(nullptr); //停止推流
	QLOG_ERR(L"starting live stream timeout.");
}
