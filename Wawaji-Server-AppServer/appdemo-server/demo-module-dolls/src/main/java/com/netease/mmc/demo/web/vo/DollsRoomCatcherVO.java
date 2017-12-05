package com.netease.mmc.demo.web.vo;

/**
 * 娃娃机房间信息VO.
 *
 * @author hzwanglin1
 * @date 17-6-29
 * @since 1.0
 */
public class DollsRoomCatcherVO {
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
     * 创建人token
     */
    private String creatorToken;

    /**
     * 推流地址1
     */
    private String pushUrl1;

    /**
     * 推流地址2
     */
    private String pushUrl2;

    /**
     * 聊天室状态，true-开启；false-关闭
     */
    private Boolean roomStatus;

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

    public String getCreatorToken() {
        return creatorToken;
    }

    public void setCreatorToken(String creatorToken) {
        this.creatorToken = creatorToken;
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

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("DollsRoomCatcherVO{");
        sb.append("roomId=").append(roomId);
        sb.append(", name='").append(name).append('\'');
        sb.append(", creator='").append(creator).append('\'');
        sb.append(", creatorToken='").append(creatorToken).append('\'');
        sb.append(", pushUrl1='").append(pushUrl1).append('\'');
        sb.append(", pushUrl2='").append(pushUrl2).append('\'');
        sb.append(", roomStatus=").append(roomStatus);
        sb.append(", liveStatus=").append(liveStatus);
        sb.append('}');
        return sb.toString();
    }
}
