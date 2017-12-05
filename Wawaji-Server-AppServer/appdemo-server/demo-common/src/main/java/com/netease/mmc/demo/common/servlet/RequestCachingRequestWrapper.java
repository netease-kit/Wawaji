package com.netease.mmc.demo.common.servlet;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Maps;
import com.netease.mmc.demo.common.constant.CommonConst;

/**
 * RequestCachingRequestWrapper
 *
 * @author hzzhanghan
 * @date 2017/4/6
 * @since 1.0
 */
public class RequestCachingRequestWrapper extends HttpServletRequestWrapper {

    private static final Logger logger = LoggerFactory.getLogger(RequestCachingRequestWrapper.class);

    private final byte[] requestBody;

    private Map<String, String[]> allParameterMap;

    private Map<String, String> requestHeader = new HashMap<>();

    public RequestCachingRequestWrapper(HttpServletRequest request) throws IOException {
        super(request);
        Enumeration<String> parameterNames = request.getParameterNames();
        Map<String, String[]> map = Maps.newHashMap();
        map.putAll(super.getParameterMap());
        while (parameterNames.hasMoreElements()) {
            String parameterName = parameterNames.nextElement();
            map.put(parameterName, new String[] {request.getParameter(parameterName)});
        }
        // 这个不可更改位置，必须在multipart解析操作之前，输入流只能读取一次
        this.requestBody = IOUtils.toByteArray(request.getInputStream());
        // 设置map不可更改
        this.allParameterMap = Collections.unmodifiableMap(map);
    }

    public void resetHeader(String name, String value) {
        requestHeader.put(name, value);
    }

    @Override
    public String getHeader(String name) {
        return StringUtils.defaultIfBlank(requestHeader.get(name), super.getHeader(name));
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        final ByteArrayInputStream bais = new ByteArrayInputStream(requestBody);
        return new ServletInputStream() {
            @Override
            public int read() throws IOException {
                return bais.read();
            }
        };
    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(getInputStream()));
    }

    @Override
    public Map<String, String[]> getParameterMap() {
        return this.allParameterMap;
    }

    public String getParameter(String name, boolean ifBlankLookupPayload) {
        String parameterValue = super.getParameter(name);
        if (StringUtils.isBlank(parameterValue) && ArrayUtils.isNotEmpty(requestBody) && ifBlankLookupPayload) {
            // 原request中获取不到parameter，则尝试从requestBody中获取
            try {
                JSONObject jsonObject = JSONObject.parseObject(new String(requestBody, CommonConst.CHARSET_NAME_UTF_8));
                parameterValue = jsonObject.getString(name);
            } catch (Exception e) {
                logger.warn("get parameter by name {} from payload fail", name, e);
            }
        }
        return parameterValue;
    }

    public byte[] getRequestBody() {
        return requestBody;
    }
}
