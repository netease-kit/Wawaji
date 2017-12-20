package com.netease.mmc.demo.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.netease.mmc.demo.common.enums.HttpCodeEnum;
import com.netease.mmc.demo.common.util.DataPack;
import com.netease.mmc.demo.common.util.HttpUtil;
import com.netease.mmc.demo.common.util.RedissonUtil;

public class DDOSInterceptor extends HandlerInterceptorAdapter {
    private static final Logger LOGGER = LoggerFactory.getLogger(DDOSInterceptor.class);

    private static final String IP_DDOS_COUNT_KEY = "IP_DDOS_COUNT_%s";

    /**
     * 是否关闭DDOS拦截
     */
    private boolean close = false;

    /**
     * DDoS拦截最大请求数
     */
    private long maxRequest  = 2000;

    /**
     * 失效时间（秒）
     */
    private int ttlSeconds = 10;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        if (close) {
            return true;
        } else {
            String ip = HttpUtil.getClientIP(request);
            if (!accessCheck(ip)) {
                response.setContentType(MediaType.APPLICATION_JSON.toString());
                response.getWriter().print(DataPack.failResponseByJson(HttpCodeEnum.REQUEST_FREQ_CTRL.value(),
                        HttpCodeEnum.REQUEST_FREQ_CTRL.getReasonPhrase()));
                LOGGER.warn("request reach ddos limit, ip : [{}]", ip);
                return false;
            }
            return true;
        }
    }

    public void setClose(boolean close) {
        this.close = close;
    }

    public void setMaxRequest(int maxRequest) {
        this.maxRequest = maxRequest;
    }

    public void setTtlSeconds(int ttlSeconds) {
        this.ttlSeconds = ttlSeconds;
    }

    /**
     * 检查IP访问次数
     *
     * @param ip
     * @return
     */
    private boolean accessCheck(String ip) {
        String ipDDOSCountKey = String.format(IP_DDOS_COUNT_KEY, ip);
        long ipCount = RedissonUtil.incr(ipDDOSCountKey);
        if (ipCount == 1L) {
            RedissonUtil.expire(ipDDOSCountKey, ttlSeconds);
        } else if (ipCount > maxRequest) {
            return false;
        }
        return true;
    }
}