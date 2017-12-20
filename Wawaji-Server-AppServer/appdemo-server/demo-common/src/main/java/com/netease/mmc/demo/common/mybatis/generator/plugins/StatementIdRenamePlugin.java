package com.netease.mmc.demo.common.mybatis.generator.plugins;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;

/**
 * StatementIdRenamePlugin
 *
 * @author hzzhanghan
 * @date 2016/11/11
 * @since 1.0
 */
public class StatementIdRenamePlugin extends PluginAdapter {

    @Override
    public boolean validate(List<String> warnings) {
        return true;
    }

    @Override
    public void initialized(IntrospectedTable introspectedTable) {
        introspectedTable.setSelectByPrimaryKeyStatementId("findByPrimaryKey");
        introspectedTable.setSelectAllStatementId("listAll");
        introspectedTable.setSelectByExampleStatementId("listByExample");
        introspectedTable.setSelectByExampleWithBLOBsStatementId("listByExampleWithBlobs");
        String domainObjectName = introspectedTable.getFullyQualifiedTable().getDomainObjectName();
        String baseResultMapIdSuffix =
                StringUtils.lowerCase(domainObjectName.substring(0, 1)) + domainObjectName.substring(1);
        introspectedTable.setBaseResultMapId(baseResultMapIdSuffix + "Map");
        introspectedTable.setRecordWithBLOBsType(baseResultMapIdSuffix + "WithBlobsMap");
        introspectedTable.setBaseColumnListId(baseResultMapIdSuffix + "_Base_Column_List");
        introspectedTable.setBlobColumnListId(baseResultMapIdSuffix + "_Blob_Column_List");
        super.initialized(introspectedTable);
    }


}
