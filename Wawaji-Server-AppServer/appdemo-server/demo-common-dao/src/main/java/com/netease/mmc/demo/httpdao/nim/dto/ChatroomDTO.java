package com.netease.mmc.demo.httpdao.nim.dto;

/**
 * 聊天室信息DTO.
 *
 * @author hzwanglin1
 * @date 2017/6/8
 * @since 1.0
 */
public class ChatroomDTO {
    /**
     * 聊天室房间id
     */
    private Long roomid;

    /**
     * 聊天室是否有效
     */
    private Boolean valid;

    /**
     * 聊天室是否处于全员禁言状态
     */
    private Boolean muted;

    /**
     * 聊天室公告
     */
    private String announcement;

    /**
     * 聊天室房间名称
     */
    private String name;

    /**
     * 聊天室广播地址
     */
    private String broadcasturl;

    /**
     * 聊天室在线人数
     */
    private Long onlineusercount;

    /**
     * 聊天室扩展字段
     */
    private String ext;

    /**
     * 聊天室房主账号
     */
    private String creator;

    public Long getRoomid() {
        return roomid;
    }

    public void setRoomid(Long roomid) {
        this.roomid = roomid;
    }

    public Boolean getValid() {
        return valid;
    }

    public void setValid(Boolean valid) {
        this.valid = valid;
    }

    public Boolean getMuted() {
        return muted;
    }

    public void setMuted(Boolean muted) {
        this.muted = muted;
    }

    public String getAnnouncement() {
        return announcement;
    }

    public void setAnnouncement(String announcement) {
        this.announcement = announcement;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBroadcasturl() {
        return broadcasturl;
    }

    public void setBroadcasturl(String broadcasturl) {
        this.broadcasturl = broadcasturl;
    }

    public Long getOnlineusercount() {
        return onlineusercount;
    }

    public void setOnlineusercount(Long onlineusercount) {
        this.onlineusercount = onlineusercount;
    }

    public String getExt() {
        return ext;
    }

    public void setExt(String ext) {
        this.ext = ext;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("ChatroomDTO{");
        sb.append("roomid=").append(roomid);
        sb.append(", valid=").append(valid);
        sb.append(", muted=").append(muted);
        sb.append(", announcement='").append(announcement).append('\'');
        sb.append(", name='").append(name).append('\'');
        sb.append(", broadcasturl='").append(broadcasturl).append('\'');
        sb.append(", onlineusercount=").append(onlineusercount);
        sb.append(", ext='").append(ext).append('\'');
        sb.append(", creator='").append(creator).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
