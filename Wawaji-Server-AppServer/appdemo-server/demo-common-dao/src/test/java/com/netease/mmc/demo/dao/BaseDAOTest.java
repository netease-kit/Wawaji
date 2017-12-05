package com.netease.mmc.demo.dao;

import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

/**
 * BaseServiceTest spring test + junit DAO测试基础类，其余TestCase只需继承该类即可
 *
 * @author hzzhanghan
 * @date 2016-07-29 19:06
 */
@RunWith(SpringJUnit4ClassRunner.class)
/**
 * 加载spring配置
 */
@ContextConfiguration({"classpath:applicationContext-dao-test.xml"})
/**
 * 没有该注解则事务控制无法生效
 */
@Transactional
@Ignore
public class BaseDAOTest {

}
