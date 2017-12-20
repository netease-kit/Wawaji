package com.netease.mmc.demo.service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Random;

import javax.annotation.CheckForNull;
import javax.annotation.Resource;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.netease.mmc.demo.common.constant.CommonConst;
import com.netease.mmc.demo.common.constant.RedisKeys;
import com.netease.mmc.demo.common.enums.HttpCodeEnum;
import com.netease.mmc.demo.common.exception.TouristException;
import com.netease.mmc.demo.common.util.RedissonUtil;
import com.netease.mmc.demo.common.util.TimeUtil;
import com.netease.mmc.demo.dao.SeqDao;
import com.netease.mmc.demo.dao.TouristDao;
import com.netease.mmc.demo.dao.domain.SeqDO;
import com.netease.mmc.demo.dao.domain.TouristDO;
import com.netease.mmc.demo.httpdao.nim.NIMServerApiHttpDao;
import com.netease.mmc.demo.httpdao.nim.dto.NIMUserDTO;
import com.netease.mmc.demo.httpdao.nim.dto.NIMUserResponseDTO;
import com.netease.mmc.demo.service.async.AsyncTouristService;
import com.netease.mmc.demo.service.model.TouristModel;
import com.netease.mmc.demo.service.util.ModelUtil;

/**
 * 游客账号Service.
 *
 * @author hzwanglin1
 * @date 2017-11-21
 * @since 1.0
 */
@Service
public class TouristService {
    private static final Logger logger = LoggerFactory.getLogger(TouristService.class);

    @Resource
    private TouristDao touristDao;

    @Resource
    private SeqDao seqDao;

    @Resource
    private AsyncTouristService asyncTouristService;

    @Resource
    private NIMServerApiHttpDao nimServerApiHttpDao;

    @Resource()
    @Qualifier(value = "whiteIpList")
    private List<String> whiteIpList;

    /**
     * 校验用户是否有效，如果有效，更新用户失效时间.
     *
     * @param accid 用户账号
     * @return
     */
    @CheckForNull
    public TouristModel validateAndRefreshUser(String accid) {
        if (StringUtils.isNotBlank(accid) && isNotExpired(accid)) {
            TouristDO touristDO = touristDao.findByAccid(accid);
            if (touristDO == null) {
                logger.error("tourist in session but actually not exists, accid:{}", accid);
            } else {
                refreshUser(accid);
                return ModelUtil.INSTANCE.touristDO2Model(touristDO);
            }
        }
        return null;
    }

    /**
     * 检查此IP获取游客账户数是否达到每日上限.
     *
     * @param ip
     * @return
     */
    public boolean isIpLimited(String ip) {
        boolean result;
        // IP白名单直接返回
        if (CollectionUtils.isNotEmpty(whiteIpList) && whiteIpList.contains(ip)) {
            return false;
        }
        long ipCount = RedissonUtil.getAtomicLong(String.format(RedisKeys.TOURIST_GET_IP_COUNT_TODAY, ip));
        result = ipCount >= CommonConst.TOURIST_GET_LIMIT_IP_PER_DAY;
        if (result) {
            logger.warn("tourist get ip limited today, ip[{}]", ip);
        }
        return result;
    }

    /**
     *
     * 增加对应IP获取游客账户总次数.
     *
     * @param ip
     */
    public void incrTouristGetCount(String ip) {
        String ipCountKey = String.format(RedisKeys.TOURIST_GET_IP_COUNT_TODAY, ip);
        if (RedissonUtil.incr(ipCountKey) == 1L) {
            RedissonUtil.expire(ipCountKey, TimeUtil.getLeftSecondsOfToday());
        }
    }

