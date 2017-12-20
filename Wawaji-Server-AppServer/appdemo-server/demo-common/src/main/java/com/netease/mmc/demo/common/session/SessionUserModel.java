package com.netease.mmc.demo.common.session;

/**
 * Session用户账号信息Model.
 * 用于在Session中保存当前登陆用户数据
 *
 * @author hzwanglin1
 * @date 2017-11-24
 * @since 1.0
 */
public class SessionUserModel {

    /**
     * 用户账号
     */
    private String accid;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * im服务器token
     */
    private String imToken;

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

    public String getImToken() {
        return imToken;
    }

    public void setImToken(String imToken) {
        this.imToken = imToken;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("SessionUserModel{");
        sb.append("accid='").append(accid).append('\'');
        sb.append(", nickname='").append(nickname).append('\'');
        sb.append(", imToken='").append(imToken).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
