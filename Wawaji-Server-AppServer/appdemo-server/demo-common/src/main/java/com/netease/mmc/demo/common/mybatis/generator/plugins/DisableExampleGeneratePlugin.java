package com.netease.mmc.demo.common.mybatis.generator.plugins;

import java.util.List;

import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;
import org.mybatis.generator.internal.rules.Rules;
import org.mybatis.generator.internal.rules.RulesDelegate;

/**
 * DisableExampleGeneratePlugin 加载禁止生成Example规则.
 *
 * @author hzzhanghan
 * @date 2016/10/28
 * @since 1.0
 */
public class DisableExampleGeneratePlugin extends PluginAdapter {

    @Override
    public boolean validate(List<String> warnings) {
        return true;
    }

    @Override
    public void initialized(IntrospectedTable introspectedTable) {
        super.initialized(introspectedTable);
        Rules rules = introspectedTable.getRules();
        introspectedTable.setRules(new DisableExampleGenerateRules(rules));
    }

    private final class DisableExampleGenerateRules extends RulesDelegate {

        public DisableExampleGenerateRules(Rules rules) {
            super(rules);
        }

        @Override
        public boolean generateCountByExample() {
            return false;
        }

        @Override
        public boolean generateDeleteByExample() {
            return false;
        }

        @Override
        public boolean generateExampleClass() {
            return false;
        }

        @Override
        public boolean generateSelectByExampleWithBLOBs() {
            return false;
        }

        @Override
        public boolean generateSelectByExampleWithoutBLOBs() {
            return false;
        }

        @Override
        public boolean generateSQLExampleWhereClause() {
            return false;
        }

        @Override
        public boolean generateMyBatis3UpdateByExampleWhereClause() {
            return false;
        }

        @Override
        public boolean generateUpdateByExampleSelective() {
            return false;
        }

        @Override
        public boolean generateUpdateByExampleWithBLOBs() {
            return false;
        }

        @Override
        public boolean generateUpdateByExampleWithoutBLOBs() {
            return false;
        }
    }
}
