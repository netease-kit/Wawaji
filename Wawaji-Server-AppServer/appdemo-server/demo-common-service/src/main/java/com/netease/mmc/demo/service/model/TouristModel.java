package com.netease.mmc.demo.service.model;

/**
 * 游客账号信息Model.
 *
 * @author huzhengguang
 * @date 17-7-24
 * @since 1.0
 */
public class TouristModel {

    /**
     *   用户账号
     */
    private String accid;

    /**
     *   用户昵称
     */
    private String nickname;

    /**
     *   im token
     */
    private String imToken;

    /**
     *   点播token
     */
    private String vodToken;

    /**
     *   游客账号被释放的毫秒时间戳
     */
    private Long availableAt;

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

    public String getVodToken() {
        return vodToken;
    }

    public void setVodToken(String vodToken) {
        this.vodToken = vodToken;
    }

    public Long getAvailableAt() {
        return availableAt;
    }

    public void setAvailableAt(Long availableAt) {
        this.availableAt = availableAt;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append("{");
        sb.append(", accid=").append(accid);
        sb.append(", nickname=").append(nickname);
        sb.append(", imToken=").append(imToken);
        sb.append(", vodToken=").append(vodToken);
        sb.append(", availableAt=").append(availableAt);
        sb.append("}");
        return sb.toString();
    }
}