#include <stdlib.h>
#include <stdio.h>
#include <windows.h>
#include <process.h>
#include "serial_win32.h"
#include "serial_common.h"


static unsigned char frame_head = 0xaa;   //帧头 固定为0xaa
static unsigned char frame_length = 0x00; //Index + CMD +Data + check 的长度
static unsigned char frame_index = 0x01;  //主机：0x01 终端：0x01~0xFF
static unsigned char frame_cmd = 0x00;    //表明数据帧的类型
//Data[N](数据) 此帧数据区。
static unsigned char frame_check = 0x00;  //校验范围：Length+ Index+ CMD+ Data。
static unsigned char frame_end = 0xdd;	  //帧尾 固定为0xDD

BOOL serial_close_flag = FALSE;



//娃娃机设备错误
enum wwj_device_error
{
	kLeftError = 0xE1,
	kRightError = 0xE2,
	kBackError = 0xE3,
	kFrontError = 0xE4,
	kDownError = 0xE5,
	kUpError = 0xE6,
	kShakeError = 0xE7,
	kLightError = 0xE8,
};


enum wwj_cmd
{
	frame_cmd_query = 0x01,//查询链接 此指令用户查询链接是否正常。
	frame_cmd_score = 0x03,//云上分 此指令用于向终端发送网络投币数量,多字节数据低位在前。
	frame_cmd_account = 0x04, //此指令用于查询设备的账目状态，故障状态等。
	frame_cmd_query_incremental = 0x09, //查询增量（娃娃机）
	frame_cmd_upload_incremental_ack = 0x13, //终端主动上传账目增量应答（娃娃机） 
	frame_cmd_query_signal_ack = 0x19,//查询信号应答
	frame_cmd_timer_query_total_accounts = 0x1A,//定时查询总账（娃娃机）
	frame_cmd_rocker_control = 0xA1,//摇杆控制
	frame_cmd_rocker_reset = 0xfc,//天车回位主动发送
	frame_cmd_set = 0x06,//设置
	frame_cmd_end=0xa2,//天车归位
	frame_cmd_prize=0x13 //中奖
};


namespace nim_wwj
{

