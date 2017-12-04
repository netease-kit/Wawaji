#include <stdlib.h>
#include <stdio.h>
#include <windows.h>
#include <process.h>
#include "serial_win32.h"

#define BUF_LEN 240
#define kSerialOptSuccess 200
#define kSerialOptFailed 100
static unsigned char cmd_buf[BUF_LEN];
static unsigned char data[BUF_LEN];
static unsigned char result_data[BUF_LEN];

static unsigned char frame_head = 0xaa;   //帧头 固定为0xaa
static unsigned char frame_length = 0x00; //Index + CMD +Data + check 的长度
static unsigned char frame_index = 0x01;  //主机：0x01 终端：0x01~0xFF
static unsigned char frame_cmd = 0x00;    //表明数据帧的类型
//Data[N](数据) 此帧数据区。
static unsigned char frame_check = 0x00;  //校验范围：Length+ Index+ CMD+ Data。
static unsigned char frame_end = 0xdd;	  //帧尾 固定为0xDD

static unsigned char wwj_step_size_ = 150;

HANDLE serial_read_thread_id;
BOOL serial_close_flag = FALSE;
wwj_callback_func wwj_opt_cb_;

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


//设置超时
static int set_serial_com_timeout(HANDLE SerialHandle)
{
	if (SerialHandle != INVALID_HANDLE_VALUE)
	{
		COMMTIMEOUTS com_timeout;
		com_timeout.ReadIntervalTimeout = 0;
		com_timeout.ReadTotalTimeoutConstant = 500;
		com_timeout.ReadTotalTimeoutMultiplier = 100;
		com_timeout.WriteTotalTimeoutConstant = 500;
		com_timeout.WriteTotalTimeoutMultiplier = 100;
		SetCommTimeouts(SerialHandle, &com_timeout);
		return 0;
	}
	return -1;
}

//read_size 串口中应读取的字节数
//buf_offset 数据缓存偏移
static int serial_read_data(HANDLE SerialHandle,int read_size,int buf_offset)
{
	DWORD  dwRead = 0;
	if (SerialHandle != INVALID_HANDLE_VALUE)
	{
		BOOL bReadOk = ReadFile(SerialHandle, result_data+buf_offset, read_size, &dwRead, NULL);
		if (!bReadOk || (dwRead <= 0))
		{
			//printf("serial receive data failed\n");
		}
	}
	return dwRead;
}


static int serial_write_data(HANDLE SerialHandle, unsigned char* data, size_t length)
{
	if (SerialHandle != INVALID_HANDLE_VALUE)
	{
		DWORD WriteNum = 0;
		if (WriteFile(SerialHandle, data, length, &WriteNum, 0))
			return 0;
	}
	return -1;
}



static int serial_cmd_help(unsigned char* buf,unsigned int buf_size,unsigned char cmd,unsigned char* data,size_t data_size,int* length)
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
	 buf[4 + data_size] = frame_check ;
	 buf[4 + data_size + 1] = frame_end;
	 *length = 6 + data_size;
	 return 0;
}

