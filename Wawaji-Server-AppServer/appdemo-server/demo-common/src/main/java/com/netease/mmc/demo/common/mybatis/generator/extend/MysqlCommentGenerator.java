package com.netease.mmc.demo.common.mybatis.generator.extend;

import org.mybatis.generator.api.IntrospectedColumn;
import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.dom.java.Field;
import org.mybatis.generator.api.dom.java.InnerClass;
import org.mybatis.generator.api.dom.java.InnerEnum;
import org.mybatis.generator.api.dom.java.JavaElement;
import org.mybatis.generator.api.dom.java.Method;
import org.mybatis.generator.api.dom.java.TopLevelClass;
import org.mybatis.generator.api.dom.xml.XmlElement;
import org.mybatis.generator.internal.DefaultCommentGenerator;
import org.mybatis.generator.internal.util.StringUtility;

/**
 * MysqlCommentGenerator
 *
 * @author hzzhanghan
 * @date 2016-09-20 18:14
 * @since 1.0
 */
public class MysqlCommentGenerator extends DefaultCommentGenerator {

    private boolean suppressAllComments = false;

    @Override
    public void addComment(XmlElement xmlElement) {
    }

    @Override
    public void addClassComment(InnerClass innerClass, IntrospectedTable introspectedTable) {
    }

    @Override
    public void addModelClassComment(TopLevelClass topLevelClass, IntrospectedTable introspectedTable) {
        if (!this.suppressAllComments) {
            topLevelClass.addJavaDocLine("/**");
            topLevelClass.addJavaDocLine(" * This class corresponds to the database table " + introspectedTable.getFullyQualifiedTable());
            String remarks = introspectedTable.getRemarks();
            if (StringUtility.stringHasValue(remarks)) {
                topLevelClass.addJavaDocLine(" * Database Table Remarks : ");
                String[] remarkLines = remarks.split(System.getProperty("line.separator"));

                for (String remarkLine : remarkLines) {
                    topLevelClass.addJavaDocLine(" *   " + remarkLine);
                }
            }
            topLevelClass.addJavaDocLine(" */");
        }
    }

    @Override
    public void addEnumComment(InnerEnum innerEnum, IntrospectedTable introspectedTable) {
    }

    @Override
    public void addFieldComment(Field field, IntrospectedTable introspectedTable,
            IntrospectedColumn introspectedColumn) {
        if (!this.suppressAllComments) {
            field.addJavaDocLine("/**");
            field.addJavaDocLine(" * Database Table : " + introspectedTable.getFullyQualifiedTable() + "; ");
            field.addJavaDocLine(" * Database Column : " + introspectedColumn.getActualColumnName() + "; ");
            String remarks = introspectedColumn.getRemarks();
            if (StringUtility.stringHasValue(remarks)) {
                field.addJavaDocLine(" * Database Column Remarks : ");
                String[] sb = remarks.split(System.getProperty("line.separator"));
                for (String remarkLine : sb) {
                    field.addJavaDocLine(" *   " + remarkLine);
                }
            }
            field.addJavaDocLine(" */");
        }
    }

    @Override
    public void addFieldComment(Field field, IntrospectedTable introspectedTable) {
    }

    @Override
    public void addGeneralMethodComment(Method method, IntrospectedTable introspectedTable) {
    }

    @Override
    public void addClassComment(InnerClass innerClass, IntrospectedTable introspectedTable, boolean markAsDoNotDelete) {
        if (!this.suppressAllComments) {
            innerClass.addJavaDocLine("/**");
            innerClass.addJavaDocLine(
                    " * This class corresponds to the database table " + introspectedTable.getFullyQualifiedTable());
            this.addJavadocTag(innerClass, markAsDoNotDelete);
            innerClass.addJavaDocLine(" */");
        }
    }

    @Override
    public void addGetterComment(Method method, IntrospectedTable introspectedTable,
            IntrospectedColumn introspectedColumn) {
    }

    @Override
    public void addSetterComment(Method method, IntrospectedTable introspectedTable,
            IntrospectedColumn introspectedColumn) {
    }

    @Override
    protected void addJavadocTag(JavaElement javaElement, boolean markAsDoNotDelete) {
    }
}
