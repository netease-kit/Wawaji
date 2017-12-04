#ifndef SERIAL_WIN32_H
#define SERIAL_WIN32_H
#include <windows.h>

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
	kfront=0, /*前*/
	kback, /*后*/
	kleft, /*左*/
	kright,/*右*/
	kclaw /*下抓*/
}serial_direction_opt_type_e;

typedef enum
{
	kgamepay = 0,//云上分
	kgameend ,//游戏结束
	kgameprize,//中奖
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

//回调类型
typedef void(*wwj_callback_func)(wwj_callback_func_type_e type, int code);


//打开串口
HANDLE wwj_open_serial(char* com);

//设置串口参数
int wwj_set_serial_param(HANDLE SerialHandle, serial_param_t param);

//获得wwj设备默认的参数
//param[in] param wwj设备参数结构体
int wwj_init_setting_param(wwj_set_param_t* param);

//param[in] param wwj设备参数结构体
int wwj_set_param(HANDLE SerialHandle, wwj_set_param_t param);

//fn:查询链接, 用户查询是否正常
// param[in] SerialHanle 句柄
//return：0正常，-1异常
int wwj_check_normal(HANDLE SerialHandle);

//云上分
int wwj_pay(HANDLE SerialHandle,int coins);

//设置步长
//param[in] step_size 电机停止延迟时间
void wwj_serial_set_step_size(unsigned char step_size);

//方向操作
//param[in] SerialHandle句柄
//param[in] type 操作类型
int wwj_serial_directect_opt(HANDLE SerialHandle,serial_direction_opt_type_e type);

//天车回位
//param[in] SerialHandle句柄
int wwj_crown_block_reset(HANDLE SerialHandle);


//查询终端账目（用于查询设备的账目状况，故障状态等
wwj_device_status_e wwj_query_device_info(HANDLE SerialHandle);

//关闭串口
//param[in] SerialHandle句柄
int wwj_close_serial(HANDLE SerialHandle);

//设置回调函数
void wwj_set_func_cb(wwj_callback_func cb);

#endif
