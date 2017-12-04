#include <stdio.h>
#include "serial_win32.h"

void wwj_callback(wwj_callback_func_type_e type, int code)
{
	printf("type:%d,code:%d\n", type, code);
}

int main()
{
	char com[20];
	printf("input com:\n");
	scanf("%s", &com);
	wwj_set_func_cb(wwj_callback);
	HANDLE SerialHandle = wwj_open_serial(com);
	serial_param_t param;
	param.bound_rate = 38400;
	param.byte_size = 8;
	param.stop_bits = 1;
	param.fbinary = 1;
	param.fparity = 0;
	param.parity = NOPARITY;
	wwj_set_serial_param(SerialHandle, param);
	wwj_set_func_cb(wwj_callback);
	while (1)
	{
		printf("input the opt type:");
		char opt_type;
		scanf("%c", &opt_type);
		switch (opt_type)
		{
		case 'p':
		{
			int coin = 0;
			printf("input the coins:\n");
			scanf("%d", &coin);
			if (coin > 0)
				wwj_pay(SerialHandle, coin);
		}
		break;
		case 'l':
		{
			wwj_serial_directect_opt(SerialHandle, kleft);
		}
			break;
		case 'r':
		{
			wwj_serial_directect_opt(SerialHandle, kright);
		}
		break;
		case 'f':
		{
			wwj_serial_directect_opt(SerialHandle, kfront);
		}
			break;
		case 'b':
		{
			wwj_serial_directect_opt(SerialHandle, kback);
		}
			break;
		case 'c':
		{
			wwj_serial_directect_opt(SerialHandle, kclaw);
		}
			break;
		case 'e':
			wwj_close_serial(SerialHandle);
			goto quit;
			break;
		case 's':
		{
			int step_size = 0;
			printf("input step size:\n");
			scanf("%d", &step_size);
			wwj_serial_set_step_size(step_size);
		}
		break;
		case 't':
		{
			wwj_set_param_t param;
			wwj_init_setting_param(&param);
			printf("param.auto_down_claw %d\n", param.auto_down_claw);
			wwj_set_param(SerialHandle, param);
		}
			break;
		default:
			break;
		}
	}

quit:
	getchar();
	exit(0);
}