/*
 * @(#) JSONTypeHandler.java 2015年9月8日
 * 
 * Copyright 2010 NetEase.com, Inc. All rights reserved.
 */
package com.netease.mmc.demo.dao.handler;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import com.alibaba.fastjson.JSON;

/**
 * 类 <code>JSONTypeHandler</code>
 * java bean和json之间数据转换。mybatis使用
 * @author liucl
 * @Date 2015年9月8日
 */
public class JSONTypeHandler<T> extends BaseTypeHandler<T> {
    protected Class<T> clazz;  
    
    @SuppressWarnings("unchecked")  
    public JSONTypeHandler() {  
        @SuppressWarnings("rawtypes")  
        Class thisClass = getClass();
  
        while (thisClass != Object.class) {
            Type t = thisClass.getGenericSuperclass();
            if (t instanceof ParameterizedType) {  
                Type[] args = ((ParameterizedType) t).getActualTypeArguments();  
                if (args[0] instanceof Class) {  
                    this.clazz = (Class<T>) args[0];  
                    break;  
                }  
            }  
            thisClass = thisClass.getSuperclass();
        }  
    } 
 
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType)
            throws SQLException {
        if(parameter==null){
            ps.setString(i, null);
        }
        String json= JSON.toJSONString(parameter);
        ps.setString(i, json);
    }


    @SuppressWarnings("unchecked")
    @Override
    public T getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String json=rs.getString(columnName);
        if(StringUtils.isBlank(json))
            return null;
        if(json.startsWith("[")){//list
            return (T) JSON.parseArray(json, clazz);
        }else
            return JSON.parseObject(json,clazz);
    }


    @SuppressWarnings("unchecked")
    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String json=rs.getString(columnIndex);
        if(StringUtils.isBlank(json))
            return null;
        if(json.contains("[")){//list
            return (T) JSON.parseArray(json, clazz);
        }else
            return JSON.parseObject(json,clazz);
    }


    @SuppressWarnings("unchecked")
    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String json=cs.getString(columnIndex);
        if(StringUtils.isBlank(json))
            return null;
        if(json.contains("[")){//list
            return (T) JSON.parseArray(json, clazz);
        }else
            return JSON.parseObject(json,clazz);
    }
    
}
