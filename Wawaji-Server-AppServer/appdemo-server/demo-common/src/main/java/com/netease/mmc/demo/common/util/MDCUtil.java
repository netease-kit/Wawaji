package com.netease.mmc.demo.common.util;

import java.util.Enumeration;
import java.util.Set;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.slf4j.MDC;
import org.springframework.http.HttpHeaders;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.netease.mmc.demo.common.constant.CommonConst;

/**
 * MDCUtil SLF4J MDC util
 *
 * @author zhanghan
 * @date 2017/5/31
 * @since 1.0
 */
public class MDCUtil {

    private static final String REQUEST_ID = "req_id";

    private static final String REQUEST_USER = "req_user";

    private static final String REQUEST_DEMO_ID = "demo_id";

    private static final String REQUEST_URL = "req_url";

    private static final String REQUEST_URI = "req_uri";

    private static final String REQUEST_URI_WITH_QUERY_STRING = "req_uri_with_query_string";

    private static final String REMOTE_HOST = "remote_host";

    private static final String REQUEST_HEADERS = "req_headers";

    private static final String REQUEST_COOKIES = "req_cookies";

    private static final String REQUEST_BEGIN_TIME = "req_begin_time";

    private static final String REQUEST_END_TIME = "req_end_time";

    private static final String REQUEST_PROCESS_TIME = "req_process_time";

    private static final String RESPONSE_BODY = "rep_body";

    private static final String REQUEST_PARAMETER_MAP = "req_parameter_map";

    private static final String REQUEST_PAYLOAD = "req_payload";

    private static final String REQUEST_METHOD = "req_method";

    private MDCUtil() {
        throw new UnsupportedOperationException("MDCUtil.class can not be construct to a instance");
    }

    public static void logRequestId(HttpServletRequest request) {
        if (getRequestId() != null) {
            return;
        }
        put(REQUEST_ID, request.getHeader(REQUEST_ID) == null ? UUIDUtil.getUUID() : request.getHeader(REQUEST_ID));
    }

    public static String getRequestId() {
        return MDC.get(REQUEST_ID);
    }

    public static void logRequestUser(String requestUser) {
        put(REQUEST_USER, requestUser);
    }

    public static void logRequestDemoId(HttpServletRequest request) {
        put(REQUEST_DEMO_ID, request.getHeader(CommonConst.DEMO_ID_HEADER));
    }

    public static void logRequestURL(HttpServletRequest request) {
        put(REQUEST_URL, request.getRequestURL());
    }

    public static void logRequestURI(HttpServletRequest request) {
        put(REQUEST_URI, request.getRequestURI());
    }

    public static void logRequestBeginTime(HttpServletRequest request) {
        DateTime requestBeginTime = DateTime.now();
        request.setAttribute(REQUEST_BEGIN_TIME, requestBeginTime);
        put(REQUEST_BEGIN_TIME, requestBeginTime.toString(CommonConst.DATE_FORMAT_PATTERN_yyyy_MM_dd_HH_mm_ss));
    }

    public static void logRequestEndTime(HttpServletRequest request) {
        DateTime requestEndTime = DateTime.now();
        put(REQUEST_END_TIME, requestEndTime.toString(CommonConst.DATE_FORMAT_PATTERN_yyyy_MM_dd_HH_mm_ss));
        DateTime requestBeginTime = (DateTime) request.getAttribute(REQUEST_BEGIN_TIME);
        put(REQUEST_PROCESS_TIME, requestEndTime.getMillis() - requestBeginTime.getMillis());
    }

    public static void logRequestMethod(HttpServletRequest request) {
        put(REQUEST_METHOD, request.getMethod());
    }

    public static void logRequestClientIP(HttpServletRequest request) {
        put(REMOTE_HOST, HttpUtil.getClientIP(request));
    }

    public static void logRequestQueryString(HttpServletRequest request) {
        String queryString = StringUtils.isBlank(request.getQueryString()) ? "" : ("?" + request.getQueryString());
        put(REQUEST_URI_WITH_QUERY_STRING, request.getRequestURI() + queryString);
    }

    public static void logRequestHeaders(HttpServletRequest request, Set<String> includeHeaders) {
        if (CollectionUtils.isEmpty(includeHeaders)) {
            return;
        }
        Enumeration<String> headerNames = request.getHeaderNames();
        JSONObject headers = new JSONObject();
        String headerName;
        while (headerNames.hasMoreElements()) {
            headerName = headerNames.nextElement();
            if (includeHeaders.contains(StringUtils.lowerCase(headerName))) {
                headers.put(headerName, request.getHeader(headerName));
            }
        }
        if (!headers.isEmpty()) {
            put(REQUEST_HEADERS, headers.toJSONString());
        }
    }

    public static void logRequestParameterMap(HttpServletRequest request) {
        if (MapUtils.isEmpty(request.getParameterMap())) {
            return;
        }
        put(REQUEST_PARAMETER_MAP, JSON.toJSONString(request.getParameterMap()));
    }

    public static void logRequestCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        put(REQUEST_COOKIES, ArrayUtils.isEmpty(cookies) ? "[]" : JSONArray.toJSONString(cookies));
    }

    public static void logRequestPayload(String requestPayload) {
        put(REQUEST_PAYLOAD, requestPayload);
    }

    public static void logResponseBody(String responseBody) {
        put(RESPONSE_BODY, responseBody);
    }

    public static void put(String key, Object value) {
        if (StringUtils.isBlank(key) || value == null) {
            return;
        }
        MDC.put(key, String.valueOf(value));
    }

    public static void clear() {
        MDC.clear();
    }

    public static String getMDCContext() {
        return JSON.toJSONString(MDC.getCopyOfContextMap());
    }

    /**
     * 发起Http请求时填充MDC已有的requestId到Header
     *
     * @param headers
     */
    public static void fillRequestIdHeader(HttpHeaders headers) {
        String mdcRequestId = getRequestId();
        if (mdcRequestId != null) {
            headers.set(REQUEST_ID, mdcRequestId);
        }
    }
}
