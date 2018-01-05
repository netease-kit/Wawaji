/*巨聚网络*/
#pragma once
#include<mutex>
#include "serial_win32.h"
#include"lws_config.h"
#include "WebSocket.h"

using namespace network;
namespace nim_wwj
{
#define WS_RX_BUFFER_SIZE (65536)
	enum class GameState
	{
		UnInit,
		Init,  /** &lt; value 0 */
		Charge,
		Coin,
		Play,        /** &lt; value 1 */
		GameOver,     /** &lt; value 2 */
	};


	struct RoomInfo
	{
		int id_;
		int price_;
		int game_time_;
		int auto_start_;
		string status_;
	};

	class WwjControl_jj :public WwjControl,public virtual nbase::SupportWeakCallback,WebSocket::Delegate
	{
	public:
		WwjControl_jj();
		~WwjControl_jj();
		virtual bool SetSerialParam(serial_param_t param);
		virtual bool OpenSerial(const char* com);
		virtual void CloseSerial();
		virtual bool CrownBlockReset();//天车归位
		virtual bool SerialDirectectOpt(serial_direction_opt_type_e type);//娃娃机方向操作
		virtual void SerialSetStepSize(unsigned char step_size);//娃娃机步长
		virtual void  Pay(int coins);//云上分，上分之前应先调用CheckNormal接口检测设备状态 结果由回调返回
		virtual bool QueryDeviceInfo();//查询终端账目（用于查询设备的账目状况，故障状态等 结果由回调返回
		virtual bool CheckNormal();//查询链接, 用户查询是否正常,结果由回调返回
		wwj_set_param_t GetSettingParam();//获取娃娃机参数
		bool  SetSettingParam(wwj_set_param_t param);//设置娃娃机设备参数
		virtual void StartSerialReadThread();
		virtual void SetOptFuncCb(wwj_callback_func cb) { wwj_opt_cb_ = cb; }
	private:
		virtual void onOpen(WebSocket* ws);
		virtual void onMessage(WebSocket* ws, const WebSocket::Data& data);
		virtual void onClose(WebSocket* ws);
		virtual void onError(WebSocket* ws, const WebSocket::ErrorCode& error);
	private:
		unsigned char send_data_[BUF_LEN];
		string ca_path_;
		wwj_set_param_t wwj_set_param_;
		int wwj_step_size_;
		int opt_count_;
		string identifying_;
		wwj_callback_func wwj_opt_cb_;
		string wss_url_;
		std::list<RoomInfo> room_info_;
	private:
		friend class WebSocketCallbackWrapper;
		WebSocket* web_socket_;
		GameState game_state_;
		int extra_id_;
		std::mutex   game_state_mutex_;
	};
}