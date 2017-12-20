package com.netease.mmc.demo.common.filter;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Collections;
import java.util.Map;
import java.util.Set;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.collections4.SetUtils;
import org.apache.commons.collections4.Transformer;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.util.Assert;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.netease.mmc.demo.common.constant.CommonConst;
import com.netease.mmc.demo.common.servlet.RequestCachingRequestWrapper;
import com.netease.mmc.demo.common.servlet.ResponseCachingResponseWrapper;
import com.netease.mmc.demo.common.util.MDCUtil;
import com.netease.mmc.demo.common.util.PatternUtil;

/**
 * MDCRequestLoggingFilter 参照org.springframework.web.filter.AbstractRequestLoggingFilter
 *
 * @author hzzhanghan
 * @date 2016/8/9
 * @since 1.0
 * @see org.springframework.web.filter.AbstractRequestLoggingFilter
 */
public class MDCRequestLoggingFilter extends OncePerRequestFilter {

    private static final int DEFAULT_MAX_PAYLOAD_LENGTH = 1000;

    private static final int DEFAULT_MAX_RESPONSE_BODY_LENGTH = 1000;

    private static final String DEFAULT_EXCLUDE_REGEX = "\\/.+\\.(jpg|jpeg|png|gif|js|css|swf|html|ico)";

    private static final Set<String> DEFAULT_INCLUDE_HEADERS = Sets.newHashSet("user-agent");
    /**
     * 主logger，所有信息都会在该logger中记录
     */
    private final Logger mainRequestLogger;
    /**
     * 根据URL匹配记录信息到各对应logger
     */
    private final Map<String, Logger> urlMatchRequestLoggerMap;
    private final boolean hasUrlMatchRequestLogger;
    private String excludeRegex = DEFAULT_EXCLUDE_REGEX;
    private boolean includePayload = true;
    private boolean includeCookies = false;
    private boolean includeJsonResponse = true;
    private boolean alwaysPrintRequestBody = false;
    private Set<String> includeHeaders = DEFAULT_INCLUDE_HEADERS;
    private int maxPayloadLength = DEFAULT_MAX_PAYLOAD_LENGTH;
    private int maxResponseBodyLength = DEFAULT_MAX_RESPONSE_BODY_LENGTH;
    private HandlerExceptionResolver handlerExceptionResolver;

    public MDCRequestLoggingFilter(String mainRequestLoggerName) {
        Assert.hasText(mainRequestLoggerName, "main request logger name must not blank");
        this.mainRequestLogger = LoggerFactory.getLogger(mainRequestLoggerName);
        this.hasUrlMatchRequestLogger = false;
        this.urlMatchRequestLoggerMap = Collections.emptyMap();
    }

    public MDCRequestLoggingFilter(String mainRequestLoggerName, Map<String, String> urlMatchRequestLoggerNameMap) {
        Assert.hasText(mainRequestLoggerName, "main request logger name must not blank");
        this.mainRequestLogger = LoggerFactory.getLogger(mainRequestLoggerName);
        if (MapUtils.isNotEmpty(urlMatchRequestLoggerNameMap)) {
            this.urlMatchRequestLoggerMap =
                    Collections.unmodifiableMap(Maps.transformEntries(urlMatchRequestLoggerNameMap,
                            new Maps.EntryTransformer<String, String, Logger>() {
                                @Override
                                public Logger transformEntry(String key, String value) {
                                    return LoggerFactory.getLogger(value);
                                }
                            }));
            this.hasUrlMatchRequestLogger = true;
        } else {
            this.hasUrlMatchRequestLogger = false;
            this.urlMatchRequestLoggerMap = Collections.emptyMap();
        }
    }

    public void setExcludeRegex(String excludeRegex) {
        this.excludeRegex = excludeRegex;
    }

    public void setIncludePayload(boolean includePayload) {
        this.includePayload = includePayload;
    }

    public void setIncludeCookies(boolean includeCookies) {
        this.includeCookies = includeCookies;
    }

    public void setIncludeJsonResponse(boolean includeJsonResponse) {
        this.includeJsonResponse = includeJsonResponse;
    }

    public void setMaxPayloadLength(int maxPayloadLength) {
        Assert.isTrue(maxPayloadLength >= 0, "'maxPayloadLength' should be larger than or equal to 0");
        this.maxPayloadLength = maxPayloadLength;
    }

    public void setMaxResponseBodyLength(int maxResponseBodyLength) {
        Assert.isTrue(maxPayloadLength >= 0, "'maxResponseBodyLength' should be larger than or equal to 0");
        this.maxResponseBodyLength = maxResponseBodyLength;
    }

    @SuppressWarnings("unchecked")
    public void setIncludeHeaders(Set<String> includeHeaders) {
        this.includeHeaders = SetUtils.transformedSet(includeHeaders, new Transformer() {
            @Override
            public String transform(Object input) {
                return StringUtils.lowerCase((String) input);
            }
        });
    }

