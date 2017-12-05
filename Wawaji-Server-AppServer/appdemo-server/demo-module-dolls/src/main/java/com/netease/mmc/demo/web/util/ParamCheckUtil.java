package com.netease.mmc.demo.web.util;

import com.netease.mmc.demo.common.util.PatternUtil;

/**
 * Controller参数校验工具类.
 *
 * @author hzwanglin1
 * @date 2017/6/27
 * @since 1.0
 */
public class ParamCheckUtil {
    private ParamCheckUtil() {
        throw new UnsupportedOperationException("ParamCheckUtil.class can not be construct to a instance");
    }

    /**
     * 校验用户id
     *
     * @param accid
     * @return
     */
    public static boolean validateAccid(String accid) {
        String validateStr = "^[a-zA-Z0-9@\\-\\.\\_]{1,20}$";
        return matcher(validateStr, accid);
    }

    /**
     * 校验昵称
     *
     * @param nickname
     * @return
     */
    public static boolean validateNickname(String nickname) {
        String validateStr = "^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$";
        return matcher(validateStr, nickname);
    }

    private static boolean matcher(String reg, String string) {
        return string != null && PatternUtil.matchesWithCache(reg, string);
    }
}
