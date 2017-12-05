package com.netease.mmc.demo.common.util;

import org.joda.time.DateTime;
import org.joda.time.Duration;

/**
 * 时间日期处理相关工具类.
 *
 * @author hzwanglin1
 * @date  2017/6/28
 * @since 1.0
 */
public class TimeUtil {
    private TimeUtil() {
        throw new UnsupportedOperationException("TimeUtil.class can not be construct to a instance");
    }

    /**
     * 获取当天剩余秒数.
     *
     * @return
     */
    public static long getLeftSecondsOfToday() {
        DateTime now = new DateTime();
        DateTime lastTime = now.withTime(23, 59, 59, 999);
        Duration duration = new Duration(now, lastTime);
        return duration.getStandardSeconds();
    }
}
