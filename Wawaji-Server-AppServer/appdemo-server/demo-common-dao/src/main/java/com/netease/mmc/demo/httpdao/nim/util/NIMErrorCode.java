package com.netease.mmc.demo.httpdao.nim.util;

import javax.annotation.Nonnull;

/**
 * 云信api接口状态码枚举类.
 *
 * @author hzwanglin1
 * @date 2017/6/27
 * @since 1.0
 */
public enum NIMErrorCode {
    /**
     * {@code 403 非法操作或没有权限}.
     */
    FORBIDDEN(403, "非法操作或没有权限"),
    /**
     * {@code 404 对象不存在}.
     */
    OBJECT_NOT_FOUND(404, "对象不存在"),
    /**
     * {@code 413 验证失败（短信服务）}.
     */
    VERIFY_FAILED(413, "验证码不正确"),
    /**
     * {@code 414 请求参数错误，因为api接口参数经过校验，可以认为是请求的资源不存在}.
     */
    ILLEGAL_PARAM(414, "参数错误"),
    /**
     * {@code 416 频率控制}.
     */
    FREQ_CTRL(416, "频率控制"),
    /**
     * {@code 417 重复操作}.
     */
    REPEATED_ACTION(417, "重复操作"),
    /**
     * {@code 10032 聊天室状态异常}.
     */
    CHATROOM_STATUS_ERROR(10032, "聊天室状态异常");

    /**
     * 状态码
     */
    private int value;

    /**
     * 描述
     */
    private String reasonPhrase;

    NIMErrorCode(int value, String reasonPhrase) {
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
     *
     * @param statusCode the numeric value of the enum to be returned
     * @return the enum constant with the specified numeric value
     * @throws IllegalArgumentException if this enum has no constant for the specified numeric value
     */
    @Nonnull
    public static NIMErrorCode valueOf(int statusCode) {
        for (NIMErrorCode codeEnum : values()) {
            if (statusCode == codeEnum.value) {
                return codeEnum;
            }
        }
        throw new IllegalArgumentException("No matching constant for [" + statusCode + "]");
    }
}
