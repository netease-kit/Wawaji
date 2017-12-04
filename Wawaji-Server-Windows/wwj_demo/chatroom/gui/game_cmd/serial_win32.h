#ifndef SERIAL_WIN32_H
#define SERIAL_WIN32_H
#include <windows.h>

namespace nim_wwj
{
#define kSerialOptSuccess 200
#define kSerialOptFailed 100
#define BUF_LEN 240
	//娃娃机设置参数
	typedef struct wwj_set_param_s
	{
		unsigned char once_need_coin;//几币一玩
		unsigned char game_paly_levle;//中奖基数(1-99)  (另外叫N次强抓力，贩卖次数，游戏难度)
		unsigned char auto_down_claw;//自动下抓时间(5-60)
		unsigned char power_time;//强力时间(1-60)
		unsigned char weak_time;//弱力时间（1-60)
		unsigned char prize_pattern;//中奖模式(0 / 1 / 2  随机，固定，取消)
		unsigned char sell_pattern;//贩卖模式(0/1/2  强三，强送，强投)
		unsigned char prize_score;   //连续投币送分(0 - 20, 0为关闭)
		unsigned char prize_claw_power;//中奖抓力(5-50)      (数码管版本无效)
		unsigned char power_claw;//	强爪抓力(5-50)        (合爪上停强力，)
		unsigned char top_claw_power;//到顶抓力(0 - 40, 正常可以弱爪抓力相同)   (上停停顿抓力)
		unsigned char weak_claw_power;// 	弱爪抓力(2 - 40)      (天车回归弱力)
		unsigned char weak_strong;//弱力加强   (0-2)= 1，     0冠兴模式，1加强模式，2魔掌模式
		unsigned char sell_function;//	贩卖功能开启(0 / 1)
		unsigned char sell_count;//贩卖次数  (1 -100)= 10；
		unsigned char prize_inductor;//     中奖感应器开启(0 / 1)
		unsigned char air_claw_thing; //    空中抓物功能开启(0 / 1)
		unsigned char start_score_remain;//  	开机分数保留开启(0 / 1)
		unsigned char shake_clean_score_funtion;// 	摇晃清分功能开启(0 / 1)
		unsigned char front_back_speed;//     前后速度(5 - 50, 默认50)
		unsigned char left_right_speed;//     左右速度(5 - 50, 默认50)
		unsigned char up_down_speed;//     上下速度(5 - 50, 默认50)
	}wwj_set_param_t;

	typedef struct serial_param_s
	{
		int bound_rate; //波特率
		int byte_size; //数据位
		int parity;   //奇偶校验。默认为无校验。NOPARITY 0； ODDPARITY 1；EVENPARITY 2；MARKPARITY 3；SPACEPARITY 4
		int stop_bits;//停止位
		int fbinary;//二进制模式
		int fparity;//奇偶校验
	}serial_param_t;

	typedef enum
	{
		kfront = 0, /*前*/
		kback, /*后*/
		kleft, /*左*/
		kright,/*右*/
		kclaw /*下抓*/
	}serial_direction_opt_type_e;

	typedef enum
	{

		kgamepay = 0,//云上分
		kgameend,//游戏结束
		kgameprize,//中奖
		kgameonline,//查询链接
		kgamecheckaccount,//查询终端账目
	}wwj_callback_func_type_e;

	typedef enum
	{
		error = -1,//接口调用失败
		normal = 0, //正常
		left_error, //向左故障
		right_error,//向右故障
		front_error,//向前故障
		back_error,//向后故障
		down_error,//向下故障
		up_error,//向上故障
		shake_error,//摇晃故障
		light_eye_error,//光眼故障
	}wwj_device_status_e;

	//娃娃机主板类型
	enum wwj_mainboard_index
	{
		kMainboard01 = 0x7E,
	};

	//回调类型
	typedef void(*wwj_callback_func)(wwj_callback_func_type_e type, int code, wwj_device_status_e status);

	class WwjControl
	{
	public:
		WwjControl();
		virtual ~WwjControl();
		bool OpenSerial(const char* com);//打开串口
		void CloseSerial();//关闭串口
		bool SetSerialParam(serial_param_t param);//设置串口参数
		virtual bool CrownBlockReset();//天车归位
		virtual wwj_set_param_t GetSettingParam();//获取娃娃机参数
		virtual bool  SetSettingParam(wwj_set_param_t param);//设置娃娃机设备参数
		virtual bool SerialDirectectOpt(serial_direction_opt_type_e type);//娃娃机方向操作
		virtual void SerialSetStepSize(unsigned char step_size);//娃娃机步长
		virtual void  Pay(int coins);//云上分，上分之前应先调用CheckNormal接口检测设备状态 结果由回调返回
		virtual bool QueryDeviceInfo();//查询终端账目（用于查询设备的账目状况，故障状态等 结果由回调返回
		virtual bool CheckNormal();//查询链接, 用户查询是否正常,结果由回调返回
		void SetOptFuncCb(wwj_callback_func cb) { wwj_opt_cb_ = cb; }//设置回调函数
		wwj_callback_func GetOptFuncCb() { return wwj_opt_cb_; }//获取回调函数
		HANDLE GetSerialHandle() { return serial_handle_; } //获取串口句柄
		void SetMainBoardIndex(wwj_mainboard_index index) { wwj_mainboard_index_ = index; }//设置主板类型
		
	private:
		unsigned char cmd_data_[BUF_LEN];
		unsigned char send_data_[BUF_LEN];
		HANDLE serial_read_thread_id_;//串口读线程
		wwj_callback_func wwj_opt_cb_;
		HANDLE serial_handle_;
		wwj_set_param_t wwj_setting_param_;
		unsigned char wwj_step_size_;
		wwj_mainboard_index wwj_mainboard_index_;
	private:
		int SerialCmdHelp(unsigned char* buf, unsigned int buf_size, unsigned char cmd, unsigned char* data, size_t data_size, int* length);
		int SetSerialComTimeout();

	};
}
#endif
