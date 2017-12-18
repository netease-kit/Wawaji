#include "serial_common.h"

unsigned char result_data[BUF_LEN];
//read_size 串口中应读取的字节数
//buf_offset 数据缓存偏移
int serial_read_data(HANDLE SerialHandle,unsigned char** result_buf, int read_size, int buf_offset)
{
	DWORD  dwRead = 0;
	//if (SerialHandle != INVALID_HANDLE_VALUE)
	{
		BOOL bReadOk = ReadFile(SerialHandle, result_data + buf_offset, read_size, &dwRead, NULL);
		if (!bReadOk || (dwRead <= 0))
		{
			printf("serial receive data failed\n");
		}
		(*result_buf) = result_data;
	}
	return dwRead;
}

int serial_write_data(HANDLE SerialHandle, unsigned char* data, size_t length)
{
	if (SerialHandle != INVALID_HANDLE_VALUE)
	{
		DWORD WriteNum = 0;
		if (WriteFile(SerialHandle, data, length, &WriteNum, 0))
			return 0;
	}
	return -1;
}