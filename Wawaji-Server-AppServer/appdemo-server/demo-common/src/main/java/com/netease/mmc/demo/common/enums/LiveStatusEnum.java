package com.netease.mmc.demo.common.enums;

/**
 * 直播频道状态.
 *
 * @author hzwanglin1
 * @date 2017/6/5
 * @since 1.0
 */
public enum LiveStatusEnum {
    /**
     * 空闲
     */
    IDLE(0),
    /**
     * 直播中
     */
    LIVE(1),
    /**
     * 频道被禁用
     */
    FORBID(2),
    /**
     * 直播录制中
     */
    RECORD(3);

    private int value;

    LiveStatusEnum(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static LiveStatusEnum getEnum(Integer value) {
        if (value == null) {
            return null;
        }
        for (LiveStatusEnum typeEnum : LiveStatusEnum.values()) {
            if (typeEnum.getValue() == value) {
                return typeEnum;
            }
        }
        return null;
    }
}
