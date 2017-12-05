package com.netease.mmc.demo.common.mybatis.generator.plugins;

import java.util.List;

import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;
import org.mybatis.generator.internal.rules.Rules;
import org.mybatis.generator.internal.rules.RulesDelegate;

/**
 * GenerateRulesOverwritePlugin
 *
 * @author zhanghan
 * @date 2017/9/12
 * @since 1.0
 */
public class GenerateRulesOverwritePlugin extends PluginAdapter {

    @Override
    public boolean validate(List<String> warnings) {
        return true;
    }

    @Override
    public void initialized(IntrospectedTable introspectedTable) {
        super.initialized(introspectedTable);
        Rules rules = introspectedTable.getRules();
        introspectedTable.setRules(new GenerateRulesOverwritePlugin.GenerateRules(rules));
    }

    /**
     * 生成规则，禁止所有Example，禁止生成Delete方法，禁止生成Insert，禁止生成UpdateByPrimaryKey方法
     */
    private final class GenerateRules extends RulesDelegate {

        public GenerateRules(Rules rules) {
            super(rules);
        }

        @Override
        public boolean generateInsert() {
            return false;
        }

        @Override
        public boolean generateInsertSelective() {
            return super.generateInsert();
        }

        @Override
        public boolean generateDeleteByPrimaryKey() {
            return false;
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

        @Override
        public boolean generateUpdateByPrimaryKeyWithoutBLOBs() {
            return false;
        }

        @Override
        public boolean generateUpdateByPrimaryKeyWithBLOBs() {
            return false;
        }
    }
}
