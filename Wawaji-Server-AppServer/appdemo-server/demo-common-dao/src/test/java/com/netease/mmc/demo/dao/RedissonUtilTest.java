package com.netease.mmc.demo.dao;

import org.junit.Test;

import com.netease.mmc.demo.common.constant.RedisKeys;
import com.netease.mmc.demo.common.util.RedissonUtil;

/**
 * Redisson测试类.
 *
 * @author hzwanglin1
 * @date 2017/6/28
 * @since 1.0
 */
public class RedissonUtilTest extends BaseDAOTest{

    @Test
    public void setTest() throws Exception {
        String key = "testKey";
        System.out.println(RedissonUtil.get(key));
        System.out.println(RedissonUtil.incrby(key,6));
        RedissonUtil.set(key, 10);
        System.out.println(RedissonUtil.get(key));
        System.out.println(RedissonUtil.exists(key));
        RedissonUtil.del(key);
        System.out.println(RedissonUtil.exists(key));
        System.out.println(RedissonUtil.decrby(key,3));
        System.out.println(RedissonUtil.exists(key));
        RedissonUtil.del(key);
        System.out.println(RedissonUtil.llen(RedisKeys.QUEUE_TOURIST_KEY));
    }
}
