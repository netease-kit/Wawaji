package com.netease.mmc.demo.common.context;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.netease.mmc.demo.common.util.HttpUtil;

public class WebContextHolder {

	private static final String LOGINUSER = "_LOGINUSER";

	private static ThreadLocal<HttpServletRequest> requests = new ThreadLocal<>();

	private static ThreadLocal<HttpServletResponse> responses = new ThreadLocal<>();

	public static HttpServletRequest getRequest() {
		return requests.get();
	}

	public static void setRequest(HttpServletRequest request) {
		requests.set(request);
	}

	public static HttpServletResponse getResponse() {
		return responses.get();
	}

	public static void setResponse(HttpServletResponse response) {
		responses.set(response);
	}

	public static void setCurrentUser(Object user) {
		getRequest().setAttribute(LOGINUSER, user);
	}

	public static Object getCurrentUser() {
		return getRequest().getAttribute(LOGINUSER);
	}

	public static void removeCurrentUser() {
		getRequest().removeAttribute(LOGINUSER);
	}

	public static String getIp() {
		return HttpUtil.getClientIP(getRequest());
	}
}
