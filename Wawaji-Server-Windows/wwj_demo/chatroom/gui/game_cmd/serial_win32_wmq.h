#pragma once
#include "serial_win32.h"

namespace nim_wwj
{
	enum wwj_cmd
	{
		frame_cmd_game_start = 0x00,//游戏开始
		frame_cmd_control = 0x01, //控制指令
		frame_cmd_strong_claw_power = 0x0A, //强抓力设置
		frame_cmd_weak_claw_power = 0x0B, //弱抓力设置
		frame_cmd_game_time = 0x0C,//游戏时间
		frame_cmd_check_device = 0x0E,//检查设备
		frame_cmd_heartbeat = 0x02,//主板心跳
		frame_cmd_game_end = 0x80,//游戏结束
	};
	
	enum game_type
	{
		kstrong = 0,//强力局
		kweak    //弱力局
	};

	class WwjControl_Wmq :public WwjControl
	{
	public:
		WwjControl_Wmq();
		~WwjControl_Wmq();
		virtual void CloseSerial();
		virtual bool CrownBlockReset();//天车归位
		virtual bool SerialDirectectOpt(serial_direction_opt_type_e type);//娃娃机方向操作
		virtual void SerialSetStepSize(unsigned char step_size);//娃娃机步长
		virtual void  Pay(int coins);//云上分，上分之前应先调用CheckNormal接口检测设备状态 结果由回调返回
		virtual bool QueryDeviceInfo();//查询终端账目（用于查询设备的账目状况，故障状态等 结果由回调返回
		virtual bool CheckNormal();//查询链接, 用户查询是否正常,结果由回调返回
		wwj_set_param_t GetSettingParam();//获取娃娃机参数
		virtual bool  SetSettingParam(wwj_set_param_t param);//设置娃娃机设备参数
		virtual void StartSerialReadThread();
	private:
		unsigned char send_data_[BUF_LEN];
	private:
		wwj_set_param_t wwj_set_param_;
		int wwj_step_size_;
		int opt_count_;
	};
}
