package com.netease.mmc.demo.service.async;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import org.apache.commons.collections4.CollectionUtils;
import org.redisson.core.RLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;

import com.google.common.collect.Lists;
import com.netease.mmc.demo.common.constant.CommonConst;
import com.netease.mmc.demo.common.constant.RedisKeys;
import com.netease.mmc.demo.common.util.RedissonUtil;
import com.netease.mmc.demo.dao.TouristDao;
import com.netease.mmc.demo.dao.domain.TouristDO;

/**
 * 游客相关异步操作
 */
@Configuration  
@EnableAsync
public class AsyncTouristService {
    public static final Logger logger = LoggerFactory.getLogger(AsyncTouristService.class);

    @Resource
    private TouristDao touristDao;
    
    /**
     * 填充游客队列，通过抢占key控制只有一个线程执行填充操作
     */
    @Async
    public void fillTouristQueue(){
        RLock lock = RedissonUtil.getLock(RedisKeys.QUEUE_ADD_TOURIST_LOCK);
        try {
            // 使用分布式锁控制并发，当前场景可以使用 redis setnx 命令代替
            if (lock.tryLock(0, CommonConst.QUEUE_ADD_TOURIST_LOCK_EXPIRE, TimeUnit.SECONDS)) {
                List<TouristDO> list = touristDao
                        .listAvailableTouristByPage(System.currentTimeMillis(), 0, CommonConst.QUEUE_ADD_TOURIST_NUM);
                if (CollectionUtils.isNotEmpty(list)) {
                    ArrayList<String> accidList = Lists.newArrayListWithCapacity(list.size());
                    for (TouristDO aList : list) {
                        accidList.add(aList.getAccid());
                    }
                    // 将取出的账号的失效时间设置为无穷大，并放入游客队列，供后续使用
                    if (touristDao.batchUpdateAvailableAt(CommonConst.QUEUE_TOURIST_EXPIRE, accidList) > 0) {
                        RedissonUtil.rpush(RedisKeys.QUEUE_TOURIST_KEY, accidList);
                    }
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.warn("fillTouristQueue Interrupted when try lock", e);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}
