package com.netease.mmc.demo.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.netease.mmc.demo.common.context.WebContextHolder;

/**
 * WebContextHolder拦截器.
 *
 * @author hzwanglin1
 * @date 17-7-10
 * @since 1.0
 */
public class WebContextHolderInterceptor extends HandlerInterceptorAdapter {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        WebContextHolder.setRequest(request);
        WebContextHolder.setResponse(response);
        return true;
    }
}
