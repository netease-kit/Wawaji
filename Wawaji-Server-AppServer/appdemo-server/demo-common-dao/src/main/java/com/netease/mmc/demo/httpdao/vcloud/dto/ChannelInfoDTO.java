package com.netease.mmc.demo.httpdao.vcloud.dto;

/**
 * 直播频道信息DTO.
 *
 * @author hzwanglin1
 * @date 2017/6/24
 * @since 1.0
 */
public class ChannelInfoDTO {
    /**
     * 频道id
     */
    private String cid;

    /**
     * 频道创建时间
     */
    private Long ctime;

    /**
     * 频道名称
     */
    private String name;

    /**
     * 推流地址
     */
    private String pushUrl;

    /**
     * http拉流地址
     */
    private String httpPullUrl;

    /**
     * hls拉流地址
     */
    private String hlsPullUrl;

    /**
     * rtmp拉流地址
     */
    private String rtmpPullUrl;

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public Long getCtime() {
        return ctime;
    }

    public void setCtime(Long ctime) {
        this.ctime = ctime;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPushUrl() {
        return pushUrl;
    }

    public void setPushUrl(String pushUrl) {
        this.pushUrl = pushUrl;
    }

    public String getHttpPullUrl() {
        return httpPullUrl;
    }

    public void setHttpPullUrl(String httpPullUrl) {
        this.httpPullUrl = httpPullUrl;
    }

    public String getHlsPullUrl() {
        return hlsPullUrl;
    }

    public void setHlsPullUrl(String hlsPullUrl) {
        this.hlsPullUrl = hlsPullUrl;
    }

    public String getRtmpPullUrl() {
        return rtmpPullUrl;
    }

    public void setRtmpPullUrl(String rtmpPullUrl) {
        this.rtmpPullUrl = rtmpPullUrl;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("ChannelInfoDTO{");
        sb.append("cid='").append(cid).append('\'');
        sb.append(", ctime=").append(ctime);
        sb.append(", name='").append(name).append('\'');
        sb.append(", pushUrl='").append(pushUrl).append('\'');
        sb.append(", httpPullUrl='").append(httpPullUrl).append('\'');
        sb.append(", hlsPullUrl='").append(hlsPullUrl).append('\'');
        sb.append(", rtmpPullUrl='").append(rtmpPullUrl).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
