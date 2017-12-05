package com.netease.mmc.demo.httpdao.nim.dto;

/**
 * 云信用户信息DTO.
 *
 * @author hzwanglin1
 * @date 17-6-25
 * @since 1.0
 */
public class NIMUserDTO {
    /**
     * 用户账号
     */
    private String accid;

    /**
     * 用户昵称
     */
    private String name;

    /**
     * 用户token
     */
    private String token;

    public String getAccid() {
        return accid;
    }

    public void setAccid(String accid) {
        this.accid = accid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("NIMUserDTO{");
        sb.append("accid='").append(accid).append('\'');
        sb.append(", name='").append(name).append('\'');
        sb.append(", token='").append(token).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
