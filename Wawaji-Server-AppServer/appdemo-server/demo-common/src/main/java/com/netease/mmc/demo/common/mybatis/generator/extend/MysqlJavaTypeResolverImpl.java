package com.netease.mmc.demo.common.mybatis.generator.extend;

import java.util.Properties;

import org.mybatis.generator.api.IntrospectedColumn;
import org.mybatis.generator.api.dom.java.FullyQualifiedJavaType;
import org.mybatis.generator.internal.types.JavaTypeResolverDefaultImpl;
import org.mybatis.generator.internal.util.StringUtility;

/**
 * MysqlJavaTypeResolverImpl 此处指定的JavaType最终会被columnOverride元素中指定的javaType所覆盖
 *
 * @author hzzhanghan
 * @date 2016-09-20 20:07
 * @since 1.0
 */
public class MysqlJavaTypeResolverImpl extends JavaTypeResolverDefaultImpl {

    private static final FullyQualifiedJavaType shortJavaType = new FullyQualifiedJavaType(Short.class.getName());
    private static final FullyQualifiedJavaType byteJavaType = new FullyQualifiedJavaType(Byte.class.getName());
    // 强制将 Short 和 Byte 转为 Integer
    private boolean forceInteger;

    @Override
    public void addConfigurationProperties(Properties properties) {
        super.addConfigurationProperties(properties);
        this.forceInteger = StringUtility.isTrue(properties.getProperty("forceInteger"));
    }

    @Override
    protected FullyQualifiedJavaType overrideDefaultType(IntrospectedColumn column,
            FullyQualifiedJavaType defaultType) {
        FullyQualifiedJavaType answer = super.overrideDefaultType(column, defaultType);
        if (forceInteger) {
            answer = overrideToInteger(column, answer);
        }
        return answer;
    }


    private FullyQualifiedJavaType overrideToInteger(IntrospectedColumn column, FullyQualifiedJavaType defaultType) {
        FullyQualifiedJavaType answer = defaultType;
        if (shortJavaType.equals(answer) || byteJavaType.equals(answer)) {
            answer = new FullyQualifiedJavaType(Integer.class.getName());
        }
        return answer;
    }
}
