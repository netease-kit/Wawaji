#include "serial_win32_wmq.h"
#include "serial_common.h"

namespace nim_wwj
{
	BOOL serial_close_flag = FALSE;

	static unsigned char frame_data_head = '#';
	static unsigned char frame_data_tail = '*';
	//监听读线程
	static unsigned int __stdcall serial_read_data_thread(LPVOID lpParam)
	{
		WwjControl_Wmq* wwj_control = (WwjControl_Wmq*)lpParam;
		if (wwj_control)
		{
			HANDLE SerialHandle = wwj_control->serial_handle_;
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
				data_len = serial_read_data(SerialHandle, &result_data, 4, 0);
				if (result_data != NULL)
				{
					printf("result_data[0]:%x,result_data[1]:%x,result_data[2]:%x,result_data[3]\n", result_data[0], result_data[1], result_data[2], result_data[3]);
				}
				else
				{
					printf("result data is NULL\n");
				}
				
				//分析窗口指令
				if (data_len > 0&& result_data!=NULL&&result_data[0]==frame_data_head&&result_data[3]==frame_data_tail)
				{
					switch (result_data[1])
					{
					case frame_cmd_game_start:
						if (wwj_opt_cb_ != NULL)
						{
							wwj_opt_cb_(kgamepay, kSerialOptSuccess, normal);
						}
						break;
					case frame_cmd_control:
						break;
					case frame_cmd_strong_claw_power:
						break;
					case frame_cmd_weak_claw_power:
						break;
					case frame_cmd_game_time:
						break;
					case frame_cmd_check_device:
						if (result_data[2] == 0x00)
						{
							if (wwj_opt_cb_ != NULL)
							{
								wwj_opt_cb_(kgameonline, kSerialOptSuccess, normal);
							}
						}
						else if (result_data[2] == 0x01)
						{
							if (wwj_opt_cb_ != NULL)
							{
								wwj_opt_cb_(kgameonline, kSerialOptSuccess, error);
							}
						}
						break;
					case frame_cmd_heartbeat:
						if (result_data[2] == 0x01)
						{
							if (wwj_opt_cb_ != NULL)
							{
								wwj_opt_cb_(kgamecheckaccount, kSerialOptSuccess, error);
							}
						}
						else if (result_data[2] == 0x00)
						{
							if (wwj_opt_cb_ != NULL)
							{
								wwj_opt_cb_(kgamecheckaccount, kSerialOptSuccess, normal);
							}
						}
						break;
					case frame_cmd_game_end :
						if (result_data[2] == 0x00)
						{
							if (wwj_opt_cb_ != NULL)
							{
								wwj_opt_cb_(kgameend, kSerialOptSuccess, normal);
							}
						}
						else if (result_data[2] == 0x01)
						{
							if (wwj_opt_cb_ != NULL)
							{
								wwj_opt_cb_(kgameprize, kSerialOptSuccess, normal);
							}
						}
						break;
					default:
						break;
					}
				}
			}

		}
		printf("read thread exit\n");
		return 0;
	}
	WwjControl_Wmq::WwjControl_Wmq()
	{
		wwj_set_param_.auto_down_claw = 59;
		wwj_set_param_.power_claw = 50;
		wwj_set_param_.weak_claw_power = 24;
		wwj_set_param_.game_paly_levle = 10;
		opt_count_ = 0;

	}

	WwjControl_Wmq::~WwjControl_Wmq()
	{
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			serial_close_flag = TRUE;
			WaitForSingleObject(serial_read_thread_id_, INFINITE);   //等待线程执行完  
			CloseHandle(serial_handle_);
			serial_handle_ = INVALID_HANDLE_VALUE;
		}
	}

	//天车归位
	bool WwjControl_Wmq::CrownBlockReset()
	{
		return true;
	}

	wwj_set_param_t WwjControl_Wmq::GetSettingParam()
	{
		return wwj_set_param_;
	}

	bool  WwjControl_Wmq::SetSettingParam(wwj_set_param_t param)
	{
		wwj_set_param_ = param;
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			int data_len = 4;
			send_data_[0] = frame_data_head;
			send_data_[3] = frame_data_tail;
			//设置强抓力
			send_data_[1] = frame_cmd_strong_claw_power;
			send_data_[2] = wwj_set_param_.power_claw;
			serial_write_data(serial_handle_, send_data_, data_len);
			//设置弱抓力
			send_data_[1] = frame_cmd_weak_claw_power;
			send_data_[2] = wwj_set_param_.weak_claw_power;
			serial_write_data(serial_handle_, send_data_, data_len);
			//游戏时间设置
			send_data_[1] = frame_cmd_game_time;
			send_data_[2] = wwj_set_param_.auto_down_claw;
			serial_write_data(serial_handle_, send_data_, data_len);
		}
		return true;
	}

	void WwjControl_Wmq::StartSerialReadThread()
	{
		printf("start serial read thread\n");
		serial_read_thread_id_ = (HANDLE)_beginthreadex(NULL, 0, serial_read_data_thread, this, 0, NULL);
	}

	bool WwjControl_Wmq::SerialDirectectOpt(serial_direction_opt_type_e type)
	{
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			int data_len = 4;
			send_data_[0] = frame_data_head;
			send_data_[3] = frame_data_tail;
			send_data_[1] = frame_cmd_control;
			switch (type)
			{
			case kfront:
				send_data_[2] = 0x01;
				break;
			case kclaw:
				send_data_[2] = 0x10;
				break;
			case kleft:
				send_data_[2] = 0x04;
				break;
			case kright:
				send_data_[2] = 0x08;
				break;
			case kback:
				send_data_[2] = 0x02;
				break;
			}
			
			serial_write_data(serial_handle_, send_data_, data_len);
			Sleep(260);
			send_data_[1] = frame_cmd_control;
			send_data_[2] = 0x00;
			serial_write_data(serial_handle_, send_data_, data_len);
		}
		return true;
	}

	void WwjControl_Wmq::SerialSetStepSize(unsigned char step_size)
	{
		wwj_step_size_ = step_size;
	}

	void WwjControl_Wmq::Pay(int coins)
	{
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			int data_len = 4;
			send_data_[0] = frame_data_head;
			send_data_[3] = frame_data_tail;
			send_data_[1] = frame_cmd_game_time;
			send_data_[2] = wwj_set_param_.auto_down_claw;
			serial_write_data(serial_handle_, send_data_, data_len);
			if (opt_count_ < wwj_set_param_.game_paly_levle)
			{
				send_data_[1] = 0x00;
				send_data_[2] = 0x00;
			}
			else
			{
				opt_count_ = 0;
				send_data_[1] = 0x00;
				send_data_[2] = 0x01;
			}
			serial_write_data(serial_handle_, send_data_, data_len);
			opt_count_++;
		}
	}

	bool WwjControl_Wmq::QueryDeviceInfo()
	{
		return true;
	}

	bool WwjControl_Wmq::CheckNormal()
	{
		if (serial_handle_ != INVALID_HANDLE_VALUE)
		{
			int data_len = 4;
			send_data_[0] = frame_data_head;
			send_data_[1] = 0x0E;
			send_data_[2] = 0x00;
			send_data_[3] = frame_data_tail;
			serial_write_data(serial_handle_, send_data_, data_len);
		}
		return true;
	}

	void  WwjControl_Wmq::CloseSerial()
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
