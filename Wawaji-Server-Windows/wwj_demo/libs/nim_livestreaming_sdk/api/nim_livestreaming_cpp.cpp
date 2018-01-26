#include "nim_livestreaming_cpp.h"
#include "base/file/file_util.h"
#include "base/util/string_util.h"
#include "base/memory/singleton.h"
#include "base/thread/thread_manager.h"
#include "shared/threads.h"
#include "shared/log.h"
#include "shared/util.h"
#include "shared/closure.h"
#include <sys/timeb.h>

#include <SensAPI.h>


#define CAMERA_W		640
#define CAMERA_H		480
#define SCREEN_W		480
#define SCREEN_H		480

namespace nim_livestream
{
#define pLsClient  ((_HNLSSERVICE*)ls_client_)
#define LsClient  (*(_HNLSSERVICE*)ls_client_)
#define pLsChildClient  ((_HNLSSCHILDSERVICE*)ls_child_client_)
#define LsChildClient  (*(_HNLSSCHILDSERVICE*)ls_child_client_)

	LsSession::LsSession()
	{
		init_session_ = false;
		live_streaming_ = false;
		is_recording_ = false;
		ls_client_ = nullptr;
		ls_child_client_ = nullptr;
		camera_id_ == "";
	}

	LsSession::~LsSession()
	{
		ClearSession();		
		int32_t num_time = 0;
		while (!IsClearOk() && num_time < 40)
		{
			num_time++;
			Sleep(100);
		}
		if (!IsClearOk())
		{
			QLOG_ERR(L"LsSession delete err");
		}

		nbase::NAutoLock auto_lock(&lock_);
		printf("clear ls session\n");
	}
	bool LsSession::IsClearOk()
	{
		if (ls_client_ || ls_child_client_)
			return false;
		return true;
	}

	bool LsSession::LoadLivestreamingDll()
	{
		bool ret = NLSSDKInstance::LoadSdkDll();
		if (!ret)
		{
			QLOG_ERR(L"LsManange LoadSdkDll error");
		}
		return ret;
	}

	void  LsSession::UnLoadLivestreamingDll()
	{
		NLSSDKInstance::UnLoadSdkDll();
	}

	static std::map<void*, LsSession*> InstSessionMap;

	//直播发生错误回调，当直播过程中发生错误，通知应用层，应用层可以做相应的处理
	void ErrorCallback(_HNLSSERVICE hNLSService, EN_NLSS_STATUS enStatus, EN_NLSS_ERRCODE enErrCode)
	{
		QLOG_ERR(L"livesteaming {0}, {1}") << enStatus << enErrCode;
		switch (enStatus)
		{
		case EN_NLSS_STATUS_ERR: //直播出错
		{
			StdClosure closure = [=]() 
			{
				auto iter = InstSessionMap.find((void*)hNLSService);
				if (iter != InstSessionMap.end())
				{
					LsSession* session = iter->second;
					session->ls_error_cb_(enErrCode);
				}
			};
			Post2UI(closure);
			break;
		}
		default:
			break;
		}
	}

