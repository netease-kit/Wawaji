package com.netease.mmc.demo.dao;

import org.springframework.stereotype.Component;

import com.netease.mmc.demo.dao.domain.SeqDO;

/**
 * SeqDao table demo_seq's dao.
 *
 * @author hzwanglin1
 * @date 2017-06-26
 * @since 1.0
 */
@Component
public interface SeqDao {
    int deleteByPrimaryKey(Long id);

    int insert(SeqDO record);

    int insertSelective(SeqDO record);
}
