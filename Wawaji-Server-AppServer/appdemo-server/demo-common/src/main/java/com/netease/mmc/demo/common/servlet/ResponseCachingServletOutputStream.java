package com.netease.mmc.demo.common.servlet;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.servlet.ServletOutputStream;

/**
 * ResponseCachingServletOutputStream
 *
 * @author hzzhanghan
 * @date 2017/4/6
 * @since 1.0
 */
public class ResponseCachingServletOutputStream extends ServletOutputStream {

    /**
     * Cache字节输出流
     */
    private ByteArrayOutputStream cacheByteArrayOutputStream;

    /**
     * 原始的Response输出流
     */
    private ServletOutputStream originServletOutputStream;

    public ResponseCachingServletOutputStream(ServletOutputStream originServletOutputStream,
            ByteArrayOutputStream cacheByteArrayOutputStream) {
        this.cacheByteArrayOutputStream = cacheByteArrayOutputStream;
        this.originServletOutputStream = originServletOutputStream;
    }

    @Override
    public void write(int b) throws IOException {
        cacheByteArrayOutputStream.write(b);
        originServletOutputStream.write(b);
    }

    @Override
    public void write(byte[] bytes) throws IOException {
        cacheByteArrayOutputStream.write(bytes);
        originServletOutputStream.write(bytes);
    }

    @Override
    public void write(byte[] bytes, int off, int len) throws IOException {
        cacheByteArrayOutputStream.write(bytes, off, len);
        originServletOutputStream.write(bytes, off, len);
    }

    @Override
    public void flush() throws IOException {
        originServletOutputStream.flush();
        cacheByteArrayOutputStream.flush();
    }

    @Override
    public void close() throws IOException {
        originServletOutputStream.close();
        cacheByteArrayOutputStream.close();
    }
}