	//监听读线程
	unsigned int __stdcall serial_read_data_thread(LPVOID lpParam)
	{
		WwjControl* wwj_control = (WwjControl*)lpParam;
		if (wwj_control)
		{
			HANDLE SerialHandle = wwj_control->GetSerialHandle();
			int data_len = 0;
			BOOL bResult = TRUE;
			DWORD dwError = 0;
			COMSTAT com_stat;
			int ret = -1;
			while (!serial_close_flag)
			{
				wwj_callback_func wwj_opt_cb_ = wwj_control->GetOptFuncCb();
				bResult = ClearCommError(SerialHandle, &dwError, &com_stat);
				if (com_stat.cbInQue == 0)
					continue;
				unsigned char* result_data = NULL;
				//memset(result_data, 0, BUF_LEN);
				data_len = serial_read_data(SerialHandle,&result_data, 1, 0);
				//分析窗口指令
				if (data_len > 0 && result_data!=NULL&&result_data[0] == frame_head)
				{
					data_len = serial_read_data(SerialHandle, &result_data,1, 1);
					printf("data[0]:%x data[1] %x\n", result_data[0], result_data[1]);
					if (data_len > 0)
					{
						data_len = serial_read_data(SerialHandle, &result_data, result_data[1] + 1, 2);
						printf("data[2]:%x data[3] %x\n", result_data[2], result_data[3]);
						if (data_len > 0)
						{
							switch (result_data[3])
							{
							case frame_cmd_query://查询链接
							{
								wwj_control->SetMainBoardIndex((wwj_mainboard_index)result_data[2]);
								if (wwj_opt_cb_ != NULL)
								{
									wwj_opt_cb_(kgamepay, kSerialOptSuccess, normal);
								}
								else
								{
									printf("wwj_opt_cb_ is null\n");
								}
							}
							break;
							case frame_cmd_score: //云上分应答
							{
								ret = result_data[4];
								//回调
								if (wwj_opt_cb_ != NULL)
								{
									wwj_opt_cb_(kgamepay, ret == 1 ? kSerialOptSuccess : kSerialOptFailed, normal);
								}
								else
								{
									printf("wwj_opt_cb_ is null\n");
								}

								if (ret == 1)
								{
									printf("pay coin success\n");
								}
								else
								{
									printf("pay coin failed\n");
								}
							}
							break;
							case frame_cmd_end:
							{
								if (wwj_opt_cb_ != NULL)
								{
									wwj_opt_cb_(kgameend, kSerialOptSuccess, normal);
								}
								else
								{
									printf("wwj_opt_cb_ is null\n");
								}
							}
							break;
							case frame_cmd_prize:
							{
								if (wwj_opt_cb_ != NULL)
								{
									static bool init_serial_number = false;
									static unsigned char serial_number = 0xff;
									unsigned char gift_count = result_data[7];
									printf("serial_number:%x,gift count:%x\n", serial_number, gift_count);
									if ((!init_serial_number) || serial_number != result_data[4])
									{
										wwj_device_status_e status = normal;
										switch (result_data[5])
										{
										case kLeftError:
											status = left_error;
											break;
										case kRightError:
											status = right_error;
											break;
										case kBackError:
											status = back_error;
											break;
										case kFrontError:
											status = front_error;
											break;
										case kDownError:
											status = down_error;
											break;
										case kUpError:
											status = up_error;
											break;
										case kShakeError:
											status = shake_error;
											break;
										case kLightError:
											status = light_eye_error;
											break;
										default:
											break;
										}
										if (gift_count > 0)
										{
											wwj_opt_cb_(kgameprize, kSerialOptSuccess, status);
										}
										else
										{
											wwj_opt_cb_(kgameprize, kSerialOptFailed, status);
										}
										serial_number = result_data[4];
										init_serial_number = true;
									}
								}
								else
								{
									printf("wwj_opt_cb_ is null\n");
								}
							}
							break;
							case frame_cmd_account:
							{
								if (wwj_opt_cb_ != NULL)
								{
									wwj_device_status_e status = normal;
									switch (result_data[4])
									{
									case kLeftError:
										status = left_error;
										break;
									case kRightError:
										status = right_error;
										break;
									case kBackError:
										status = back_error;
										break;
									case kFrontError:
										status = front_error;
										break;
									case kDownError:
										status = down_error;
										break;
									case kUpError:
										status = up_error;
										break;
									case kShakeError:
										status = shake_error;
										break;
									case kLightError:
										status = light_eye_error;
										break;
									default:
										break;
									}
									wwj_opt_cb_(kgamecheckaccount, kSerialOptSuccess, status);
								}
							}
							break;
							default:
								break;
							}
						}
					}
				}
			}

		}
		printf("read thread exit\n");
		return 0;
	}