//监听读线程
unsigned int __stdcall serial_read_data_thread(LPVOID lpParam)
{
	HANDLE SerialHandle = (HANDLE)lpParam;
	int data_len = 0;
	BOOL bResult = TRUE;
	DWORD dwError = 0;
	COMSTAT com_stat;
	int ret = -1;
	while (!serial_close_flag)
	{
		bResult = ClearCommError(SerialHandle, &dwError, &com_stat);
		if (com_stat.cbInQue == 0)
			continue;
		memset(result_data, 0, BUF_LEN);
		data_len = serial_read_data(SerialHandle,1,0);
		//分析窗口指令
		if (data_len > 0&&result_data[0]==frame_head)
		{
			data_len = serial_read_data(SerialHandle, 1, 1);
			printf("data[0]:%x data[1] %x\n", result_data[0], result_data[1]);
			if (data_len > 0)
			{
				data_len = serial_read_data(SerialHandle, result_data[1]+1, 2);
				printf("data[2]:%x data[3] %x\n", result_data[2], result_data[3]);
				if (data_len > 0)
				{
					switch (result_data[3])
					{
					case frame_cmd_score: //云上分应答
					{
						ret = result_data[4];
						//回调
						if (wwj_opt_cb_ != NULL)
						{
							wwj_opt_cb_(kgamepay, ret == 1 ? kSerialOptSuccess : kSerialOptFailed);
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
							wwj_opt_cb_(kgameend, kSerialOptSuccess);
						}
					}
					break;
					case frame_cmd_prize:
					{
						if (wwj_opt_cb_ != NULL)
						{
							wwj_opt_cb_(kgameprize, kSerialOptSuccess);
						}
					}
					default:
						break;
					}
				}
			}
		}
	}

	printf("read thread exit\n");
	return 0;
}
//打开串口
HANDLE wwj_open_serial(char* com)
{
	HANDLE SerialHandle;

	char buf[256] = { 0 };
	_snprintf(buf,256,"\\\\.\\%s", com);         //格式化字符串									//打开串口
	SerialHandle = CreateFileA(buf, GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_EXISTING, 0, 0);    //同步模式打开串口
	if (SerialHandle == INVALID_HANDLE_VALUE)  //打开串口失败
	{
		printf("open serial error!\n");
	}
	if (wwj_opt_cb_ != NULL)
	{
		wwj_opt_cb_(0, 1);
	}
	serial_close_flag = FALSE;
	return SerialHandle;
}


int wwj_init_setting_param(wwj_set_param_t* param)
{
	int ret = -1;
	if (param != NULL)
	{
		param->once_need_coin=1;//几币一玩                                          
		param->game_paly_levle=10;//中奖基数(1-99)  (另外叫N次强抓力，贩卖次数，游戏难度) 
		param->auto_down_claw=45;//自动下抓时间(5-60)
		param->power_time=20;//强力时间(5-99)
		param->weak_time = 10; //弱力时间(1 - 60) = 12
		param->prize_pattern=0;//中奖模式(0 / 1 / 2  随机，固定，取消)
		param->sell_pattern=0;//贩卖模式(0/1/2  强三，强送，强投)
		param->prize_score=0;   //连续投币送分(0 - 20, 0为关闭)  
		param->prize_claw_power=8;//中奖抓力(5-50)      (数码管版本无效)
		param->power_claw=38;//	强爪抓力(5-50)        (合爪上停强力，)
		param->top_claw_power=10;//到顶抓力(0 - 40, 正常可以弱爪抓力相同)   (上停停顿抓力)
		param->weak_claw_power=11;// 	弱爪抓力(0 - 40)      (天车回归弱力)
		param->weak_strong = 1;//弱力加强   (0-2)= 1，     0冠兴模式，1加强模式，2魔掌模式
		param->sell_function=0;//	贩卖功能开启(0 / 1)
		param->sell_count = 10; //   贩卖次数   (1 -100)= 10；
		param->prize_inductor=1;//     中奖感应器开启(0 / 1)
		param->air_claw_thing=0; //    空中抓物功能开启(0 / 1)
		param->start_score_remain=0;//  	开机分数保留开启(0 / 1)
		param->shake_clean_score_funtion=0;// 	摇晃清分功能开启(0 / 1)
		param->front_back_speed=50;//     前后速度(5 - 50, 默认50)
		param->left_right_speed=50;//     左右速度(5 - 50, 默认50)
		param->up_down_speed = 50;//     上下速度(5 - 50, 默认50)
		ret = 0;
	}
	return ret;
}

int wwj_set_serial_param(HANDLE SerialHandle,serial_param_t param)
{
	if (SerialHandle != INVALID_HANDLE_VALUE)
	{
		//设置串口参数
		//读串口原来的参数设置
		DCB dcb;
		GetCommState(SerialHandle, &dcb);   //串口打开方式
											//串口参数配置 
		dcb.DCBlength = sizeof(DCB);
		dcb.BaudRate = param.bound_rate;
		dcb.ByteSize = param.byte_size;
		//dcb.Parity = EVENPARITY;
		dcb.StopBits = ONESTOPBIT;
		dcb.fBinary = TRUE;                 //  二进制数据模式
		dcb.fParity = TRUE;

		if (!SetCommState(SerialHandle, &dcb))
		{
			printf("set serial param error!\n");
			return -1;
		}

		SetupComm(SerialHandle, 1024, 1024);    //设置缓冲区
		wwj_opt_cb_ = NULL;
		set_serial_com_timeout(SerialHandle);//设置读写超时
		serial_read_thread_id= (HANDLE)_beginthreadex(NULL, 0, serial_read_data_thread, SerialHandle, 0, NULL);
		return 0;
	}
	return -1;
}

