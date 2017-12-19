#include "rts_stream.h"
#include "module/video/video_manager.h"
#include "module/rts/rts_manager.h"

#include "base/util/base64.h"
#include "libyuv/include/libyuv.h"
#include <sys/timeb.h>

using namespace nim;

#define CAMERA_W		640
#define CAMERA_H		480

int32_t GetConfigValueNum(const std::string& key, int32_t def_value)
{
	int32_t ret = def_value;
	std::string value = GetConfigValue(key);
	if (!value.empty())
	{
		ret = atoi(value.c_str());
	}
	return ret;
}
WWJRtsStream::WWJRtsStream()
{
	screen_w_ = GetConfigValueNum("kH5W", 480);
	screen_h_ = GetConfigValueNum("kH5H", 480);
	mpeg1_transcoder_.reset(new Mpeg1Transcoder);
	Mpeg1Param p;
	p.bitrate = GetConfigValueNum("kH5bitrate", 160000);//600000; // bps
	p.maxfps = 24;    // Only support 24, 25, 30, 50, 60
	p.gop = GetConfigValueNum("kH5gop", 12);
	p.height = screen_h_;
	p.width = screen_w_;
	if (mpeg1_transcoder_->init(&p) < 0)
	{
		printf("init failed\n");
	}
	
}

WWJRtsStream::~WWJRtsStream()
{
	StopRtsStream();
}

