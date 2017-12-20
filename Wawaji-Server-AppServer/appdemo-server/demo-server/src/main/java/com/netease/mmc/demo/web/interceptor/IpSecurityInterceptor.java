package com.netease.mmc.demo.web.interceptor;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.expression.AccessException;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.netease.mmc.demo.common.util.HttpUtil;

/**
 * ip 白名单拦截器
 */
public class IpSecurityInterceptor extends HandlerInterceptorAdapter {

	private static final Logger logger = LoggerFactory.getLogger(IpSecurityInterceptor.class);

	private List<String> allowIpList;
	private List<IPRange> rangeList;

	private boolean ipFilter = false;

	public class IPRange {
		private long beginIp = 0;
		private long endIp = 0;

		/**
		 * constructor <code>ipRange</code>
		 * 
		 * @param ipRange ip range eg: 192.168.1.*-192.168.2.*;192.168.1.*
		 */
		public IPRange(String ipRange) {
			try {
				if (StringUtils.isBlank(ipRange)) {
					return;
				}

				ipRange = StringUtils.trim(ipRange);

				String[] ips = StringUtils.split(ipRange, "-");
				beginIp = addresstoInt(StringUtils.replace(ips[0], "*", "0"));

				if (ips.length == 1) {
					endIp = addresstoInt(StringUtils.replace(ips[0], "*", "255"));
				} else {
					endIp = addresstoInt(StringUtils.replace(ips[1], "*", "255"));
				}
			} catch (Exception e) {
			}
		}

		private long addresstoInt(String ip) {
			byte[] bytes;
			try {
				bytes = InetAddress.getByName(ip).getAddress();
			} catch (UnknownHostException e) {
				e.printStackTrace();
				return 0;
			}
			long resp = ((bytes[0] << 24) & 0xff000000) | ((bytes[1] << 16) & 0x00ff0000) | ((bytes[2] << 8) & 0x0000ff00) | (bytes[3] & 0x000000ff);

			if (resp < 0) {
				resp += 0x100000000L;
			}

			return resp;
		}

		/**
		 * check ip range is valid
		 * 
		 * @return
		 */
		public boolean isValid() {
			if ((beginIp > 0) && (endIp > 0)) {
				return true;
			}

			return false;
		}

		/**
		 * check ip in range
		 * 
		 * @param ip
		 * @return
		 */
		public boolean isInRange(String ip) {
			boolean result = true;
			long intIp = addresstoInt(ip);

			if ((intIp > endIp) || (intIp < beginIp)) {
				result = false;
			}

			return result;
		}

	}

	/**
	 * 
	 * @param allowIpList 允许的IP列表
	 */
	public void setAllowIpList(List<String> allowIpList) {
		rangeList = new ArrayList<IPRange>();
		this.allowIpList = allowIpList;

		if (this.allowIpList != null) {
			IPRange range;

			for (String allowIp : allowIpList) {
				range = new IPRange(allowIp);

				if (range.isValid()) {
					rangeList.add(range);
				}
			}
		}
	}

	/**
	 * 根据客户端IP验证用户 (non-Javadoc)
	 * 
	 * @see org.springframework.web.servlet.handler.HandlerInterceptorAdapter#preHandle(javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse, java.lang.Object)
	 */
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		if (!ipFilter) {
			logger.debug("Request from ip not filtered ");
			return true;
		}
		String ip = HttpUtil.getIP(request);
		if (ip.startsWith("0:0:0:0:0:0:0")) {
			return true;
		}
		if (!validateIp(ip)) {
			logger.error("security check failed by IPSecurityInterceptor with ip: " + StringUtils.defaultString(ip) + request.getRequestURI());
			throw new AccessException("security check failed by IPSecurityInterceptor with ip: " + StringUtils.defaultString(ip));
		}
		return true;
	}

	/**
	 * 
	 * @param ip IP地址
	 * @return 验证结果
	 */
	private boolean validateIp(String ip) {
		if (StringUtils.isNotBlank(ip) && rangeList != null) {
			for (IPRange range : rangeList) {
				if (range.isInRange(ip)) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * 添加IP
	 */
	public String addIp(String ip) {
		if (!StringUtils.isNotBlank(ip) || !ip.contains("."))
			return "ip invalid";
		for (String _ip : allowIpList) {
			if (ip.equalsIgnoreCase(_ip)) {
				return ip + " exists;";
			}
		}
		allowIpList.add(ip);
		setAllowIpList(allowIpList);
		return ToStringBuilder.reflectionToString(allowIpList.size(), ToStringStyle.MULTI_LINE_STYLE);

	}

	/**
	 * 删除IP
	 */
	public String removeIp(String ip) {
		if (!StringUtils.isNotBlank(ip) || !ip.contains("."))
			return "ip invalid";
		allowIpList.remove(ip);
		setAllowIpList(allowIpList);
		return ToStringBuilder.reflectionToString(allowIpList.size(), ToStringStyle.MULTI_LINE_STYLE);

	}

	public boolean isIpFilter() {
		return ipFilter;
	}

	public void setIpFilter(boolean ipFilter) {
		this.ipFilter = ipFilter;
	}

	public List<String> getAllowIpList() {
		return allowIpList;
	}

}