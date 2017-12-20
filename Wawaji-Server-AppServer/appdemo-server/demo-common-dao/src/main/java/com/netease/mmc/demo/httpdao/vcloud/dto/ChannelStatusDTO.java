package com.netease.mmc.demo.httpdao.vcloud.dto;

/**
 * 直播频道状态DTO.
 *
 * @author hzwanglin1
 * @date 2017/6/6
 * @since 1.0
 */
public class ChannelStatusDTO {
    /**
     * 创建频道的时间戳
     */
    private Long ctime;

    /**
     * 频道ID，32位字符串
     */
    private String cid;

    /**
     * 频道名称
     */
    private String name;

    /**
     * 频道状态（0：空闲； 1：直播； 2：禁用； 3：直播录制）
     */
    private Integer status;

    /**
     * 频道类型 ( 0 : rtmp, 1 : hls, 2 : http)
     */
    private Integer type;

    /**
     * 用户ID，是用户在网易云视频与通信业务的标识，用于与其他用户的业务进行区分。通常，用户不需关注和使用。
     */
    private Long uid;

    /**
     * 1-开启录制； 0-关闭录制
     */
    private Integer needRecord;

    /**
     * 1-flv； 0-mp4
     */
    private Integer format;

    /**
     * 录制切片时长(分钟)，默认120分钟
     */
    private Integer duration;

    /**
     * 录制后文件名
     */
    private String filename;

    public Long getCtime() {
        return ctime;
    }

    public void setCtime(Long ctime) {
        this.ctime = ctime;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getUid() {
        return uid;
    }

    public void setUid(Long uid) {
        this.uid = uid;
    }

    public Integer getNeedRecord() {
        return needRecord;
    }

    public void setNeedRecord(Integer needRecord) {
        this.needRecord = needRecord;
    }

    public Integer getFormat() {
        return format;
    }

    public void setFormat(Integer format) {
        this.format = format;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("ChannelStatusDTO{");
        sb.append("ctime=").append(ctime);
        sb.append(", cid='").append(cid).append('\'');
        sb.append(", name='").append(name).append('\'');
        sb.append(", status=").append(status);
        sb.append(", type=").append(type);
        sb.append(", uid=").append(uid);
        sb.append(", needRecord=").append(needRecord);
        sb.append(", format=").append(format);
        sb.append(", duration=").append(duration);
        sb.append(", filename='").append(filename).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
