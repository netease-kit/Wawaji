package com.netease.mmc.demo.common.redisson.config;

import java.lang.reflect.Field;

import org.redisson.ClusterServersConfig;
import org.redisson.Config;
import org.redisson.MasterSlaveServersConfig;
import org.redisson.SentinelServersConfig;
import org.redisson.SingleServerConfig;
import org.redisson.codec.RedissonCodec;
import org.springframework.beans.factory.InitializingBean;

/**
 * Redisson Config for Spring Xml Configuration.
 * based on Redisson version 1.2.1
 * @see org.redisson.Config
 *
 * @author hzwanglin1
 * @date 2017/3/9
 * @since 1.0
 */
public class RedissonConfig implements InitializingBean {
    private ClusterServersConfig clusterServersConfig;

    private SingleServerConfig singleServerConfig;

    private SentinelServersConfig sentinelServersConfig;

    private MasterSlaveServersConfig masterSlaveServersConfig;

    private Config config;

    /**
     * Threads amount shared between all redis node clients
     */
    private int threads = 0; // 0 = current_processors_amount * 2

    /**
     * Redis key/value codec. JsonJacksonCodec used by default
     */
    private RedissonCodec codec;

    @Override
    public void afterPropertiesSet() throws Exception {
        config = new Config();
        config.setCodec(codec);
        config.setThreads(threads);

        if (singleServerConfig != null) {
            useSingleServer(singleServerConfig);
        } else if (clusterServersConfig != null) {
            useClusterServers(clusterServersConfig);
        } else if (sentinelServersConfig != null) {
            useSentinelServers(sentinelServersConfig);
        } else if (masterSlaveServersConfig != null) {
            useMasterSlaveServers(masterSlaveServersConfig);
        }
    }

    private void useSingleServer(SingleServerConfig targetConfig) throws NoSuchFieldException, IllegalAccessException {
        checkClusterServersConfig();
        checkMasterSlaveServersConfig();
        checkSentinelServersConfig();

        Class<Config> clazz = Config.class;
        Field singleServerConfig = clazz.getDeclaredField("singleServerConfig");
        singleServerConfig.setAccessible(true);
        singleServerConfig.set(config, targetConfig);
    }

    private void useClusterServers(ClusterServersConfig targetConfig) throws NoSuchFieldException, IllegalAccessException {
        checkMasterSlaveServersConfig();
        checkSentinelServersConfig();
        checkSingleServerConfig();
        Class<Config> clazz = Config.class;
        Field clusterServersConfig = clazz.getDeclaredField("clusterServersConfig");
        clusterServersConfig.setAccessible(true);
        clusterServersConfig.set(config, targetConfig);
    }

    private void useSentinelServers(SentinelServersConfig targetConfig)
            throws NoSuchFieldException, IllegalAccessException {
        checkClusterServersConfig();
        checkSingleServerConfig();
        checkMasterSlaveServersConfig();

        Class<Config> clazz = Config.class;
        Field sentinelServersConfig = clazz.getDeclaredField("sentinelServersConfig");
        sentinelServersConfig.setAccessible(true);
        sentinelServersConfig.set(config, targetConfig);
    }

    private void useMasterSlaveServers(MasterSlaveServersConfig targetConfig)
            throws NoSuchFieldException, IllegalAccessException {
        checkClusterServersConfig();
        checkSingleServerConfig();
        checkSentinelServersConfig();

        Class<Config> clazz = Config.class;
        Field masterSlaveServersConfig = clazz.getDeclaredField("masterSlaveServersConfig");
        masterSlaveServersConfig.setAccessible(true);
        masterSlaveServersConfig.set(config, targetConfig);
    }

    private void checkClusterServersConfig() {
        if (clusterServersConfig != null) {
            throw new IllegalStateException("cluster servers config already used!");
        }
    }

    private void checkSentinelServersConfig() {
        if (sentinelServersConfig != null) {
            throw new IllegalStateException("sentinel servers config already used!");
        }
    }

    private void checkMasterSlaveServersConfig() {
        if (masterSlaveServersConfig != null) {
            throw new IllegalStateException("master/slave servers already used!");
        }
    }

    private void checkSingleServerConfig() {
        if (singleServerConfig != null) {
            throw new IllegalStateException("single server config already used!");
        }
    }

    public Config getConfig() {
        return config;
    }

    public ClusterServersConfig getClusterServersConfig() {
        return clusterServersConfig;
    }

    public void setClusterServersConfig(ClusterServersConfig clusterServersConfig) {
        this.clusterServersConfig = clusterServersConfig;
    }

    public SingleServerConfig getSingleServerConfig() {
        return singleServerConfig;
    }

    public void setSingleServerConfig(SingleServerConfig singleServerConfig) {
        this.singleServerConfig = singleServerConfig;
    }

    public SentinelServersConfig getSentinelServersConfig() {
        return sentinelServersConfig;
    }

    public void setSentinelServersConfig(SentinelServersConfig sentinelServersConfig) {
        this.sentinelServersConfig = sentinelServersConfig;
    }

    public MasterSlaveServersConfig getMasterSlaveServersConfig() {
        return masterSlaveServersConfig;
    }

    public void setMasterSlaveServersConfig(MasterSlaveServersConfig masterSlaveServersConfig) {
        this.masterSlaveServersConfig = masterSlaveServersConfig;
    }

    public int getThreads() {
        return threads;
    }

    public void setThreads(int threads) {
        this.threads = threads;
    }

    public RedissonCodec getCodec() {
        return codec;
    }

    public void setCodec(RedissonCodec codec) {
        this.codec = codec;
    }
}
