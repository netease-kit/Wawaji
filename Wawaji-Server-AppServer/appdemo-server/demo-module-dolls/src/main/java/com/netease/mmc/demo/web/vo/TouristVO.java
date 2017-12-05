package com.netease.mmc.demo.web.vo;

/**
 * 用户账号信息VO.
 *
 * @author hzwanglin1
 * @date 17-6-28
 * @since 1.0
 */
public class TouristVO {

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
        final StringBuilder sb = new StringBuilder("UserModel{");
        sb.append(", accid='").append(accid).append('\'');
        sb.append(", nickname='").append(nickname).append('\'');
        sb.append(", imToken='").append(imToken).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