    public void setHandlerExceptionResolver(HandlerExceptionResolver handlerExceptionResolver) {
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    public void setAlwaysPrintRequestBody(boolean alwaysPrintRequestBody) {
        this.alwaysPrintRequestBody = alwaysPrintRequestBody;
    }

    @Override
    protected boolean shouldNotFilterAsyncDispatch() {
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        HttpServletRequest wrapperRequest = request;
        HttpServletResponse wrapperResponse = response;
        boolean isFirstRequest = !isAsyncDispatch(wrapperRequest);
        boolean notExclude = !isExclude(wrapperRequest);
        try {
            if (isFirstRequest && notExclude) {
                if (includePayload) {
                    wrapperRequest = new RequestCachingRequestWrapper(request);
                }
                if (includeJsonResponse && isJsonRequest(wrapperRequest)) {
                    wrapperResponse = new ResponseCachingResponseWrapper(response);
                }
                beforeRequest(wrapperRequest, wrapperResponse);
            }
            filterChain.doFilter(wrapperRequest, wrapperResponse);
        } catch (Exception ex) {
            if (handlerExceptionResolver != null) {
                handlerExceptionResolver.resolveException(wrapperRequest, wrapperResponse, null, ex);
            } else {
                defaultExceptionHandler(wrapperRequest, wrapperResponse, ex);
            }
        } finally {
            if (!isAsyncStarted(wrapperRequest) && isFirstRequest && notExclude) {
                afterRequest(wrapperRequest, wrapperResponse);
            }
        }
    }

    private void generateBeforeMessage(HttpServletRequest request) {
        MDCUtil.logRequestBeginTime(request);
        MDCUtil.logRequestURL(request);
        MDCUtil.logRequestURI(request);
        MDCUtil.logRequestClientIP(request);
        MDCUtil.logRequestMethod(request);
        MDCUtil.logRequestId(request);
        MDCUtil.logRequestDemoId(request);
        MDCUtil.logRequestQueryString(request);
        MDCUtil.logRequestHeaders(request, includeHeaders);
        if (includeCookies) {
            MDCUtil.logRequestCookies(request);
        }
        if (includePayload && request instanceof RequestCachingRequestWrapper) {
            RequestCachingRequestWrapper wrapper = (RequestCachingRequestWrapper) request;
            MDCUtil.logRequestParameterMap(wrapper);
            if (alwaysPrintRequestBody || (request.getContentType() != null
                    && MediaType.APPLICATION_JSON.equals(MediaType.parseMediaType(request.getContentType())))) {
                byte[] requestBody = wrapper.getRequestBody();
                String requestPayLoad;
                if (requestBody != null && requestBody.length > 0) {
                    int length = Math.min(requestBody.length, maxPayloadLength);
                    try {
                        requestPayLoad = new String(requestBody, 0, length, CommonConst.CHARSET_NAME_UTF_8);
                    } catch (UnsupportedEncodingException e) {
                        mainRequestLogger.error("UnsupportedEncodingException:{}", CommonConst.CHARSET_NAME_UTF_8, e);
                        requestPayLoad = null;
                    }
                    MDCUtil.logRequestPayload(StringUtils.trimToEmpty(requestPayLoad));
                }
            }
        }
    }

    private void generateAfterMessage(HttpServletRequest request, HttpServletResponse response) {
        MDCUtil.logRequestEndTime(request);
        if (includeJsonResponse && response instanceof ResponseCachingResponseWrapper) {
            ResponseCachingResponseWrapper wrapper = (ResponseCachingResponseWrapper) response;
            String responseBody = null;
            try {
                wrapper.free();
                if (isJsonResponse(response)) {
                    byte[] buf = wrapper.getResponseBody();
                    if (buf.length > 0) {
                        int responseBodyLength = Math.min(buf.length, maxResponseBodyLength);
                        responseBody = new String(buf, 0, responseBodyLength, CommonConst.CHARSET_NAME_UTF_8);
                    }
                }
            } catch (IOException e) {
                mainRequestLogger.error("get response body error.", e);
                responseBody = "[unknown]";
            }
            MDCUtil.logResponseBody(StringUtils.trimToEmpty(responseBody));
        }
    }

    private void beforeRequest(HttpServletRequest request, HttpServletResponse response) {
        generateBeforeMessage(request);
    }

    private void afterRequest(HttpServletRequest request, HttpServletResponse response) {
        generateAfterMessage(request, response);
        String mdcContext = MDCUtil.getMDCContext();
        mainRequestLogger.info(mdcContext);
        if (hasUrlMatchRequestLogger) {
            Set<Map.Entry<String, Logger>> entrySet = urlMatchRequestLoggerMap.entrySet();
            for (Map.Entry<String, Logger> entry : entrySet) {
                if (PatternUtil.matchesWithCache(entry.getKey(), request.getRequestURI())) {
                    entry.getValue().info(mdcContext);
                    break;
                }
            }
        }
        MDCUtil.clear();
    }

    private boolean isExclude(HttpServletRequest request) {
        return StringUtils.isNotBlank(excludeRegex)
                && PatternUtil.matchesWithCache(excludeRegex, request.getRequestURI());
    }

    private boolean isJsonRequest(HttpServletRequest request) {
        String accept = StringUtils.trimToEmpty(request.getHeader("Accept"));
        if (StringUtils.isBlank(accept)) {
            accept = StringUtils.trimToEmpty(request.getHeader("accept"));
        }
        if (StringUtils.isBlank(accept)) {
            return true;
        }
        for (MediaType mediaType : MediaType.parseMediaTypes(accept)) {
            if (mediaType.includes(MediaType.APPLICATION_JSON)) {
                return true;
            }
        }
        return false;
    }

    private boolean isJsonResponse(HttpServletResponse response) {
        for (MediaType mediaType : MediaType.parseMediaTypes(response.getContentType())) {
            if (mediaType.includes(MediaType.APPLICATION_JSON)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 默认的异常处理方法
     *
     * @param request
     * @param response
     * @param ex
     * @throws IOException
     */
    private void defaultExceptionHandler(HttpServletRequest request, HttpServletResponse response, Exception ex)
            throws IOException {
        mainRequestLogger.error(" request url error {} :{}", request.getRequestURI(), ex.getMessage());
        Map<String, Object> model = Maps.newHashMap();
        model.put("errmsg", ex.getMessage());
        model.put("res", 400);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(CommonConst.CHARSET_NAME_UTF_8);
        response.getWriter().write(JSONObject.toJSONString(model));
        response.flushBuffer();
    }
}