int wwj_set_param(HANDLE SerialHandle, wwj_set_param_t param)
{
	int ret = -1;
	int length = 0;
	size_t data_size = 0;
	if (SerialHandle != INVALID_HANDLE_VALUE)
	{
		//第一块主板
// 		data[0] = param.once_need_coin;//几币一玩
// 		data[1] = param.game_paly_levle;//中奖基数(1-99)  (另外叫N次强抓力，贩卖次数，游戏难度)
// 		data[2] = param.auto_down_claw;//自动下抓时间(5-60)
// 		data[3] = param.power_time;//强力时间(5-99)
// 		data[4] = param.prize_pattern;//中奖模式(0 / 1 / 2  随机，固定，取消)
// 		data[5] = param.sell_pattern;//贩卖模式(0/1/2  强三，强送，强投)
// 		data[6] = param.prize_score;   //连续投币送分(0 - 20, 0为关闭)
// 		data[7] = param.prize_claw_power;//中奖抓力(5-50)      (数码管版本无效)
// 		data[8] = param.power_claw;//	强爪抓力(5-50)        (合爪上停强力，)
// 		data[9] = param.top_claw_power;//到顶抓力(0 - 40, 正常可以弱爪抓力相同)   (上停停顿抓力)
// 		data[10] = param.weak_claw_power;// 	弱爪抓力(0 - 40)      (天车回归弱力)
// 		data[11] = param.sell_function;//	贩卖功能开启(0 / 1)
// 		data[12] = param.prize_inductor;//     中奖感应器开启(0 / 1)
// 		data[13] = param.air_claw_thing; //    空中抓物功能开启(0 / 1)
// 		data[14] = param.start_score_remain;//  	开机分数保留开启(0 / 1)
// 		data[15] = param.shake_clean_score_funtion;// 	摇晃清分功能开启(0 / 1)
// 		data[16] = param.front_back_speed;//     前后速度(5 - 50, 默认50)
// 		data[17] = param.left_right_speed;//     左右速度(5 - 50, 默认50)
// 		data[18] = param.up_down_speed;//     上下速度(5 - 50, 默认50)

		data[0] = param.auto_down_claw;//自动下抓时间
		data[1] = param.once_need_coin;//几币一玩
		data[2] = param.prize_score;// 连续投币送分(0-20 , 0为关闭)
		data[3] = param.air_claw_thing;	//空中取物   ,(0-1)= 1
		data[4] = param.prize_inductor;  //中奖感应器(0 - 1) = 0  无 有
		data[5] = param.prize_pattern;	//中奖模式   (0-1)= 0,    0 固定，1 随机
		data[6] = param.power_time;   //强力时间   (1-60)=  10；
		data[7] = param.weak_time; //弱力时间(1 - 60) = 12
		data[8] = param.weak_claw_power;//	 弱抓抓力   (2-40)= 8
		data[9] = param.weak_strong;//弱力加强   (0-2)= 1，     0冠兴模式，1加强模式，2魔掌模式
		data[10] = param.power_claw;// 	强抓抓力   (2-50)= 38；
		data[11] = param.game_paly_levle;//	  N 局强抓力   (1 -100)= 10；
		data[12] = param.sell_function;//    贩卖功能   (0-1)=   关开
		data[13] = param.sell_count; //   贩卖次数   (1 -100)= 10；
		data[14] = param.sell_pattern;// 贩卖模式   (0-2)= 0    0 强三  1  强送   2  强投
//		data[15] = param.shake_clean_score_funtion;//  本轮账目清零    
// 		data[16] = param.front_back_speed;//重启系统 
// 		data[17] = param.left_right_speed;// 恢复出厂设置
// 		data[18] = param.up_down_speed;//上下速度(5 - 50, 默认50)
		data_size = 15;

		if (serial_cmd_help(cmd_buf, BUF_LEN, frame_cmd_set, data, data_size, &length) == 0)
		{
			printf("frame_cmd_set length:%d\n", length);
			serial_write_data(SerialHandle, cmd_buf, length);
			ret = 0;
		}
		else
			printf("func:%s get cmd error\n", __FUNCTION__);
	}
	return ret;
}

