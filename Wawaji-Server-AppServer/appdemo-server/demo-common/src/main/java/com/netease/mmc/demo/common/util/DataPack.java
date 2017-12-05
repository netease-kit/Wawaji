package com.netease.mmc.demo.common.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.ui.ModelMap;

import com.netease.mmc.demo.common.enums.HttpCodeEnum;

/**
 * 封装接口返回数据工具类.
 *
 * @author hzwanglin1
 * @date 2017/6/21
 * @since 1.0
 */
public class DataPack {

    // 定义接口返回数据格式
    /**
     * 状态码
     */
    private static final String CODE = "code";
    /**
     * 请求成功，返回请求数据
     */
    private static final String DATA = "data";
    /**
     * 请求成功，返回列表类型数据
     */
    private static final String DATA_LIST = "list";
    /**
     * 返回列表类型数据时，表示数据总量
     */
    private static final String DATA_SIZE = "total";
    /**
     * 请求失败，返回错误信息
     */
    private static final String MSG = "msg";

    private DataPack() {
        throw new UnsupportedOperationException("DataPack.class can not be construct to a instance");
    }

    /**
     * response success.
     *
     * @return
     */
    public static ModelMap packOk() {
        ModelMap model = new ModelMap();
        model.put(CODE, HttpCodeEnum.OK.value());
        return model;
    }

    /**
     * response success with object result.
     *
     * @param result object result
     * @return
     */
    public static ModelMap packOk(Object result) {
        ModelMap model = new ModelMap();
        model.put(CODE, HttpCodeEnum.OK.value());
        model.put(DATA, result);
        return model;
    }

    /**
     * <p>response success with List result.</p>
     * with result size set to size of parameter list.
     *
     * @param list list result
     * @return
     */
    public static ModelMap packOkList(List<?> list) {
        return packOkList(list, CollectionUtils.size(list));
    }

    /**
     * <p>response success with List result.</p>
     *
     * with result size set to a specific integer number.
     * usually used in paging request with limit and offset.
     *
     * @param list list result
     * @return
     */
    public static ModelMap packOkList(List<?> list, int total) {
        ModelMap model=new ModelMap();
        model.put(CODE, HttpCodeEnum.OK.value());

        Map<String, Object> ret = new HashMap<>();
        ret.put(DATA_LIST, list);
        ret.put(DATA_SIZE, total);

        model.put(DATA, ret);
        return model;
    }


    /**
     * response fail with code and error message according to {@link HttpCodeEnum}.
     *
     * @return
     */
    public static ModelMap packFailure(@Nonnull HttpCodeEnum httpCode) {
        return packFailure(httpCode.value(), httpCode.getReasonPhrase());
    }

    /**
     * response fail with code {@link HttpCodeEnum#BAD_REQUEST}.
     * provide a specific error message.
     *
     * @param message error message
     * @return
     */
    public static ModelMap packBadRequest(String message) {
        return packFailure(HttpCodeEnum.BAD_REQUEST.value(), message);
    }

    /**
     * response fail with code {@link HttpCodeEnum#FORBIDDEN}.
     *
     * @param message error message
     * @return
     */
    public static ModelMap packForbidden(String message) {
        return packFailure(HttpCodeEnum.FORBIDDEN.value(), message);
    }

    /**
     * response fail with code and error message according to {@link HttpCodeEnum#INTERNAL_SERVER_ERROR}.
     *
     * @return
     */
    public static ModelMap packInternalError() {
        return packFailure(HttpCodeEnum.INTERNAL_SERVER_ERROR);
    }

    /**
     * response fail with specific error code and error message.
     *
     * @param code error code
     * @param message error message
     * @return
     */
    public static ModelMap packFailure(int code, String message) {
        ModelMap model=new ModelMap();
        model.put(CODE, code);
        model.put(MSG, message);
        return model;
    }

    /**
     * response fail with json format error message.
     *
     * @param code error code
     * @param message error message
     * @return json format string
     */
    public static String failResponseByJson(int code, String message) {
        return String.format("{\"%s\":%d,\"%s\":\"%s\"}", CODE, code, MSG, message);
    }
}
