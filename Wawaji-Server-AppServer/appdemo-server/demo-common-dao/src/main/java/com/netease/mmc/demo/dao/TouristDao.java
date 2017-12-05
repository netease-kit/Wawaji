package com.netease.mmc.demo.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.netease.mmc.demo.dao.domain.TouristDO;

/**
 * TouristDao table demo_dolls_tourist's dao.
 *
 * @author hzwanglin1
 * @date 2017-11-21
 * @since 1.0
 */
public interface TouristDao {
    int insertSelective(TouristDO record);

    TouristDO findByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TouristDO record);

    /**
     * 根据accid查询用户信息
     *
     * @param accid
     * @return
     */
    TouristDO findByAccid(@Param("accid") String accid);

    /**
     * 根据偏移量获取一定数量可用的游客账号
     *
     * @param offset
     * @param limit
     * @return
     */
    List<TouristDO> listAvailableTouristByPage(@Param("availableAt") long availableAt, @Param("offset") int offset,
            @Param("limit") int limit);

    /**
     * 更新单条availableAt
     *
     * @param accid
     * @param availableAt
     * @return
     */
    int updateAvailableAtByAccid(@Param("accid") String accid, @Param("availableAt") long availableAt);

    /**
     * 批量更新availableAt
     *
     * @param availableAt
     * @param list
     * @return
     */
    int batchUpdateAvailableAt(@Param("availableAt") long availableAt, @Param("accids") List<String> list);
}