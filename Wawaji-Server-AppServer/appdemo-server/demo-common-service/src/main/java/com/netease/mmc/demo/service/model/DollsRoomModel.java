package com.netease.mmc.demo.service.model;

/**
 * 娃娃机房间信息Model.
 *
 * @author hzwanglin1
 * @date 17-11-21
 * @since 1.0
 */
public class DollsRoomModel {
    /**
     * 房间id
     */
    private Long roomId;

    /**
     * 房主账号
     */
    private String creator;

    /**
     * 房主 im token
     */
    private String creatorToken;

    /**
     * 房间名称
     */
    private String name;

    /**
     * 房间在线人数
     */
    private Long onlineUserCount;

    /**
     * 当前排队人数
     */
    private Long queueCount;

    /**
     * 聊天室状态，true-开启；false-关闭
     */
    private Boolean roomStatus;

    /**
     * 直播频道id 1
     */
    private String cid1;

    /**
     * 直播频道id 2
     */
    private String cid2;

    /**
     * 推流地址1
     */
    private String pushUrl1;

    /**
     * 推流地址2
     */
    private String pushUrl2;

    /**
     * rtmp拉流地址1
     */
    private String rtmpPullUrl1;

    /**
     * http拉流地址1
     */
    private String httpPullUrl1;

    /**
     * hls拉流地址1
     */
    private String hlsPullUrl1;

    /**
     * rtmp拉流地址2
     */
    private String rtmpPullUrl2;

    /**
     * http拉流地址2
     */
    private String httpPullUrl2;

    /**
     * hls拉流地址2
     */
    private String hlsPullUrl2;

    /**
     * 频道状态（0：空闲； 1：直播； 2：禁用； 3：直播录制）
     */
    private Integer liveStatus;

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreatorToken() {
        return creatorToken;
    }

    public void setCreatorToken(String creatorToken) {
        this.creatorToken = creatorToken;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getOnlineUserCount() {
        return onlineUserCount;
    }

    public void setOnlineUserCount(Long onlineUserCount) {
        this.onlineUserCount = onlineUserCount;
    }

    public Long getQueueCount() {
        return queueCount;
    }

    public void setQueueCount(Long queueCount) {
        this.queueCount = queueCount;
    }

    public Boolean getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(Boolean roomStatus) {
        this.roomStatus = roomStatus;
    }

    public String getCid1() {
        return cid1;
    }

    public void setCid1(String cid1) {
        this.cid1 = cid1;
    }

    public String getCid2() {
        return cid2;
    }

    public void setCid2(String cid2) {
        this.cid2 = cid2;
    }

    public String getPushUrl1() {
        return pushUrl1;
    }

    public void setPushUrl1(String pushUrl1) {
        this.pushUrl1 = pushUrl1;
    }

    public String getPushUrl2() {
        return pushUrl2;
    }

    public void setPushUrl2(String pushUrl2) {
        this.pushUrl2 = pushUrl2;
    }

    public String getRtmpPullUrl1() {
        return rtmpPullUrl1;
    }

    public void setRtmpPullUrl1(String rtmpPullUrl1) {
        this.rtmpPullUrl1 = rtmpPullUrl1;
    }

    public String getHttpPullUrl1() {
        return httpPullUrl1;
    }

    public void setHttpPullUrl1(String httpPullUrl1) {
        this.httpPullUrl1 = httpPullUrl1;
    }

    public String getRtmpPullUrl2() {
        return rtmpPullUrl2;
    }

    public String getHlsPullUrl1() {
        return hlsPullUrl1;
    }

    public void setHlsPullUrl1(String hlsPullUrl1) {
        this.hlsPullUrl1 = hlsPullUrl1;
    }

    public void setRtmpPullUrl2(String rtmpPullUrl2) {
        this.rtmpPullUrl2 = rtmpPullUrl2;
    }

    public String getHttpPullUrl2() {
        return httpPullUrl2;
    }

    public void setHttpPullUrl2(String httpPullUrl2) {
        this.httpPullUrl2 = httpPullUrl2;
    }

    public String getHlsPullUrl2() {
        return hlsPullUrl2;
    }

    public void setHlsPullUrl2(String hlsPullUrl2) {
        this.hlsPullUrl2 = hlsPullUrl2;
    }

    public Integer getLiveStatus() {
        return liveStatus;
    }

    public void setLiveStatus(Integer liveStatus) {
        this.liveStatus = liveStatus;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("DollsRoomModel{");
        sb.append("roomId=").append(roomId);
        sb.append(", creator='").append(creator).append('\'');
        sb.append(", creatorToken='").append(creatorToken).append('\'');
        sb.append(", name='").append(name).append('\'');
        sb.append(", onlineUserCount=").append(onlineUserCount);
        sb.append(", queueCount=").append(queueCount);
        sb.append(", roomStatus=").append(roomStatus);
        sb.append(", cid1='").append(cid1).append('\'');
        sb.append(", cid2='").append(cid2).append('\'');
        sb.append(", pushUrl1='").append(pushUrl1).append('\'');
        sb.append(", pushUrl2='").append(pushUrl2).append('\'');
        sb.append(", rtmpPullUrl1='").append(rtmpPullUrl1).append('\'');
        sb.append(", httpPullUrl1='").append(httpPullUrl1).append('\'');
        sb.append(", hlsPullUrl1='").append(hlsPullUrl1).append('\'');
        sb.append(", rtmpPullUrl2='").append(rtmpPullUrl2).append('\'');
        sb.append(", httpPullUrl2='").append(httpPullUrl2).append('\'');
        sb.append(", hlsPullUrl2='").append(hlsPullUrl2).append('\'');
        sb.append(", liveStatus=").append(liveStatus);
        sb.append('}');
        return sb.toString();
    }
}
