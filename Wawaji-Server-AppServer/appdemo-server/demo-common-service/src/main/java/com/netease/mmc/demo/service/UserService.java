package com.netease.mmc.demo.service;

import java.util.Objects;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.netease.mmc.demo.common.enums.HttpCodeEnum;
import com.netease.mmc.demo.common.exception.UserException;
import com.netease.mmc.demo.dao.domain.UserDO;
import com.netease.mmc.demo.httpdao.nim.NIMServerApiHttpDao;
import com.netease.mmc.demo.httpdao.nim.dto.NIMUserDTO;
import com.netease.mmc.demo.httpdao.nim.dto.NIMUserResponseDTO;
import com.netease.mmc.demo.service.model.UserModel;
import com.netease.mmc.demo.service.util.ModelUtil;

/**
 * 用户账号Service实现类.
 *
 * @author hzwanglin1
 * @date 17-6-25
 * @since 1.0
 */
@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    @Resource
    private NIMServerApiHttpDao nimServerApiHttpDao;

    /**
     *
     * 新增用户
     *
     * @param accid
     * @param nickname
     * @param password
     * @return
     */
    public UserModel createUser(String accid, String nickname, String password) {
        UserDO userDO = new UserDO();
        // 注册云信账号
        NIMUserResponseDTO nimResDTO = nimServerApiHttpDao.createUser(accid, nickname, password);
        if (Objects.equals(nimResDTO.getCode(), HttpCodeEnum.OK.value())) {
            NIMUserDTO userDTO = nimResDTO.getInfo();
            userDO.setAccid(userDTO.getAccid());
            userDO.setNickname(userDTO.getName());
            userDO.setImToken(userDTO.getToken());
        } else {
            LOGGER.error("createUser.createIMUser failed accid[{}] for reason[{}]", accid, nimResDTO);
            throw new UserException(nimResDTO.getDesc());
        }

        userDO.setPassword(password);

        // 数据库新增user

        return ModelUtil.INSTANCE.userDO2Model(userDO);
    }
}
