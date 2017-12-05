package com.netease.mmc.demo.httpdao.nim.dto;

/**
 * 用户信息接口返回值DTO.
 *
 * @author hzwanglin1
 * @date 17-6-25
 * @since 1.0
 */
public class NIMUserResponseDTO {
    /**
     * 状态码
     */
    private Integer code;

    /**
     * 错误描述
     */
    private String desc;

    /**
     * 用户账号相关信息
     */
    private NIMUserDTO info;

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

    public NIMUserDTO getInfo() {
        return info;
    }

    public void setInfo(NIMUserDTO info) {
        this.info = info;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("NIMUserResponseDTO{");
        sb.append("code=").append(code);
        sb.append(", desc='").append(desc).append('\'');
        sb.append(", info=").append(info);
        sb.append('}');
        return sb.toString();
    }
}
