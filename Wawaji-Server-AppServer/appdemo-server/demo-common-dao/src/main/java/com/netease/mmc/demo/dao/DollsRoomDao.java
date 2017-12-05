package com.netease.mmc.demo.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.netease.mmc.demo.dao.domain.DollsRoomDO;

/**
 * DollsRoomDao table demo_dolls_room's dao.
 *
 * @author william
 * @date 2017-11-22
 * @since 1.0
 */
public interface DollsRoomDao {
    int insertSelective(DollsRoomDO record);

    DollsRoomDO findByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(DollsRoomDO record);

    List<DollsRoomDO> listPublicRoom(@Param("limit") Integer limit, @Param("offset") Integer offset);

    DollsRoomDO findByAccid(@Param("accid") String accid);

    DollsRoomDO findByRoomId(@Param("roomId") long roomId);

    int updateIsPublicByRoomId(@Param("roomId") long roomId, @Param("isPublic") boolean isPublic);
}