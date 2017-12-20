package com.netease.mmc.demo.common.redisson.factory;

import org.redisson.Redisson;
import org.springframework.beans.factory.config.AbstractFactoryBean;

import com.netease.mmc.demo.common.redisson.config.RedissonConfig;

/**
 * 用于生成RedissonClient实例.
 * 默认为单例模式
 *
 * @author hzwanglin1
 * @date 2017/3/9
 * @since 1.0
 */
public class RedissonFactoryBean extends AbstractFactoryBean<Redisson> {
    /**
     * Redisson配置文件，可通过Spring xml注入
     */
    private RedissonConfig redissonConfig;

    /**
     * 创建RedissonClient实例.
     * 单例模式下只会调用一次，非单例模式下每次创建实例时都会调用该方法
     *
     * @return
     * @throws Exception
     */
    @Override
    protected Redisson createInstance() throws Exception {
        return Redisson.create(redissonConfig.getConfig());
    }

    /**
     * 单例模式释放对象
     *
     * @param instance
     * @throws Exception
     */
    @Override
    protected void destroyInstance(Redisson instance) throws Exception {
        if (instance != null) {
            instance.shutdown();
        }
    }

    @Override
    public Class<?> getObjectType() {
        return Redisson.class;
    }

    public RedissonConfig getRedissonConfig() {
        return redissonConfig;
    }

    public void setRedissonConfig(RedissonConfig redissonConfig) {
        this.redissonConfig = redissonConfig;
    }
}
