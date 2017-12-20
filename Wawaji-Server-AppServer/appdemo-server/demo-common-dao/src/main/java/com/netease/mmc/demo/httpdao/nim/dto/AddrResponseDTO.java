package com.netease.mmc.demo.httpdao.nim.dto;

import java.util.List;

/**
 * 聊天室地址DTO.
 *
 * @author hzwanglin1
 * @date 2017/6/24
 * @since 1.0
 */
public class AddrResponseDTO {
    /**
     * 返回状态码
     */
    private Integer code;

    /**
     * 聊天室地址
     */
    private List<String> addr;

    /**
     * 错误提示信息
     */
    private String desc;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public List<String> getAddr() {
        return addr;
    }

    public void setAddr(List<String> addr) {
        this.addr = addr;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("AddrResponseDTO{");
        sb.append("code=").append(code);
        sb.append(", addr=").append(addr);
        sb.append(", desc='").append(desc).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
