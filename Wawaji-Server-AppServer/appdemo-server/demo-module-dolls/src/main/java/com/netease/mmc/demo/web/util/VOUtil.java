package com.netease.mmc.demo.web.util;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.netease.mmc.demo.service.model.DollsRoomModel;
import com.netease.mmc.demo.service.model.TouristModel;
import com.netease.mmc.demo.web.vo.DollsRoomCatcherVO;
import com.netease.mmc.demo.web.vo.DollsRoomPlayerVO;
import com.netease.mmc.demo.web.vo.TouristVO;


/**
 * Model转换工具类.
 *
 * @author hzwanglin1
 * @date 17-6-26
 * @since 1.0
 */
@Mapper
public interface VOUtil {
    VOUtil INSTANCE = Mappers.getMapper(VOUtil.class);

    TouristVO touristModel2VO(TouristModel touristModel);

    DollsRoomPlayerVO roomModel2PlayerVO(DollsRoomModel roomModel);

    List<DollsRoomPlayerVO> roomModelList2PlayerVOList(List<DollsRoomModel> roomModelList);

    DollsRoomCatcherVO roomModel2CatcherVO(DollsRoomModel roomModel);
}
