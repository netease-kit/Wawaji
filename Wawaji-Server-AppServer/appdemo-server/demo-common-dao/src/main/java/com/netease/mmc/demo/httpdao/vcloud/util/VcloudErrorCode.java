package com.netease.mmc.demo.httpdao.vcloud.util;

import javax.annotation.Nonnull;

/**
 * vcloud api接口状态码枚举类.
 *
 * @author hzwanglin1
 * @date 2017/6/27
 * @since 1.0
 */
public enum VcloudErrorCode {
    /**
     * {@code 611 直播频道名称已存在}.
     */
    CHANNEL_ALREADY_EXISTS(611, "频道名称已存在"),
    /**
     * {@code 711 请求参数非法，因为api接口参数经过校验，可以认为是请求的资源不存在}.
     */
    ILLEGAL_PARAM(711, "请求参数非法");

    /**
     * 状态码
     */
    private int value;

    /**
     * 描述
     */
    private String reasonPhrase;

    VcloudErrorCode(int value, String reasonPhrase) {
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
    public static VcloudErrorCode valueOf(int statusCode) {
        for (VcloudErrorCode codeEnum : values()) {
            if (statusCode == codeEnum.value) {
                return codeEnum;
            }
        }
        throw new IllegalArgumentException("No matching constant for [" + statusCode + "]");
    }
}