	bool LsSession::InitSession(const std::string& url, const std::string&camera_id, LsErrorCallback ls_error_cb)
	{
		nbase::NAutoLock auto_lock(&lock_);
		if (ls_client_ == NULL)
		{
			init_session_ = false;
			ls_client_ = new _HNLSSERVICE;
			std::wstring work_dir = QPath::GetAppPath() + L"live_stream\\";
			std::wstring log_dir = QPath::GetNimAppDataDir() + L"live_stream\\";
			if (!nbase::FilePathIsExist(log_dir, true))
				nbase::CreateDirectory(log_dir);
			NLSS_RET ret = NIS_SDK_GET_FUNC(Nlss_Create)(nbase::UTF16ToUTF8(work_dir).c_str(), nbase::UTF16ToUTF8(log_dir).c_str(), pLsClient);
			QLOG_APP(L"ls sdk dir {0}") << work_dir;
			if (ret != NLSS_OK)
			{
				delete ls_client_;
				ls_client_ = nullptr;
				assert(0);
				return false;
			}
			InstSessionMap[*ls_client_] = this;

			NIS_SDK_GET_FUNC(Nlss_SetStatusCB)(LsClient, ErrorCallback);
			ls_error_cb_ = ls_error_cb;

			NIS_SDK_GET_FUNC(Nlss_GetDefaultParam)(LsClient, &ls_param_);
			ls_param_.stAudioParam.stIn.iInSamplerate = 44100;
			ls_param_.stAudioParam.stIn.paaudioDeviceName = "";
			ls_param_.stAudioParam.stIn.enInType = EN_NLSS_AUDIOIN_NONE;
			ls_param_.stVideoParam.enOutCodec = EN_NLSS_VIDEOOUT_CODEC_X264;
			ls_param_.stVideoParam.bHardEncode = false;
			ls_param_.stVideoParam.iOutFps = 15;
			ls_param_.stVideoParam.iOutBitrate = 400000;
			ls_param_.stVideoParam.iOutHeight = SCREEN_W;
			ls_param_.stVideoParam.iOutWidth = SCREEN_H;
			ls_param_.enOutContent = EN_NLSS_OUTCONTENT_VIDEO;
			ls_param_.paOutUrl = (char*)url.c_str();
			if (NIS_SDK_GET_FUNC(Nlss_InitParam)(LsClient, &ls_param_) != NLSS_OK)
			{
				NIS_SDK_GET_FUNC(Nlss_Destroy)(LsClient);
				delete ls_client_;
				ls_client_ = nullptr;
				assert(0);
				return false;
			}
			ret = NIS_SDK_GET_FUNC(Nlss_Start)(LsClient);
			if (ret != NLSS_OK)
			{
				NIS_SDK_GET_FUNC(Nlss_UninitParam)(LsClient);
				NIS_SDK_GET_FUNC(Nlss_Destroy)(LsClient);
				delete ls_client_;
				ls_client_ = nullptr;
				assert(0);
				return false;
			}
			init_session_ = true;
			camera_id_ = camera_id;
		}
		return true;
	}

	bool LsSession::OnStartLiveStream(OptCallback cb)
	{
		nbase::NAutoLock auto_lock(&lock_);
		if (live_streaming_)
		{
			return true; //当前已经在推流，返回TRUE
		}
		if (ls_client_)
		{
			nbase::ThreadManager::PostTask(kThreadLiveStreaming, nbase::Bind(&LsSession::DoStartLiveStream, this, cb));
			return true;
		}
		return false;
	}

	bool LsSession::OnStopLiveStream(OptCallback cb)
	{
		nbase::NAutoLock auto_lock(&lock_);
		if (live_streaming_ && ls_client_)
			nbase::ThreadManager::PostTask(kThreadLiveStreaming, nbase::Bind(&LsSession::DoStopLiveStream, this, cb));
		return true;
	}

	void LsSession::OnLiveStreamError()
	{
		nbase::ThreadManager::PostTask(kThreadLiveStreaming, ToWeakCallback([this]()
		{
			nbase::NAutoLock auto_lock(&lock_);
			live_streaming_ = false;
			ls_data_timer_.Cancel();
		}));
	}

	//开始直播
	void LsSession::DoStartLiveStream(OptCallback cb)
	{
		nbase::NAutoLock auto_lock(&lock_);
		bool success = false;
		if (live_streaming_)
		{
			success = true;
		}
		else if (ls_client_)
		{
			if (ls_child_client_ == NULL)
			{
				ST_NLSS_VIDEOIN_PARAM  ls_child_video_in_param_;
				ls_child_video_in_param_.enInType = EN_NLSS_VIDEOIN_RAWDATA;
				ls_child_video_in_param_.iCaptureFps = 15;
				ls_child_video_in_param_.u.stInCustomVideo.enVideoInFmt = EN_NLSS_VIDEOIN_FMT_I420;
				ls_child_video_in_param_.u.stInCustomVideo.iInWidth = CAMERA_W;
				ls_child_video_in_param_.u.stInCustomVideo.iInHeight = CAMERA_H;
				pLsChildClient = new _HNLSSCHILDSERVICE;
				LsChildClient = NIS_SDK_GET_FUNC(Nlss_ChildVideoOpen)(LsClient, &ls_child_video_in_param_);
				NIS_SDK_GET_FUNC(Nlss_ChildVideoSetBackLayer)(LsChildClient);
				NIS_SDK_GET_FUNC(Nlss_ChildVideoStartCapture)(LsChildClient);
			}

			if (NIS_SDK_GET_FUNC(Nlss_StartLiveStream)(LsClient) == NLSS_OK)
			{
				live_streaming_ = true;
				ls_data_timer_.Cancel();
				StdClosure task = nbase::Bind(&LsSession::SendVideoFrame, this);
				nbase::ThreadManager::PostRepeatedTask(kThreadLiveStreaming, ls_data_timer_.ToWeakCallback(task), nbase::TimeDelta::FromMilliseconds(60));
				success = true;
			}
			else //开启直播错误，不管什么原因，只返回NLSS_ERROR
				QLOG_ERR(L"Nlss_StartLiveStream error.");
		}
		if (cb)
		{
			Post2UI(nbase::Bind(cb, success));
		}
	}

