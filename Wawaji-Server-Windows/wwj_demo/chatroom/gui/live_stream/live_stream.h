#ifndef LIVE_STREAM_H_
#define LIVE_STREAM_H_
#include "nim_livestreaming_cpp.h"
#include "base/memory/singleton.h"
#include "nlss_type.h"


typedef std::function<void(int32_t type, int code)> WWJLsErrorCb;
typedef std::function<void(int32_t type, bool ret)> WWJLsStartCb;
class WWJCameraLiveStream :public virtual nbase::SupportWeakCallback
{
public:
	SINGLETON_DEFINE(WWJCameraLiveStream);
	WWJCameraLiveStream();
	~WWJCameraLiveStream();
public:
	bool LiveStreamInit(); //初始化推流直播
	void StartLiveStream(); //开始推流直播
	void StopLiveStream(); //停止推流直播
	void OnStartLiveStreamTimeout(); //处理开启推流直播超时
	void SetErrorCb(WWJLsErrorCb cb){ wwj_ls_error_cb_ = cb; }
	void SetStartCb(WWJLsStartCb cb){ wwj_ls_start_cb_ = cb; }
private:
	nim_livestream::LsSession livestreaming_session_1_;
	nim_livestream::LsSession livestreaming_session_2_;
	std::string push_rtmp_url_1_;
	std::string push_rtmp_url_2_;
	bool is_starting_live_stream_ = false;
	bool is_stopping_live_stream_ = false;
	bool start_live_stream_timeout_ = false;
	nbase::WeakCallbackFlag start_live_stream_timer_;
	nbase::WeakCallbackFlag start_live_stream_flag_;
	nbase::WeakCallbackFlag stop_live_stream_flag_;
	nbase::WeakCallbackFlag init_live_stream_flag_1_;
	nbase::WeakCallbackFlag init_live_stream_flag_2_;
	WWJLsErrorCb wwj_ls_error_cb_;
	WWJLsStartCb wwj_ls_start_cb_;
};
//extern WWJCameraLiveStream wwj_camera_live_stream_;
#endif// LIVE_STREAM_H_
