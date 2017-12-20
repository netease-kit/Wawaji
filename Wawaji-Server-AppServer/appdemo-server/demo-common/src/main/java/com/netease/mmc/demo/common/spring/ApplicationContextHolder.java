package com.netease.mmc.demo.common.spring;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class ApplicationContextHolder implements ApplicationContextAware {
	private static ApplicationContext applicationContext;

	public static ApplicationContext getContext() {
		return ApplicationContextHolder.applicationContext;
	}

	public static Object getBean(String beanName) {
		return ApplicationContextHolder.applicationContext.getBean(beanName);
	}

	public static <T> T getBean(Class<T> classT) {
		return ApplicationContextHolder.applicationContext.getBean(classT);
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		ApplicationContextHolder.applicationContext = applicationContext;
	}
}