	//结束直播
	void LsSession::DoStopLiveStream(OptCallback cb)
	{
		nbase::NAutoLock auto_lock(&lock_);
		bool ret = true;
		if (live_streaming_ && ls_client_)
		{
			ls_data_timer_.Cancel();
			ret = false;
			NIS_SDK_GET_FUNC(Nlss_StopLiveStream)(LsClient);
			live_streaming_ = false;
			ret = true;
		}
		if (ls_child_client_)
		{
			NIS_SDK_GET_FUNC(Nlss_ChildVideoStopCapture)(LsChildClient);
			NIS_SDK_GET_FUNC(Nlss_ChildVideoClose)(LsChildClient);
			delete ls_child_client_;
			ls_child_client_ = nullptr;
		}
		QLOG_APP(L"StopLiveStream success.");
		if (cb)
		{
			Post2UI(nbase::Bind(cb, ret));
		}
	}
	void LsSession::ClearSession()
	{
		nbase::NAutoLock auto_lock(&lock_);
		if (ls_client_ || ls_child_client_)
			nbase::ThreadManager::PostTask(kThreadLiveStreaming, nbase::Bind(&LsSession::DoClearSession, this));
	}

	void LsSession::DoClearSession()
	{
		nbase::NAutoLock auto_lock(&lock_);
		if (live_streaming_ && ls_client_)
		{
			ls_data_timer_.Cancel();
			NIS_SDK_GET_FUNC(Nlss_StopLiveStream)(LsClient);
			live_streaming_ = false;
		}
		if (ls_child_client_)
		{
			NIS_SDK_GET_FUNC(Nlss_ChildVideoStopCapture)(LsChildClient);
			NIS_SDK_GET_FUNC(Nlss_ChildVideoClose)(LsChildClient);
			delete ls_child_client_;
			ls_child_client_ = nullptr;
		}
		if (ls_client_)
		{
			NIS_SDK_GET_FUNC(Nlss_Stop)(LsClient);
			NIS_SDK_GET_FUNC(Nlss_UninitParam)(LsClient);
			NIS_SDK_GET_FUNC(Nlss_Destroy)(LsClient);
			InstSessionMap.erase(*ls_client_);
			delete ls_client_;
			ls_client_ = nullptr;
			init_session_ = false;
		}
	}

	//直播过程中的统计信息
	bool LsSession::GetStaticInfo(NLSS_OUT ST_NLSS_STATS &pstStats)
	{
		nbase::NAutoLock auto_lock(&lock_);
		bool ret = false;
		if (ls_client_)
		{
			ret = NIS_SDK_GET_FUNC(Nlss_GetStaticInfo)(LsClient, &pstStats) == NLSS_OK;
		}
		return ret;
	}

	void LsSession::SendVideoFrame()
	{
		nbase::NAutoLock auto_lock(&lock_);
		if (ls_client_ && live_streaming_)
		{
			int width = CAMERA_W;
			int height = CAMERA_H;
			std::string data;
			data.resize(width * height * 3 / 2);
			int64_t time = 0;
			if (camera_id_ == "")
				return;
			bool ret = video_frame_mng_->GetVideoFrame(camera_id_, time, (char*)data.c_str(), width, height, false, false);

			if (ret && (!data.empty()))
			{
				data.resize(width * height * 3 / 2);
				NIS_SDK_GET_FUNC(Nlss_VideoChildSendCustomData)(LsChildClient, (char*)data.c_str(), data.size());
			}
		}
	}

	void LsSession::SendAudioFrame()
	{
		nbase::NAutoLock auto_lock(&lock_);
		if (ls_client_ && live_streaming_)
		{
			std::string data;
			int rate = 0;
		}
	}

	bool LsSession::StartRecord(char*path)
	{
		nbase::NAutoLock auto_lock(&lock_);
		bool ret = false;
		if (!is_recording_)
		{
			ret = NIS_SDK_GET_FUNC(Nlss_StartRecord)(LsClient, path) == NLSS_OK;
			is_recording_ = ret;
		}
		return ret;
	}

	void LsSession::StopRecord()
	{
		nbase::NAutoLock auto_lock(&lock_);
		if (is_recording_)
		{
			NIS_SDK_GET_FUNC(Nlss_StopRecord)(LsClient);
			is_recording_ = false;
		}
	}
}