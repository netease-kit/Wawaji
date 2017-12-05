package com.netease.mmc.demo.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.netease.mmc.demo.dao.domain.DollsLiveDO;

/**
 * DollsLiveDao table demo_dolls_live's dao.
 *
 * @author hzwanglin1
 * @date 2017-11-21
 * @since 1.0
 */
public interface DollsLiveDao {
    int insertSelective(DollsLiveDO record);

    DollsLiveDO findByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(DollsLiveDO record);

    DollsLiveDO findByCid(@Param("cid") String cid);

    List<DollsLiveDO> listByCids(@Param("cids") List<String> cids);
}