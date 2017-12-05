package com.netease.mmc.demo.dao.domain;

import java.io.Serializable;
import java.util.Date;

/**
 * This class corresponds to the database table demo_dolls_live
 */
public class DollsLiveDO implements Serializable {
    /**
     * Database Table : demo_dolls_live; 
     * Database Column : id; 
     */
    private Long id;

    /**
     * Database Table : demo_dolls_live; 
     * Database Column : cid; 
     * Database Column Remarks : 
     *   频道ID，32位字符串
     */
    private String cid;

    /**
     * Database Table : demo_dolls_live; 
     * Database Column : name; 
     * Database Column Remarks : 
     *   频道名称，64位字符
     */
    private String name;

    /**
     * Database Table : demo_dolls_live; 
     * Database Column : type; 
     * Database Column Remarks : 
     *   频道类型，0-rtmp, 1-hls, 2-http
     */
    private Integer type;

    /**
     * Database Table : demo_dolls_live; 
     * Database Column : push_url; 
     * Database Column Remarks : 
     *   推流地址
     */
    private String pushUrl;

    /**
     * Database Table : demo_dolls_live; 
     * Database Column : http_pull_url; 
     * Database Column Remarks : 
     *   http拉流地址
     */
    private String httpPullUrl;

    /**
     * Database Table : demo_dolls_live; 
     * Database Column : hls_pull_url; 
     * Database Column Remarks : 
     *   hls拉流地址
     */
    private String hlsPullUrl;

    /**
     * Database Table : demo_dolls_live; 
     * Database Column : rtmp_pull_url; 
     * Database Column Remarks : 
     *   rtmp拉流地址
     */
    private String rtmpPullUrl;

    /**
     * Database Table : demo_dolls_live; 
     * Database Column : created_at; 
     * Database Column Remarks : 
     *   创建时间
     */
    private Date createdAt;

    /**
     * Database Table : demo_dolls_live; 
     * Database Column : updated_at; 
     * Database Column Remarks : 
     *   更新时间
     */
    private Date updatedAt;

    private static final long serialVersionUID = 1L;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append("{");
        sb.append(", id=").append(id);
        sb.append(", cid=").append(cid);
        sb.append(", name=").append(name);
        sb.append(", type=").append(type);
        sb.append(", pushUrl=").append(pushUrl);
        sb.append(", httpPullUrl=").append(httpPullUrl);
        sb.append(", hlsPullUrl=").append(hlsPullUrl);
        sb.append(", rtmpPullUrl=").append(rtmpPullUrl);
        sb.append(", createdAt=").append(createdAt);
        sb.append(", updatedAt=").append(updatedAt);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("}");
        return sb.toString();
    }
}