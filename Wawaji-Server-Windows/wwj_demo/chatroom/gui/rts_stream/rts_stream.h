#ifndef RTS_STREAM_H_
#define RTS_STREAM_H_

#include "Mpeg1Transcoder.h"

class WWJRtsStream :public virtual nbase::SupportWeakCallback
{
public:
	WWJRtsStream();
	~WWJRtsStream();
public:
	void StartRtsStream(const std::string &uid, const std::string &room_name); //开始推流
	void StopRtsStream(); //停止推流

private:
	void ReStartRts();
	void CreateRtsRoom();
	void CreateRtsRoomCb(const std::string& session_id, nim::NIMResCode res_code);
	void JoinRts(const std::string& session_id);
	void JoinRtsCb(const std::string& session_id_old, nim::NIMResCode res_code, const std::string& session_id, int64_t channel_id, const std::string& custom_info);
	void RtsConnectCb(const std::string& session_id, int channel_type, int code, const std::string& json);

	void StopRts(const std::string& session_id);
	void SendPic(const std::string& session_id, const std::string &uid, const std::shared_ptr<Mpeg1Transcoder>& mpeg1_transcoder);
private:
	std::string room_name_;
	std::string uid_;
	std::string session_id_;
	int32_t screen_w_;
	int32_t screen_h_;

	nbase::WeakCallbackFlag restart_timer_;
	nbase::WeakCallbackFlag send_timer_;

	std::shared_ptr<Mpeg1Transcoder> mpeg1_transcoder_;
};;
#endif// RTS_STREAM_H_