    /**
     *
     * 从当前账号池中获取游客账号.
     *
     * @return
     */
    @CheckForNull
    public TouristModel getFromTouristPool() {
        // 如果队列中的账号数量低于阈值，需要触发从数据库往队列中添加账号操作
        int queueNum = RedissonUtil.llen(RedisKeys.QUEUE_TOURIST_KEY);
        if (queueNum <= CommonConst.QUEUE_TOURIST_NUM_KEEP) {
            asyncTouristService.fillTouristQueue();
        }

        String accid = RedissonUtil.lpop(RedisKeys.QUEUE_TOURIST_KEY);
        if (StringUtils.isNotBlank(accid)) {
            logger.info("pop tourist from queue, accid:{}", accid);
            TouristDO touristDO = touristDao.findByAccid(accid);
            if (touristDO == null) {
                logger.error("tourist in session but actually not exists, accid:{}", accid);
                return null;
            } else {
                refreshUser(accid);
                return ModelUtil.INSTANCE.touristDO2Model(touristDO);
            }
        }
        return null;
    }

    /**
     *
     * 创建新的游客账号
     *
     * @return
     */
    public TouristModel createNewTourist() {
        TouristDO touristDO = new TouristDO();
        touristDO.setAccid(produceAccid());
        touristDO.setNickname(produceNickname());
        // 注册云信账号
        NIMUserResponseDTO nimResDTO =
                nimServerApiHttpDao.createUser(touristDO.getAccid(), touristDO.getNickname(), null);
        if (Objects.equals(nimResDTO.getCode(), HttpCodeEnum.OK.value())) {
            NIMUserDTO userDTO = nimResDTO.getInfo();
            touristDO.setAccid(userDTO.getAccid());
            touristDO.setNickname(userDTO.getName());
            touristDO.setImToken(userDTO.getToken());
        } else {
            logger.error("createNewTourist.createIMUser failed accid[{}] for reason[{}]", touristDO.getAccid(), nimResDTO);
            throw new TouristException(nimResDTO.getDesc());
        }

        // redis记录失效时间
        RedissonUtil.setex(String.format(RedisKeys.TOURIST_ACCOUNT_USED, touristDO.getAccid()), true,
                CommonConst.TOURIST_HOLD_EXPIRE_TIME);
        // 数据库新增tourist
        long availableAt = System.currentTimeMillis() + CommonConst.TOURIST_HOLD_EXPIRE_TIME * 1000;
        touristDO.setAvailableAt(availableAt);
        touristDO.setCreatedAt(new Date());
        touristDao.insertSelective(touristDO);

        return ModelUtil.INSTANCE.touristDO2Model(touristDO);
    }

    /**
     * 根据accid查询游客信息
     *
     * @param accid
     * @return
     */
    public TouristModel queryTourist(String accid) {
        TouristDO touristDO = touristDao.findByAccid(accid);
        return ModelUtil.INSTANCE.touristDO2Model(touristDO);
    }

    /**
     * 检查此账号登陆状态是否过期.
     *
     * @param accid 用户账号
     * @return
     */
    private boolean isNotExpired(String accid) {
        return RedissonUtil.exists(String.format(RedisKeys.TOURIST_ACCOUNT_USED, accid));
    }

    /**
     * 更新账号的登陆失效时间.
     *
     * @param accid 用户账号
     * @return
     */
    private void refreshUser(String accid) {
        // 先设置redis失效时间，再设置数据库失效时间，防止数据库比redis先失效，从而出现账号冲突
        RedissonUtil.setex(String.format(RedisKeys.TOURIST_ACCOUNT_USED, accid), true,
                CommonConst.TOURIST_HOLD_EXPIRE_TIME);

        long availableAt = System.currentTimeMillis() + CommonConst.TOURIST_HOLD_EXPIRE_TIME * 1000;
        touristDao.updateAvailableAtByAccid(accid, availableAt);
    }

    /**
     * 游客用户名生成规则
     *
     * @return
     */
    private String produceAccid() {
        // 递增序列号 + 2位随机数
        return CommonConst.TOURIST_USER_NAME_PREFIX + getSeqId() + (new Random().nextInt(90) + 10);
    }

    /**
     * 游客昵称生成规则
     *
     * @return
     */
    private String produceNickname() {
        return CommonConst.TOURIST_NICK_NAME_PREFIX + String.valueOf(100000 + new Random().nextInt(899999));
    }

    /**
     * 获取递增序列号
     *
     * @return
     */
    private long getSeqId() {
        SeqDO seqDO = new SeqDO();
        seqDao.insert(seqDO);
        return seqDO.getId();
    }
}
