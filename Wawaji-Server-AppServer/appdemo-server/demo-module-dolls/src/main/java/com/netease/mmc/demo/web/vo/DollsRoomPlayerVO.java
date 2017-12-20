package com.netease.mmc.demo.web.vo;

/**
 * 展现给玩家的娃娃机房间信息VO.
 *
 * @author hzwanglin1
 * @date 2017-11-21
 * @since 1.0
 */
public class DollsRoomPlayerVO {
    /**
     * 房间id
     */
    private Long roomId;

    /**
     * 聊天室名称
     */
    private String name;

    /**
     * 聊天室创建人
     */
    private String creator;

    /**
     * rtmp拉流地址1
     */
    private String rtmpPullUrl1;

    /**
     * rtmp拉流地址2
     */
    private String rtmpPullUrl2;

    /**
     * http拉流地址1
     */
    private String httpPullUrl1;

    /**
     * http拉流地址2
     */
    private String httpPullUrl2;

    /**
     * hls拉流地址1
     */
    private String hlsPullUrl1;

    /**
     * hls拉流地址2
     */
    private String hlsPullUrl2;

    /**
     * 聊天室状态，true-开启；false-关闭
     */
    private Boolean roomStatus;

    /**
     * 频道状态（0：空闲； 1：直播； 2：禁用； 3：直播录制）
     */
    private Integer liveStatus;

    /**
     * 聊天室在线人数
     */
    private Long onlineUserCount;

    /**
     * 排队人数
     */
    private Long queueCount;

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getRtmpPullUrl1() {
        return rtmpPullUrl1;
    }

    public void setRtmpPullUrl1(String rtmpPullUrl1) {
        this.rtmpPullUrl1 = rtmpPullUrl1;
    }

    public String getRtmpPullUrl2() {
        return rtmpPullUrl2;
    }

    public void setRtmpPullUrl2(String rtmpPullUrl2) {
        this.rtmpPullUrl2 = rtmpPullUrl2;
    }

    public String getHttpPullUrl1() {
        return httpPullUrl1;
    }

    public void setHttpPullUrl1(String httpPullUrl1) {
        this.httpPullUrl1 = httpPullUrl1;
    }

    public String getHttpPullUrl2() {
        return httpPullUrl2;
    }

    public void setHttpPullUrl2(String httpPullUrl2) {
        this.httpPullUrl2 = httpPullUrl2;
    }

    public String getHlsPullUrl1() {
        return hlsPullUrl1;
    }

    public void setHlsPullUrl1(String hlsPullUrl1) {
        this.hlsPullUrl1 = hlsPullUrl1;
    }

    public String getHlsPullUrl2() {
        return hlsPullUrl2;
    }

    public void setHlsPullUrl2(String hlsPullUrl2) {
        this.hlsPullUrl2 = hlsPullUrl2;
    }

    public Boolean getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(Boolean roomStatus) {
        this.roomStatus = roomStatus;
    }

    public Integer getLiveStatus() {
        return liveStatus;
    }

    public void setLiveStatus(Integer liveStatus) {
        this.liveStatus = liveStatus;
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

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("DollsRoomPlayerVO{");
        sb.append("roomId=").append(roomId);
        sb.append(", name='").append(name).append('\'');
        sb.append(", creator='").append(creator).append('\'');
        sb.append(", rtmpPullUrl1='").append(rtmpPullUrl1).append('\'');
        sb.append(", rtmpPullUrl2='").append(rtmpPullUrl2).append('\'');
        sb.append(", httpPullUrl1='").append(httpPullUrl1).append('\'');
        sb.append(", httpPullUrl2='").append(httpPullUrl2).append('\'');
        sb.append(", hlsPullUrl1='").append(hlsPullUrl1).append('\'');
        sb.append(", hlsPullUrl2='").append(hlsPullUrl2).append('\'');
        sb.append(", roomStatus=").append(roomStatus);
        sb.append(", liveStatus=").append(liveStatus);
        sb.append(", onlineUserCount=").append(onlineUserCount);
        sb.append(", queueCount=").append(queueCount);
        sb.append('}');
        return sb.toString();
    }
}
