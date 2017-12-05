package com.netease.mmc.demo.service.model;

/**
 * 用户账号信息Model.
 *
 * @author hzwanglin1
 * @date 17-6-25
 * @since 1.0
 */
public class UserModel {

    /**
     * 用户账号
     */
    private String accid;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 用户手机号
     */
    private String phone;

    /**
     * im服务器token
     */
    private String imToken;

    /**
     * 点播服务器token
     */
    private String vodToken;

    public String getAccid() {
        return accid;
    }

    public void setAccid(String accid) {
        this.accid = accid;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getImToken() {
        return imToken;
    }

    public void setImToken(String imToken) {
        this.imToken = imToken;
    }

    public String getVodToken() {
        return vodToken;
    }

    public void setVodToken(String vodToken) {
        this.vodToken = vodToken;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("UserModel{");
        sb.append("accid='").append(accid).append('\'');
        sb.append(", nickname='").append(nickname).append('\'');
        sb.append(", phone='").append(phone).append('\'');
        sb.append(", imToken='").append(imToken).append('\'');
        sb.append(", vodToken='").append(vodToken).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
