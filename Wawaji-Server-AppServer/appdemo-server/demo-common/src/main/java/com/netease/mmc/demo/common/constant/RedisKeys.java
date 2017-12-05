package com.netease.mmc.demo.common.constant;

/**
 * 声明redis key.
 *
 * @author hzwanglin1
 * @date 2017/6/28
 * @since 1.0
 */
public class RedisKeys {
    private RedisKeys() {
        throw new UnsupportedOperationException("RedisKeys.class can not be construct to a instance");
    }

    /**
     * 记录IP当天获取游客账户总次数 %s->ip
     */
    public static final String TOURIST_GET_IP_COUNT_TODAY = "TOURIST_GET_IP_COUNT_TODAY_%s";
    
    /**
     * 记录游客账户有效期 %s->accid
     */
    public static final String TOURIST_ACCOUNT_USED = "TOURIST_ACCOUNT_USED_%s";
    
    /**
     * 当前游客可用账户队列key值
     */
    public static final String QUEUE_TOURIST_KEY = "QUEUE_TOURIST_KEY";
    
    /**
     * 为游客队列增加的线程锁设置的竞争锁
     */
    public static final String QUEUE_ADD_TOURIST_LOCK = "QUEUE_ADD_TOURIST_LOCK";
}