	WwjControl::WwjControl()
	{
		serial_handle_ = INVALID_HANDLE_VALUE;
		wwj_setting_param_.once_need_coin = 1;//几币一玩                                          
		wwj_setting_param_.game_paly_levle = 10;//中奖基数(1-99)  (另外叫N次强抓力，贩卖次数，游戏难度) 
		wwj_setting_param_.auto_down_claw = 59;//自动下抓时间(5-60)
		wwj_setting_param_.power_time = 20;//强力时间(5-99)
		wwj_setting_param_.weak_time = 10; //弱力时间(1 - 60) = 12
		wwj_setting_param_.prize_pattern = 0;//中奖模式(0 / 1 / 2  随机，固定，取消)
		wwj_setting_param_.sell_pattern = 0;//贩卖模式(0/1/2  强三，强送，强投)
		wwj_setting_param_.prize_score = 0;   //连续投币送分(0 - 20, 0为关闭)  
		wwj_setting_param_.prize_claw_power = 8;//中奖抓力(5-50)      (数码管版本无效)
		wwj_setting_param_.power_claw = 38;//	强爪抓力(5-50)        (合爪上停强力，)
		wwj_setting_param_.top_claw_power = 20;//到顶抓力(0 - 40, 正常可以弱爪抓力相同)   (上停停顿抓力)
		wwj_setting_param_.weak_claw_power = 20;// 	弱爪抓力(0 - 40)      (天车回归弱力)
		wwj_setting_param_.weak_strong = 1;//弱力加强   (0-2)= 1，     0冠兴模式，1加强模式，2魔掌模式
		wwj_setting_param_.sell_function = 0;//	贩卖功能开启(0 / 1)
		wwj_setting_param_.sell_count = 10; //   贩卖次数   (1 -100)= 10；
		wwj_setting_param_.prize_inductor = 1;//     中奖感应器开启(0 / 1)
		wwj_setting_param_.air_claw_thing = 0; //    空中抓物功能开启(0 / 1)
		wwj_setting_param_.start_score_remain = 0;//  	开机分数保留开启(0 / 1)
		wwj_setting_param_.shake_clean_score_funtion = 0;// 	摇晃清分功能开启(0 / 1)
		wwj_setting_param_.front_back_speed = 50;//     前后速度(5 - 50, 默认50)
		wwj_setting_param_.left_right_speed = 50;//     左右速度(5 - 50, 默认50)
		wwj_setting_param_.up_down_speed = 50;//     上下速度(5 - 50, 默认50)
		wwj_step_size_ = 70;
		memset(cmd_data_, 0, BUF_LEN);
		memset(send_data_, 0, BUF_LEN);
		wwj_mainboard_index_ = kMainboard01;
		wwj_opt_cb_ = NULL;
	}

	WwjControl::~WwjControl()
	{
		CloseSerial();
	}

	bool WwjControl::CrownBlockReset()
	{
		int cmd_data_length = 0;
		bool ret = false;
		if (serial_handle_ != INVALID_HANDLE_VALUE&&SerialCmdHelp(cmd_data_, BUF_LEN, frame_cmd_rocker_reset, send_data_, 0, &cmd_data_length) == 0)
		{
			serial_write_data(serial_handle_, cmd_data_, cmd_data_length);
			ret = true;
		}
		else
		{
			printf("func:%s get cmd error\n", __FUNCTION__);
		}
		return ret;
	}



