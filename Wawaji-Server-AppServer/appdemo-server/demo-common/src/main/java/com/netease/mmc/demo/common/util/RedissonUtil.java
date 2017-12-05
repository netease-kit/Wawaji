package com.netease.mmc.demo.common.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.redisson.Redisson;
import org.redisson.core.RAtomicLong;
import org.redisson.core.RBucket;
import org.redisson.core.RLock;
import org.redisson.core.RQueue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Preconditions;
import com.netease.mmc.demo.common.spring.ApplicationContextHolder;


/**
 * Redisson工具类.
 *
 * @author hzwanglin1
 * @date 2017/3/10
 * @since 6.3
 */
public class RedissonUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(RedissonUtil.class);

    private static final String KEY_CAN_NOT_BE_EMPTY = "key can not be empty";

    private static String redisNamespace = null;

    private static Redisson redisson;

    private RedissonUtil() {
        throw new UnsupportedOperationException("RedissonUtil.class can not be construct to a instance");
    }

    /**
     * Return key with redisNamespace
     *
     * @param key
     * @return
     */
    private static String getKeyWithNamespace(String key) {
        return StringUtils.isBlank(redisNamespace) ? key : (redisNamespace + "::" + key).replaceAll("\\s", "_");
    }

    private static Redisson getRedisson() {
        if (redisson == null) {
            redisson = ApplicationContextHolder.getBean(Redisson.class);
        }
        if (redisNamespace == null) {
            redisNamespace = ApplicationContextHolder.getBean("redisNamespace") instanceof String
                    ? (String) ApplicationContextHolder.getBean("redisNamespace") : null;
        }
        return redisson;
    }

    /**
     * 获取分布式锁（非公平锁）
     *
     * @param key
     * @return
     */
    public static RLock getLock(String key) {
        Redisson redisson = getRedisson();
        return redisson.getLock(getKeyWithNamespace(key));
    }

    /**
     * 设置key和value
     *
     * @param key
     * @param value
     */
    public static <V> void set(String key, V value) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RBucket<V> bucket = redisson.getBucket(getKeyWithNamespace(key));
        bucket.set(value);
    }

    /**
     * 设置key和value并指定失效时间
     *
     * @param key
     * @param value
     * @param seconds 失效的秒数
     */
    public static <V> void setex(String key, V value, long seconds) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RBucket<V> bucket = redisson.getBucket(getKeyWithNamespace(key));
        bucket.set(value, seconds, TimeUnit.SECONDS);
    }

    /**
     * get key.
     *
     * 对于频控key（incr等），get将返回integer值
     *
     * @param key
     */
    public static <V> V get(String key) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RBucket<V> bucket = redisson.getBucket(getKeyWithNamespace(key));
        return bucket.get();
    }

    /**
     * get atomicLong key.
     *
     * @param key
     */
    public static long getAtomicLong(String key) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RAtomicLong atomicLong = redisson.getAtomicLong(getKeyWithNamespace(key));
        return atomicLong.get();
    }

    /**
     * 删除key
     *
     * @param key
     */
    public static void del(String key) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RBucket<Object> bucket = redisson.getBucket(getKeyWithNamespace(key));
        bucket.delete();
    }

    /**
     * 判断key是否存在
     *
     * @param key
     */
    public static boolean exists(String key) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RBucket<Object> bucket = redisson.getBucket(getKeyWithNamespace(key));
        return bucket.exists();
    }

    /**
     * 按1递增.
     *
     * @param key
     */
    public static long incr(String key) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RAtomicLong atomicLong = redisson.getAtomicLong(getKeyWithNamespace(key));
        return atomicLong.incrementAndGet();
    }

    /**
     * 按step递增.
     *
     * @param key
     * @param step
     */
    public static long incrby(String key, int step) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RAtomicLong atomicLong = redisson.getAtomicLong(getKeyWithNamespace(key));
        return atomicLong.addAndGet(step);
    }

    /**
     * 按1递减.
     *
     * @param key
     */
    public static long decr(String key) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RAtomicLong atomicLong = redisson.getAtomicLong(getKeyWithNamespace(key));
        return atomicLong.decrementAndGet();
    }

    /**
     * 按step递减
     *
     * @param key
     * @param step
     */
    public static long decrby(String key, int step) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RAtomicLong atomicLong = redisson.getAtomicLong(getKeyWithNamespace(key));
        return atomicLong.addAndGet(-step);
    }

    /**
     * 先取值然后按1递增.
     *
     * <p><b>ATTENTION: 先get后赋值的所有操作都会清除key的ttl时间<b/></p>
     *
     * @param key
     */
    public static long getAndIncr(String key) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RAtomicLong atomicLong = redisson.getAtomicLong(getKeyWithNamespace(key));
        return atomicLong.getAndIncrement();
    }

    /**
     * 设置Key的过期时间.
     *
     * 如果key不存在，不会进行任何操作，并且返回false
     *
     * @param key
     * @return true:过期时间设置成功；false:过期时间设置失败
     */
    public static boolean expire(String key, long seconds) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RBucket bucket = redisson.getBucket(getKeyWithNamespace(key));
        return bucket.expire(seconds, TimeUnit.SECONDS);
    }

    /**
     * 如果key存在，返回true，如果key不存在，设置key过期时间，并返回false.
     *
     * 可用于重复请求拦截
     *
     * @param key
     * @param seconds
     * @return
     */
    public static boolean existsOrExpire(String key, long seconds) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RBucket<Object> bucket = redisson.getBucket(getKeyWithNamespace(key));
        if (bucket.exists()) {
            return true;
        } else {
            bucket.set(1, seconds, TimeUnit.SECONDS);
            return false;
        }
    }

    /**
     * 查询key过期时间
     *
     * @param key
     * @return -2:key不存在；-1:未设置过期时间；其他:key剩余时间
     */
    public static long ttl(String key) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RBucket bucket = redisson.getBucket(getKeyWithNamespace(key));
        return bucket.remainTimeToLive();
    }
    
    
    /**
     * 取队头
     *
     * @param key
     */
    public static <V> V lpop(String key) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RQueue<V> queue = redisson.getQueue(getKeyWithNamespace(key));
        return queue.poll();
    }
    
    /**
     * 队尾添加
     * @param key
     * @param list
     * @return
     */
    public static <V> boolean rpush(String key,ArrayList<V> list) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Preconditions.checkArgument(list != null && !list.isEmpty(), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RQueue<V> queue = redisson.getQueue(getKeyWithNamespace(key));
        return queue.addAll(list);
    }
    
    /**
     * 队列长度
     * @param key
     * @return
     */
    public static Integer llen(String key) {
        Preconditions.checkArgument(StringUtils.isNotEmpty(key), KEY_CAN_NOT_BE_EMPTY);
        Redisson redisson = getRedisson();
        RQueue queue = redisson.getQueue(getKeyWithNamespace(key));
        return queue.size();
    }
}