void WWJRtsStream::StartRtsStream(const std::string &uid, const std::string &room_name)
{
	QLOG_APP(L"rts {0} start {1}") << uid << room_name;
	uid_ = uid;
	room_name_ = room_name;
	ReStartRts();
}
void WWJRtsStream::StopRtsStream()
{
	QLOG_APP(L"rts {0} stop {1}") << uid_ << room_name_;
	send_timer_.Cancel();
	restart_timer_.Cancel();
	StopRts(session_id_);
	session_id_ = "";
	uid_ = "";
	room_name_ = "";
}
void WWJRtsStream::ReStartRts()
{
	if (!uid_.empty())
	{
		QLOG_APP(L"rts {0} restart {1}") << uid_ << room_name_;
		send_timer_.Cancel();
		restart_timer_.Cancel();
		StopRts(session_id_);
		StdClosure task = nbase::Bind(&WWJRtsStream::CreateRtsRoom, this);
		nbase::ThreadManager::PostDelayedTask(kThreadUI, restart_timer_.ToWeakCallback(task), nbase::TimeDelta::FromSeconds(10));
		StdClosure task2 = nbase::Bind(&WWJRtsStream::ReStartRts, this);
		nbase::ThreadManager::PostDelayedTask(kThreadUI, restart_timer_.ToWeakCallback(task2), nbase::TimeDelta::FromSeconds(90));
	}
}
void WWJRtsStream::CreateRtsRoom()
{
	if (!uid_.empty())
	{
		StopRts(session_id_);
		session_id_ = Tool::GetUuid();
		QLOG_APP(L"rts {0} create rts {1}, session {2}") << uid_ << room_name_ << session_id_;
		Rts::CreateConf(room_name_, "", nbase::Bind(&WWJRtsStream::CreateRtsRoomCb, this, session_id_, std::placeholders::_1));
	}
}
void WWJRtsStream::CreateRtsRoomCb(const std::string& session_id, nim::NIMResCode res_code)
{
	if (session_id_ != session_id)
	{
		return;
	}
	QLOG_APP(L"rts {0} create rts cb {1}, session {2}") << uid_ << res_code << session_id_;
	if (res_code == 200 || res_code == 417)
	{
		JoinRts(session_id);
	}
	else
	{
		ReStartRts();
	}
}
void WWJRtsStream::JoinRts(const std::string& session_id)
{
	if (session_id == session_id_)
	{
		QLOG_APP(L"rts {0} join session {1}") << uid_ << session_id_;
		auto cb = nbase::Bind(&WWJRtsStream::JoinRtsCb, this, session_id_, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3, std::placeholders::_4);
		Rts::JoinConf(room_name_, session_id, false, cb);
	}
}
void WWJRtsStream::JoinRtsCb(const std::string& session_id_old, nim::NIMResCode res_code, const std::string& session_id, int64_t channel_id, const std::string& custom_info)
{
	QLOG_APP(L"rts {0} join rts cb {1}, session {2} -> {3}") << uid_ << res_code << session_id_old << session_id;
	if (session_id_old != session_id_)
	{
		StopRts(session_id_old);
	}
	else
	{
		if (res_code == 200)
		{
			session_id_ = session_id;
			nim_comp::RtsStatusCbInfo info_cb;
			info_cb.connect_cb_ = nbase::Bind(&WWJRtsStream::RtsConnectCb, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3, std::placeholders::_4);
			info_cb.member_cb_ = nullptr;
			info_cb.rec_data_cb_ = nullptr;
			nim_comp::RtsManager::GetInstance()->AddRtsStatusCb(session_id_, info_cb);
		}
		else
		{
			ReStartRts();
		}
	}
}
void WWJRtsStream::RtsConnectCb(const std::string& session_id, int channel_type, int code, const std::string& json)
{
	if (session_id == session_id_)
	{
		QLOG_APP(L"rts {0} connect rts cb {1}, session {2}") << uid_ << code << session_id;
		if (code == 200)
		{
			restart_timer_.Cancel();
			StdClosure task = nbase::Bind(&WWJRtsStream::SendPic, this, session_id, uid_, mpeg1_transcoder_);
			int32_t ft = GetConfigValueNum("kH5ft", 120);
			nbase::ThreadManager::PostRepeatedTask(kThreadScreenCapture, send_timer_.ToWeakCallback(task), nbase::TimeDelta::FromMilliseconds(ft));
		} 
		else
		{
			ReStartRts();
		}
	}
}
void WWJRtsStream::StopRts(const std::string& session_id)
{
	if (!session_id.empty())
	{
		QLOG_APP(L"rts {0} stop rts session {1}") << uid_ << session_id;
		Rts::Hangup(session_id, Rts::HangupCallback());
		nim_comp::RtsManager::GetInstance()->RemoveRtsStatusCb(session_id);
	}
}
void WWJRtsStream::SendPic(const std::string& session_id, const std::string &uid, const std::shared_ptr<Mpeg1Transcoder>& mpeg1_transcoder)
{
	nim_comp::VideoFrameMng* video_frame_mng = &nim_comp::VideoManager::GetInstance()->video_frame_mng_;

	int64_t time = 0;
	int32_t width = CAMERA_W;
	int32_t height = CAMERA_H;
	int32_t size = width * height * 2;
	std::string yuv_data;
	yuv_data.append(size, (char)0);
	bool ret = nim_comp::VideoManager::GetInstance()->video_frame_mng_.GetVideoFrame(uid, time, (char*)yuv_data.c_str(), width, height, false, false);
	if (ret)
	{
		YUVdataForMPEG1 yuv;
		std::string yuv_temp;
		yuv.width = screen_w_;
		yuv.height = screen_h_;
		if (yuv.width != width && yuv.height != height)
		{
			int32_t wxh = width*height;
			int32_t wxh2 = yuv.width*yuv.height;
			yuv.yStride = yuv.width;
			yuv.uStride = yuv.vStride = yuv.yStride / 2;
			yuv_temp.append(wxh2 * 3 / 2, (char)0);
			yuv.yBuf = (uint8_t*)yuv_temp.c_str();
			yuv.uBuf = (uint8_t*)yuv_temp.c_str() + wxh2;
			yuv.vBuf = yuv.uBuf + wxh2 / 4;
			int32_t width_t = width;
			int32_t height_t = height;
			if (width * yuv.height > height * yuv.width)
			{
				width_t = height * yuv.width / yuv.height;
			} 
			else
			{
				height_t = width * yuv.height / yuv.width;
			}
			int32_t x = (width - width_t) / 2;
			x -= x % 2;
			int32_t y = (height - height_t) / 2;
			y -= y % 2;
			uint8_t* src_y = (uint8_t*)yuv_data.c_str() + y * width + x;
			uint8_t* src_u = (uint8_t*)yuv_data.c_str() + wxh + y * width / 4 + x / 2;
			uint8_t* src_v = src_u + wxh / 4;
			libyuv::FilterMode filter_mode = libyuv::kFilterBox;
			libyuv::I420Scale(src_y, width,
							  src_u, width / 2,
							  src_v, width / 2,
							  width_t, height_t,
							  yuv.yBuf, yuv.yStride,
							  yuv.uBuf, yuv.uStride,
							  yuv.vBuf, yuv.vStride,
							  yuv.width, yuv.height,
							  filter_mode);
		} 
		else
		{
			yuv.yStride = width;// yuv.width;
			yuv.uStride = yuv.vStride = yuv.yStride / 2;
			int32_t x = (width - yuv.width) / 2;
			x -= x % 2;
			int32_t y = (height - yuv.height) / 2;
			y -= y % 2;
			int32_t wxh = width*height;
			{
				yuv.yBuf = (uint8_t*)yuv_data.c_str() + y * yuv.yStride + x;
				yuv.uBuf = (uint8_t*)yuv_data.c_str() + wxh + y * yuv.uStride / 2 + x / 2;
				yuv.vBuf = yuv.uBuf + wxh / 4;
			}
		}

		timeb time_now;
		ftime(&time_now); // 秒数
		int64_t cur_timestamp = time_now.time * 1000 + time_now.millitm; // 毫秒
		uint8_t *out_data = nullptr;
		int32_t out_size = 0;
		bool key_frame = false;
		mpeg1_transcoder->encode(&yuv, cur_timestamp, &out_data, &out_size, &key_frame);
		if (out_size > 0)
		{
			static int32_t limit_size = 5000;
			while (out_size > 0)
			{
				int32_t size = limit_size;
				if (out_size < limit_size)
				{
					size = out_size;
				}
				std::string data_out((char*)out_data, size);
				if (nbase::Base64Encode(data_out, &data_out))
				{
					Rts::SendData(session_id, kNIMRtsChannelTypeTcp, data_out);
					//printf("---rts %s send %d\n", uid.c_str(), out_size / 100);
					//static int32_t max_out_size = 0;
					//if (out_size > max_out_size)
					//{
					//	max_out_size = out_size;
					//	QLOG_APP(L"rts {0} mpeg pic size max {1}") << uid << max_out_size;
					//}
				}
				out_data += size;
				out_size -= size;
			}
		}
	}
}
