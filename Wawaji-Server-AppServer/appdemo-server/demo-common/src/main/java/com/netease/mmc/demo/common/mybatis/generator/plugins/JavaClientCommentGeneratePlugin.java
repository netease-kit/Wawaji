package com.netease.mmc.demo.common.mybatis.generator.plugins;

import java.util.List;

import org.joda.time.DateTime;
import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;
import org.mybatis.generator.api.dom.java.Interface;
import org.mybatis.generator.api.dom.java.TopLevelClass;

import com.netease.mmc.demo.common.constant.CommonConst;

/**
 * JavaClientCommentGeneratePlugin
 *
 * @author hzzhanghan
 * @date 2016-10-19 11:30
 * @since 1.0
 */
public class JavaClientCommentGeneratePlugin extends PluginAdapter {

    @Override
    public boolean validate(List<String> warnings) {
        return true;
    }

    @Override
    public boolean clientGenerated(Interface interfaze, TopLevelClass topLevelClass,
            IntrospectedTable introspectedTable) {
        interfaze.addJavaDocLine("/**");
        interfaze.addJavaDocLine(" * " + interfaze.getType().getShortName() + " table "
                + introspectedTable.getTableConfiguration().getTableName() + "'s dao.");
        interfaze.addJavaDocLine(" *");
        interfaze.addJavaDocLine(" * @author " + System.getProperty("user.name"));
        interfaze.addJavaDocLine(" * @date " + DateTime.now().toString(CommonConst.DATE_FORMAT_PATTERN_yyyy_MM_dd));
        interfaze.addJavaDocLine(" * @since 1.0");
        interfaze.addJavaDocLine(" */");
        return super.clientGenerated(interfaze, topLevelClass, introspectedTable);
    }
}