	bool WwjControl::SetSerialParam(serial_param_t param)
	{
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			//设置串口参数
			//读串口原来的参数设置
			DCB dcb;
			GetCommState(serial_handle_, &dcb);   //串口打开方式
												//串口参数配置 
			dcb.DCBlength = sizeof(DCB);
			dcb.BaudRate = param.bound_rate;
			dcb.ByteSize = param.byte_size;
			//dcb.Parity = EVENPARITY;
			dcb.StopBits = ONESTOPBIT;
			dcb.fBinary = TRUE;                 //  二进制数据模式
			dcb.fParity = TRUE;

			if (!SetCommState(serial_handle_, &dcb))
			{
				printf("set serial param error!\n");
				return false;
			}

			SetupComm(serial_handle_, 1024, 1024);    //设置缓冲区
			SetSerialComTimeout();//设置读写超时
			StartSerialReadThread();
			return true;
		}
		return false;
	}

	void WwjControl::StartSerialReadThread()
	{
		serial_read_thread_id_ = (HANDLE)_beginthreadex(NULL, 0, serial_read_data_thread, this, 0, NULL);
	}

	wwj_set_param_t WwjControl::GetSettingParam()
	{
		return wwj_setting_param_;
	}

	bool  WwjControl::SetSettingParam(wwj_set_param_t param)
	{
		wwj_setting_param_ = param;
		int ret = -1;
		int length = 0;
		size_t data_size = 0;
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			switch (wwj_mainboard_index_)
			{
			case nim_wwj::kMainboard01:
				send_data_[0] = param.auto_down_claw;//自动下抓时间
				send_data_[1] = param.once_need_coin;//几币一玩
				send_data_[2] = param.prize_score;// 连续投币送分(0-20 , 0为关闭)
				send_data_[3] = param.air_claw_thing;	//空中取物   ,(0-1)= 1
				send_data_[4] = param.prize_inductor;  //中奖感应器(0 - 1) = 0  无 有
				send_data_[5] = param.prize_pattern;	//中奖模式   (0-1)= 0,    0 固定，1 随机
				send_data_[6] = param.power_time;   //强力时间   (1-60)=  10；
				send_data_[7] = param.weak_time; //弱力时间(1 - 60) = 12
				send_data_[8] = param.weak_claw_power;//	 弱抓抓力   (2-40)= 8
				send_data_[9] = param.weak_strong;//弱力加强   (0-2)= 1，     0冠兴模式，1加强模式，2魔掌模式
				send_data_[10] = param.power_claw;// 	强抓抓力   (2-50)= 38；
				send_data_[11] = param.game_paly_levle;//	  N 局强抓力   (1 -100)= 10；
				send_data_[12] = param.sell_function;//    贩卖功能   (0-1)=   关开
				send_data_[13] = param.sell_count; //   贩卖次数   (1 -100)= 10；
				send_data_[14] = param.sell_pattern;// 贩卖模式   (0-2)= 0    0 强三  1  强送   2  强投
				data_size = 15;
				break;
			default:
				send_data_[0] = param.once_need_coin;//几币一玩
				send_data_[1] = param.game_paly_levle;//中奖基数(1-99)  (另外叫N次强抓力，贩卖次数，游戏难度)
				send_data_[2] = param.auto_down_claw;//自动下抓时间(5-60)
				send_data_[3] = param.power_time;//强力时间(5-99)
				send_data_[4] = param.prize_pattern;//中奖模式(0 / 1 / 2  随机，固定，取消)
				send_data_[5] = param.sell_pattern;//贩卖模式(0/1/2  强三，强送，强投)
				send_data_[6] = param.prize_score;   //连续投币送分(0 - 20, 0为关闭)
				send_data_[7] = param.prize_claw_power;//中奖抓力(5-50)      (数码管版本无效)
				send_data_[8] = param.power_claw;//	强爪抓力(5-50)        (合爪上停强力，)
				send_data_[9] = param.top_claw_power;//到顶抓力(0 - 40, 正常可以弱爪抓力相同)   (上停停顿抓力)
				send_data_[10] = param.weak_claw_power;// 	弱爪抓力(0 - 40)      (天车回归弱力)
				send_data_[11] = param.sell_function;//	贩卖功能开启(0 / 1)
				send_data_[12] = param.prize_inductor;//     中奖感应器开启(0 / 1)
				send_data_[13] = param.air_claw_thing; //    空中抓物功能开启(0 / 1)
				send_data_[14] = param.start_score_remain;//  	开机分数保留开启(0 / 1)
				send_data_[15] = param.shake_clean_score_funtion;// 摇晃清分功能开启(0 / 1)
				send_data_[16] = param.front_back_speed;//     前后速度(5 - 50, 默认50)
				send_data_[17] = param.left_right_speed;//     左右速度(5 - 50, 默认50)
				send_data_[18] = param.up_down_speed;//     上下速度(5 - 50, 默认50)
				data_size = 19;
				break;
			}

			if (SerialCmdHelp(cmd_data_, BUF_LEN, frame_cmd_set, send_data_, data_size, &length) == 0)
			{
				printf("frame_cmd_set length:%d\n", length);
				serial_write_data(serial_handle_, cmd_data_, length);
				ret = 0;
			}
			else
				printf("func:%s get cmd error\n", __FUNCTION__);
		}
		return ret;
	}



	bool WwjControl::SerialDirectectOpt(serial_direction_opt_type_e type)
	{
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			int length;
			int data_len = 2;
			send_data_[1] = wwj_step_size_;
			switch (type)
			{
			case kfront:
				send_data_[0] = 0x01;
				break;
			case kclaw:
				send_data_[0] = 0x10;
				send_data_[1] = 0x02;
				break;
			case kleft:
				send_data_[0] = 0x08;
				break;
			case kright:
				send_data_[0] = 0x04;
				break;
			case kback:
				send_data_[0] = 0x02;
				break;
			}

			if (SerialCmdHelp(cmd_data_, BUF_LEN, frame_cmd_rocker_control, send_data_, data_len, &length) == 0)
				serial_write_data(serial_handle_, cmd_data_, length);
			else
				printf("func:%s get cmd error\n", __FUNCTION__);

		}
		return true;
	}

	void WwjControl::SerialSetStepSize(unsigned char step_size)
	{
		wwj_step_size_ = step_size;
	}

	void  WwjControl::Pay(int coins)
	{
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			static char count = 0;
			if (count > 50)
				count = 0;
			count++;
			send_data_[0] = 0x02 + count;
			send_data_[1] = (unsigned char)coins;
			//data[2]
			send_data_[3] = (unsigned char)coins;
			//data[4]
			int length = 0;;
			if (SerialCmdHelp(cmd_data_, BUF_LEN, frame_cmd_score, send_data_, 8, &length) == 0)
			{
				int data_len = 0;
				serial_write_data(serial_handle_, cmd_data_, length);
			}
			else
			{
				printf("func:%s get cmd error\n", __FUNCTION__);
			}
		}
	}

	bool WwjControl::QueryDeviceInfo()
	{
		int length = 0;
		bool  ret = false;
		if (serial_handle_ != INVALID_HANDLE_VALUE&&SerialCmdHelp(cmd_data_, BUF_LEN, frame_cmd_account, send_data_, 0, &length) == 0)
		{
			serial_write_data(serial_handle_, cmd_data_, length);
			ret = true;
		}
		else
		{
			printf("func:%s get cmd error\n", __FUNCTION__);
		}
		return ret;
	}

	bool WwjControl::CheckNormal()
	{
		bool ret = false;
		int length = 0;
		if (serial_handle_ != INVALID_HANDLE_VALUE&&SerialCmdHelp(cmd_data_, BUF_LEN, frame_cmd_query, send_data_, 8, &length) == 0)
		{
			serial_write_data(serial_handle_, cmd_data_, length);
			ret = true;
		}
		return ret;
	}



	int WwjControl::SerialCmdHelp(unsigned char* buf, unsigned int buf_size, unsigned char cmd, unsigned char* data, size_t data_size, int* length)
	{
		if (buf_size < (6 + data_size))
			return -1;
		//Index + CMD +Data + check 的长度
		frame_length = 0x1 + 0x1 + data_size + 0x1;
		//Length+ Index+ CMD+ Data
		frame_check = frame_length + frame_index + cmd;
		buf[0] = frame_head;
		buf[1] = frame_length;
		buf[2] = frame_index;
		buf[3] = cmd;
		for (size_t i = 0;i < data_size;i++)
		{
			frame_check += data[i];
			buf[4 + i] = data[i];
		}
		buf[4 + data_size] = frame_check;
		buf[4 + data_size + 1] = frame_end;
		*length = 6 + data_size;
		return 0;
	}



	int WwjControl::SetSerialComTimeout()
	{
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			COMMTIMEOUTS com_timeout;
			com_timeout.ReadIntervalTimeout = 0;
			com_timeout.ReadTotalTimeoutConstant = 500;
			com_timeout.ReadTotalTimeoutMultiplier = 100;
			com_timeout.WriteTotalTimeoutConstant = 500;
			com_timeout.WriteTotalTimeoutMultiplier = 100;
			SetCommTimeouts(serial_handle_, &com_timeout);
			return 0;
		}
		return -1;
	}

	bool WwjControl::OpenSerial(const char* com)
	{
		bool ret = true;
		char buf[256] = { 0 };
		_snprintf(buf, 256, "\\\\.\\%s", com);         //格式化字符串									//打开串口
		serial_handle_ = CreateFileA(buf, GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_EXISTING, 0, 0);    //同步模式打开串口
		if (serial_handle_ == INVALID_HANDLE_VALUE)  //打开串口失败
		{
			printf("open serial error!\n");
			//ret = false;
		}
		serial_close_flag = FALSE;
		return ret;
	}

	void WwjControl::CloseSerial()
	{
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			serial_close_flag = TRUE;
			WaitForSingleObject(serial_read_thread_id_, INFINITE);   //等待线程执行完  
			CloseHandle(serial_handle_);
			serial_handle_ = INVALID_HANDLE_VALUE;
		}
	}
}