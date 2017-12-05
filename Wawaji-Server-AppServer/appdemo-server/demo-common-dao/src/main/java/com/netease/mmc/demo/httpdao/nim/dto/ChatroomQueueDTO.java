package com.netease.mmc.demo.httpdao.nim.dto;

/**
 * 云信API接口返回值DTO.
 *
 * @author hzwanglin1
 * @date 2017/6/24
 * @since 1.0
 */
public class ChatroomQueueDTO {
    /**
     * 返回状态码
     */
    private String key;

    /**
     * 错误提示信息
     */
    private String value;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("{\"key\":\"").append(key).append("\",\"value\":\"").append(value).append("\"}  ");
        return builder.toString();
    }

    
}
