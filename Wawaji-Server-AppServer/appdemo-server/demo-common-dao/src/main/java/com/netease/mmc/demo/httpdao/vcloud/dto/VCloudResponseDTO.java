package com.netease.mmc.demo.httpdao.vcloud.dto;

/**
 * Vcloud API接口返回值DTO.
 *
 * @author hzwanglin1
 * @date 2017/6/6
 * @since 1.0
 */
public class VCloudResponseDTO<T> {
    private Integer code;
    private String msg;
    private T ret;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getRet() {
        return ret;
    }

    public void setRet(T ret) {
        this.ret = ret;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("VCloudResponseDTO{");
        sb.append("code=").append(code);
        sb.append(", msg='").append(msg).append('\'');
        sb.append(", ret=").append(ret);
        sb.append('}');
        return sb.toString();
    }
}
