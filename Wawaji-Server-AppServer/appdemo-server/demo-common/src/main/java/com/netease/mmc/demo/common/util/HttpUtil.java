package com.netease.mmc.demo.common.util;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

import javax.annotation.CheckForNull;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;

/**
 * HttpUtils
 *
 * @author hzzhanghan
 * @date 2016-08-22 20:51
 * @since 1.0
 */
public class HttpUtil {
    private static final Logger logger = LoggerFactory.getLogger(HttpUtil.class);

    // http请求头中保存实际请求协议
    private static final String HTTP_HEADER_FORWARDED_PROTO = "X-Forwarded-Proto";

    private static final String HTTP_PROTOCOL_PATTERN = "^(http|https)(:|://)?$";
    
    private static final String HTTP_PROTOCOL = "http://";
    
    private static final String HTTP_PROTOCOL_COLON = ":";
    
    private static final String HTTP_PROTOCOL_DOUBLE_SLASH= "//";
    
    private static final String HTTP_PROTOCOL_POSTFIX = HTTP_PROTOCOL_COLON + HTTP_PROTOCOL_DOUBLE_SLASH;

    private static final String UNKNOWN = "unknown";

    private static final String LOCALHOST_IP = "127.0.0.1";

    private HttpUtil() {
        throw new UnsupportedOperationException("HttpUtil.class can not be construct to a instance");
    }

    public static boolean isAcceptJsonResponse(HttpServletRequest request) {
        String accept = request.getHeader("Accept");
        if (accept == null) {
            return false;
        }
        for (MediaType mediaType : MediaType.parseMediaTypes(accept)) {
            if (mediaType.includes(MediaType.APPLICATION_JSON)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isJsonResponse(HttpServletResponse response) {
        for (MediaType mediaType : MediaType.parseMediaTypes(response.getContentType())) {
            if (mediaType.includes(MediaType.APPLICATION_JSON)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isAjaxRequest(HttpServletRequest request) {
        return StringUtils.equalsIgnoreCase("XMLHttpRequest", request.getHeader("X-Requested-With"));
    }

    /**
     * 使用全路径进行跳转
     * 
     * @param request
     * @param response
     * @param path
     * @throws IOException
     */
    public static void sendRedirectWithRealPath(HttpServletRequest request, HttpServletResponse response, String path)
            throws IOException {
        String realPath = queryRealPath(request, path);
        response.sendRedirect(realPath);
    }

    /**
     * 获取RequestAttribute
     *
     * @param request
     * @param attrName
     * @param castClass
     * @param <T>
     * @return
     */
    @Nullable
    @CheckForNull
    @SuppressWarnings("unchecked")
    public static <T> T getHttpRequestAttribute(@Nonnull HttpServletRequest request, @Nonnull String attrName,
            @Nonnull Class<T> castClass) {
        Object attrValue = request.getAttribute(attrName);
        return attrValue != null && castClass.isInstance(attrValue) ? (T) attrValue : null;
    }

    /**
     * 获取全路径，（当前路径）
     * 
     * @param request
     * @param path
     * @return
     */
    private static String queryRealPath(HttpServletRequest request, String path) {
        StringBuilder realPath = new StringBuilder();
        realPath.append(request.getRequestURL());
        realPath.delete((realPath.length() - request.getRequestURI().length()), realPath.length());
        if (!path.startsWith("/")) {
            realPath.append("/");
        }
        realPath.append(path);
        String protocol = queryRealHttpProtocol(request);
        if (!StringUtils.equals(protocol, realPath.substring(0, protocol.length()))) {
            int index = realPath.indexOf(HTTP_PROTOCOL_POSTFIX) + HTTP_PROTOCOL_POSTFIX.length();
            return realPath.replace(0, index, protocol).toString();
        }
        return realPath.toString();
    }

    /**
     * 获取实际请求协议
     * 
     * @param request
     * @return
     */
    private static String queryRealHttpProtocol(HttpServletRequest request) {
        String params = StringUtils.defaultIfBlank(request.getHeader(HTTP_HEADER_FORWARDED_PROTO), HTTP_PROTOCOL);
        if (!params.matches(HTTP_PROTOCOL_PATTERN)) {
            return HTTP_PROTOCOL;
        }
        if (params.endsWith(HTTP_PROTOCOL_POSTFIX)) {
            return params;
        }
        if (params.endsWith(HTTP_PROTOCOL_COLON)) {
            return params + HTTP_PROTOCOL_DOUBLE_SLASH;
        }
        return params + HTTP_PROTOCOL_POSTFIX;
    }

    /**
     * 获取请求ip地址
     *
     * @param request
     * @return
     */
    public static String getIP(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
        if (ip != null && ip.length() > 15 && ip.contains(",")) {
            ip = ip.substring(0, ip.indexOf(','));
        }
        return ip;
    }

    /**
     * 获得客户端IP地址.
     *
     * <b>返回结果将本机ip 127.0.0.1 转换成实际局域网ip</b>
     *
     * @param request
     * @return
     */
    public static String getClientIP(HttpServletRequest request) {
        String ip = getIP(request);

        if (LOCALHOST_IP.equals(ip)) {
            // 根据网卡取本机配置的IP
            try {
                InetAddress inetAddress = InetAddress.getLocalHost();
                ip = inetAddress.getHostAddress();
            } catch (UnknownHostException e) {
                logger.error("get local host error", e);
                return ip;
            }
        }

        return ip;
    }
}
