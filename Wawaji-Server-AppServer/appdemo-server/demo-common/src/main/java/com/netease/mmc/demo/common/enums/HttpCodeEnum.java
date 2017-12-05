package com.netease.mmc.demo.common.enums;

import javax.annotation.Nonnull;

/**
 * HTTP状态码枚举类.
 *
 * @author hzwanglin1
 * @date 2017/6/21
 * @since 1.0
 */
public enum HttpCodeEnum {
    /**
     * {@code 200 请求成功}.
     */
    OK(200, "请求成功"),
    /**
     * {@code 400 请求参数错误}.
     */
    BAD_REQUEST(400, "请求参数错误"),
    /**
     * {@code 401 用户校验失败}.
     */
    UNAUTHORIZED(401, "用户校验失败"),
    /**
     * {@code 402 参数非法}.
     */
    INVALID_PARAM(402, "参数非法"),
    /**
     * {@code 403 没有权限}.
     */
    FORBIDDEN(403, "没有权限"),
    /**
     * {@code 407 访问频率控制}.
     */
    REQUEST_FREQ_CTRL(407, "访问太频繁，请稍后再试"),
    /**
     * {@code 500 服务器内部错误}.
     */
    INTERNAL_SERVER_ERROR(500, "服务器内部错误"),

    /*6xx 直播相关错误码*/
    /**
     * {@code 600 直播请求失败}
     */
    LIVE_ERROR(600, "直播请求失败"),

    /*8xx 聊天室相关错误码*/
    /**
     * {@code 800 聊天室请求失败}
     */
    CHATROOM_ERROR(800, "聊天室请求失败"),
    /**
     * {@code 801 聊天室已关闭}
     */
    CHATROOM_CLOSED(801, "房间已关闭"),
    /**
     * {@code 803 不能以观众身份进入自己的房间（同一个房间不能同时进入，会导致互踢）}
     */
    CHATROOM_CAN_NOT_ENTER_AGAIN(803, "不能以观众身份进入自己的房间"),
    /**
     * {@code 804 聊天室房间不存在}
     */
    CHATROOM_NOT_FOUND(804, "房间不存在"),
    /**
     * {@code 805 连麦请求发送失败}
     */
    CHATROOM_PUSH_MIC_LINK_ERROR(805, "连麦请求发送失败"),
    /**
     * {@code 806 房间状态变更失败}
     */
    CHATROOM_CHANGE_STATUS_ERROR(806, "房间状态变更失败"),

    /*9xx 账号相关错误码*/
    /**
     * {@code 900 账号请求失败}
     */
    USER_ERROR(900, "账号请求失败"),
    /**
     * {@code 901 用户名格式错误}
     */
    ACCID_INVALID(901, "账号限20位[a-zA-Z0-9@._-]"),
    /**
     * {@code 902 昵称格式错误}
     */
    NICKNAME_INVALID(902, "昵称格式错误"),
    /**
     * {@code 903 密码格式错误}
     */
    PASSWORD_INVALID(903, "密码格式错误"),
    /**
     * {@code 904 账号不存在}
     */
    USER_NOT_FOUND(904, "账号不存在"),
    /**
     * {@code 905 账号在远程服务器不存在}
     */
    USER_NOT_FOUND_ON_SERVER(905, "账号不存在"),
    /**
     * {@code 906 账号已注册}
     */
    USER_ALREADY_EXISTS(906, "账号已注册"),
    /**
     * {@code 907 手机格式错误}
     */
    PHONE_INVALID(907, "手机格式错误"),
    /**
     * {@code 908 手机未绑定账号}
     */
    PHONE_NOT_FOUND(908, "手机号码不存在"),
    /**
     * {@code 909 手机已绑定账号}
     */
    PHONE_ALREADY_EXISTS(909, "手机号码已存在"),
    /**
     * {@code 910 密码校验不通过}
     */
    PASSWORD_VERIFY_FAILED(910, "密码错误"),
    
    /**
     * {@code 911 ip注册过频繁}
     */
    USER_REG_FREQUENTLY(911, "同一IP注册已达今日上限"),
    
    /**
     * {@code 912 密码错误次数过多，请稍后尝试}
     */
    PASSWORD_VERIFY_WRONG_LIMIT(912, "密码错误次数过多，请1小时后重试"),
    

    /*10xx 短信相关错误码*/
    /**
     * {@code 1000 短信请求失败}
     */
    SMS_ERROR(1000, "短信请求失败"),
    /**
     * {@code 1001 验证码发送频控}
     */
    SMS_CODE_SEND_TOO_FAST(1001, "验证码发送太快"),
    /**
     * {@code 1002 短信验证码校验失败}
     */
    SMS_CODE_VERIFY_FAILED(1002, "验证码错误"),
    /**
     * {@code 1003 短信验证码发送失败}
     */
    SMS_CODE_SEND_FAILED(1003, "验证码发送失败，请重试"),
    /**
     * {@code 1004 当日验证码发送上限}
     */
    SMS_CODE_DAY_LIMIT(1004, "短信验证码发送次数已达今日上限"),
    /**
     * {@code 1005 验证码错误次数过多，请稍后尝试}
     */
    PHONE_VERIFY_WRONG_LIMIT(1005, "验证码错误次数过多，请1小时后重试"),


    /*11xx 游客相关错误码*/
    /**
     * {@code 1100 游客请求失败}
     */
    TOURIST_ERROR(1100, "游客请求失败"),
    /**
     * {@code 1101 ip获取游客账户达到上限}
     */
    TOURIST_GET_LIMIT(1101, "同一IP获取游客账户已达今日上限"),
    
    /**
     * {@code 1102 游客账户请求失败}
     */
    TOURIST_GET_ERROR(1102, "游客账户请求失败,请稍后再试");

    /**
     * 状态码
     */
    private int value;

    /**
     * 描述
     */
    private String reasonPhrase;

    HttpCodeEnum(int value, String reasonPhrase) {
        this.value = value;
        this.reasonPhrase = reasonPhrase;
    }

    /**
     * Return the integer value of this status code.
     */
    public int value() {
        return value;
    }

    /**
     * Return the reason phrase of this status code.
     */
    public String getReasonPhrase() {
        return reasonPhrase;
    }

    /**
     * Return a string representation of this status code.
     */
    @Override
    public String toString() {
        return Integer.toString(this.value);
    }

    /**
     * Return the enum constant of this type with the specified numeric value.
     * @param statusCode the numeric value of the enum to be returned
     * @return the enum constant with the specified numeric value
     * @throws IllegalArgumentException if this enum has no constant for the specified numeric value
     */
    @Nonnull
    public static HttpCodeEnum valueOf(int statusCode) {
        for (HttpCodeEnum codeEnum : values()) {
            if (statusCode == codeEnum.value) {
                return codeEnum;
            }
        }
        throw new IllegalArgumentException("No matching constant for [" + statusCode + "]");
    }
}
