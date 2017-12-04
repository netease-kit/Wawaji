#ifndef NIM_LIVESTREAM_API_CPP_H_
#define NIM_LIVESTREAM_API_CPP_H_
#include "ui_component/ui_kit/module/video/video_frame_mng.h"
#include "base/synchronization/lock.h"
#include "base/callback/callback.h"
#include "include/nlss_type.h"
#include "nls_sdk_util.h"
namespace nim_livestream
{
	typedef NLSS_RET(*Nlss_Create)(const char *paWorkPath, const char *paCachePath, NLSS_OUT _HNLSSERVICE *phNLSService);
	typedef void(*Nlss_Destroy)(_HNLSSERVICE hNLSService);
	typedef NLSS_RET(*Nlss_GetDefaultParam)(_HNLSSERVICE hNLSService, NLSS_OUT ST_NLSS_PARAM *pstParam);
	typedef NLSS_RET(*Nlss_InitParam)(_HNLSSERVICE hNLSService, ST_NLSS_PARAM *pstParam);
	typedef void(*Nlss_UninitParam)(_HNLSSERVICE hNLSService);
	typedef void(*Nlss_SetStatusCB)(_HNLSSERVICE hNLSService, PFN_NLSS_STATUS_NTY pFunStatusNty);
	typedef NLSS_RET(*Nlss_Start)(_HNLSSERVICE hNLSService);
	typedef void(*Nlss_Stop)(_HNLSSERVICE hNLSService);
	typedef NLSS_RET(*Nlss_StartLiveStream)(_HNLSSERVICE hNLSService);
	typedef void(*Nlss_StopLiveStream)(_HNLSSERVICE hNLSService);
	typedef _HNLSSCHILDSERVICE(*Nlss_ChildVideoOpen)(_HNLSSERVICE hNLSService, ST_NLSS_VIDEOIN_PARAM *pVideoInParam);
	typedef void(*Nlss_ChildVideoClose)(_HNLSSCHILDSERVICE hNLSSChild);
	typedef void(*Nlss_ChildVideoSetBackLayer)(_HNLSSCHILDSERVICE hNLSSChild);
	typedef NLSS_RET(*Nlss_ChildVideoStartCapture)(_HNLSSCHILDSERVICE hNLSSChild);
	typedef void(*Nlss_ChildVideoStopCapture)(_HNLSSCHILDSERVICE hNLSSChild);
	typedef NLSS_RET(*Nlss_VideoChildSendCustomData)(_HNLSSCHILDSERVICE hNLSSChild, char *pcVideoData, int iLen);
	typedef NLSS_RET(*Nlss_SendCustomAudioData)(_HNLSSERVICE hNLSService, char *pcAudioData, int iLen, int iSampleRate);
	typedef NLSS_RET(*Nlss_GetStaticInfo)(_HNLSSERVICE hNLSService, NLSS_OUT ST_NLSS_STATS *pstStats);
	typedef NLSS_RET(*Nlss_StartRecord)(_HNLSSERVICE hNLSService, char *pcRecordPath);
	typedef void(*Nlss_StopRecord)(_HNLSSERVICE hNLSService);

	//操作结果
	typedef std::function<void(bool ret)> OptCallback;
	typedef std::function<void(EN_NLSS_ERRCODE errCode)> LsErrorCallback;
	typedef void(*ErrorOpt) (bool);


	class LsSession :public virtual nbase::SupportWeakCallback
	{

	public:
		LsSession();
		~LsSession();
	public:
		//初始化和释放dll，必须先调用init才能使用nim_ls中的其他接口
		bool LoadLivestreamingDll();
		void UnLoadLivestreamingDll();
		//初始化直播模块
		bool InitSession(const std::string& url, const std::string&camera_id, LsErrorCallback ls_error_cb_);
		void ClearSession();

		//开始直播推流
		bool OnStartLiveStream(OptCallback cb);
		//结束直播推流
		bool OnStopLiveStream(OptCallback cb);
		void OnLiveStreamError();

		bool IsLivingsteam() { return live_streaming_; }
		bool IsLsInit() { return init_session_; }

		//直播过程中的统计信息
		bool GetStaticInfo(NLSS_OUT ST_NLSS_STATS  &pstStats);

		bool StartRecord(char*path);
		void StopRecord();

		void SetVideoMng( nim_comp::VideoFrameMng* video_mng){ video_frame_mng_ = video_mng; }
	private:
		//开始直播推流
		void DoStartLiveStream(OptCallback cb);
		//结束直播推流
		void DoStopLiveStream(OptCallback cb);
		void DoClearSession();
		
		void SendVideoFrame();
		void SendAudioFrame();

	private:
		nbase::NLock lock_;
		nbase::WeakCallbackFlag ls_data_timer_;
		ST_NLSS_PARAM ls_param_;
		_HNLSSERVICE* ls_client_;
		_HNLSSCHILDSERVICE  *ls_child_client_;
		bool init_session_;
		bool live_streaming_;
		bool is_recording_;
		std::wstring current_work_dir_;
		ErrorOpt error_cb_ ;
		std::string camera_id_;
		nim_comp::VideoFrameMng* video_frame_mng_;
		NLSSDKInstance *nls_sdk_instance = NULL;
	};
}
#endif// NIM_LIVESTREAM_API_CPP_H_



