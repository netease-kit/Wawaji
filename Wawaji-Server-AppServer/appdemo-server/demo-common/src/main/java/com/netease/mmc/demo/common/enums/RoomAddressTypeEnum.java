package com.netease.mmc.demo.common.enums;

/**
 * 聊天室地址类型.
 *
 * @author hzwanglin1
 * @date 2017/6/5
 * @since 1.0
 */
public enum RoomAddressTypeEnum {
    /**
     * web link
     */
    WEB(1),
    /**
     * common link
     */
    COMMON(2);

    private int value;

    RoomAddressTypeEnum(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static RoomAddressTypeEnum getEnum(Integer value) {
        if (value == null) {
            return null;
        }
        for (RoomAddressTypeEnum typeEnum : RoomAddressTypeEnum.values()) {
            if (typeEnum.getValue() == value) {
                return typeEnum;
            }
        }
        return null;
    }
}