int wwj_serial_directect_opt(HANDLE SerialHandle, serial_direction_opt_type_e type)
{
	if (SerialHandle != INVALID_HANDLE_VALUE)
	{
		int length;
		int data_len = 2;
		data[1] = wwj_step_size_;
		switch (type)
		{
		case kfront:
			data[0] = 0x01;
			break;
		case kclaw:
			data[0] = 0x10;
			data[1] = 0x02;
			break;
		case kleft:
			data[0] = 0x08;
			break;
		case kright:
			data[0] = 0x04;
			break;
		case kback:
			data[0] = 0x02;
			break;
		}
		
		if (serial_cmd_help(cmd_buf, BUF_LEN, frame_cmd_rocker_control, data, data_len, &length) == 0)
			serial_write_data(SerialHandle, cmd_buf, length);
		else
			printf("func:%s get cmd error\n", __FUNCTION__);
		
	}
	return 0;
}

void wwj_serial_set_step_size(unsigned char step_size)
{
	wwj_step_size_ = step_size;
}

//关闭串口
int wwj_close_serial(HANDLE SerialHandle)
{
	if (SerialHandle != INVALID_HANDLE_VALUE)
	{
		serial_close_flag = TRUE;
		WaitForSingleObject(serial_read_thread_id, INFINITE);   //等待线程执行完  
		CloseHandle(SerialHandle);
		SerialHandle = INVALID_HANDLE_VALUE;
		return 0;
	}
	else
		return -1;
}

int wwj_pay(HANDLE SerialHandle, int coins)
{
	int ret = -1;
	if (SerialHandle != INVALID_HANDLE_VALUE)
	{
		static char count = 0;
		if (count > 50)
			count = 0;
		count++;
		data[0] = 0x02 + count;
		data[1] =(unsigned char) coins;
		//data[2]
		data[3] = (unsigned char)coins;
		//data[4]
		int length = 0;;
		if (serial_cmd_help(cmd_buf, BUF_LEN, frame_cmd_score, data, 8, &length) == 0)
		{
			int data_len = 0;		
			serial_write_data(SerialHandle, cmd_buf, length);
			ret = 0;
		}
		else
		{
			printf("func:%s get cmd error\n", __FUNCTION__);
		}
	}
	return ret;
}

int wwj_crown_block_reset(HANDLE SerialHandle)
{
	int length = 0;
	int ret = -1;
	if (SerialHandle != INVALID_HANDLE_VALUE&&serial_cmd_help(cmd_buf, BUF_LEN, frame_cmd_rocker_reset, data, 0, &length) == 0)
	{
		serial_write_data(SerialHandle, cmd_buf, length);
		ret = 0;
	}
	else
	{
		printf("func:%s get cmd error\n", __FUNCTION__);
	}
	return ret; 
}

wwj_device_status_e wwj_query_device_info(HANDLE SerialHandle)
{
	int length = 0;
	wwj_device_status_e  ret = error;
	if (SerialHandle != INVALID_HANDLE_VALUE&&serial_cmd_help(cmd_buf, BUF_LEN, frame_cmd_timer_query_total_accounts, data, 0, &length) == 0)
	{
		serial_write_data(SerialHandle, cmd_buf, length);
		ret = normal;
	}
	else
	{
		printf("func:%s get cmd error\n", __FUNCTION__);
	}
	return ret;
}


int wwj_check_normal(HANDLE SerialHandle)
{
	int ret = -1;
	int length = 0;
	if (SerialHandle != INVALID_HANDLE_VALUE&&serial_cmd_help(cmd_buf, BUF_LEN, frame_cmd_query, data, 8, &length) == 0)
	{
		serial_write_data(SerialHandle, cmd_buf, length);
		ret = 0;
	}
	return ret;
}

void wwj_set_func_cb(wwj_callback_func cb)
{
	wwj_opt_cb_ = cb;
}