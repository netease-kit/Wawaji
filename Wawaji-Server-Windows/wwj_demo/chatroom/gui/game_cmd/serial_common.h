#pragma once

#define BUF_LEN 240

int serial_read_data(HANDLE SerialHandle, unsigned char** result_buf, int read_size, int buf_offset);
int serial_write_data(HANDLE SerialHandle, unsigned char* data, size_t length);