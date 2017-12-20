package com.netease.mmc.demo.common.servlet;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import com.netease.mmc.demo.common.constant.CommonConst;


/**
 * ResponseCachingResponseWrapper
 *
 * @author hzzhanghan
 * @date 2017/4/6
 * @since 1.0
 */
public class ResponseCachingResponseWrapper extends HttpServletResponseWrapper {

    private final ByteArrayOutputStream cache;
    private ServletOutputStream outputStream;
    private PrintWriter printWriter;
    private byte[] responseBody;

    public ResponseCachingResponseWrapper(HttpServletResponse response) throws IOException {
        super(response);
        this.cache = new ByteArrayOutputStream();
        this.outputStream = new ResponseCachingServletOutputStream(this.getResponse().getOutputStream(), cache);
        this.printWriter = new PrintWriter(new OutputStreamWriter(outputStream, CommonConst.CHARSET_NAME_UTF_8));// 指定字符集编码
    }

    @Override
    public ServletOutputStream getOutputStream() throws IOException {
        return outputStream;
    }

    @Override
    public PrintWriter getWriter() throws IOException {
        return printWriter;
    }

    public byte[] getResponseBody() {
        return responseBody;
    }

    @Override
    public void flushBuffer() throws IOException {
        super.flushBuffer();
        printWriter.flush();
        outputStream.flush();
        cache.flush();
    }

    public void free() throws IOException {
        this.printWriter.flush();
        cache.flush();
        if (responseBody == null) {
            responseBody = cache.toByteArray();
        }
        this.printWriter.close();
    }
}
