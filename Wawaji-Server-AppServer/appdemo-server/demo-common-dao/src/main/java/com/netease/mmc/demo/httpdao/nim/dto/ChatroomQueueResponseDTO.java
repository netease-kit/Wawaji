package com.netease.mmc.demo.httpdao.nim.dto;

/**
 * 云信API接口返回值DTO.
 *
 * @author huzhengguang
 * @date 2017/7/20
 * @since 1.0
 */
public class ChatroomQueueResponseDTO {
    /**
     * 返回状态码
     */
    private Integer code;

    /**
     * 接口返回信息
     */
    private String desc;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("ChatroomQueueResponseDTO{");
        sb.append("code=").append(code);
        sb.append(", desc='").append(desc).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
