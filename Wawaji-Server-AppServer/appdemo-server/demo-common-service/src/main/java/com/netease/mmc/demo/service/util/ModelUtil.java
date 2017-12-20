package com.netease.mmc.demo.service.util;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.netease.mmc.demo.dao.domain.TouristDO;
import com.netease.mmc.demo.dao.domain.UserDO;
import com.netease.mmc.demo.service.model.TouristModel;
import com.netease.mmc.demo.service.model.UserModel;


/**
 * Model转换工具类.
 *
 * @author hzwanglin1
 * @date 17-6-26
 * @since 1.0
 */
@Mapper
public interface ModelUtil {
    ModelUtil INSTANCE = Mappers.getMapper(ModelUtil.class);

    /**
     * 将UserDO转换为UserModel
     *
     * @param userDO
     * @return
     */
    UserModel userDO2Model(UserDO userDO);

    /**
     * 将TouristDO转换为TouristModel
     *
     * @param touristDO
     * @return
     */
    TouristModel touristDO2Model(TouristDO touristDO);
}
