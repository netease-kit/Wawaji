package com.netease.mmc.demo.dao.domain;

import java.io.Serializable;
import java.util.Date;

/**
 * This class corresponds to the database table demo_dolls_room
 */
public class DollsRoomDO implements Serializable {
    /**
     * Database Table : demo_dolls_room; 
     * Database Column : id; 
     * Database Column Remarks : 
     *   主键ID
     */
    private Long id;

    /**
     * Database Table : demo_dolls_room; 
     * Database Column : room_id; 
     * Database Column Remarks : 
     *   聊天室房间号
     */
    private Long roomId;

    /**
     * Database Table : demo_dolls_room; 
     * Database Column : creator; 
     * Database Column Remarks : 
     *   房主账号
     */
    private String creator;

    /**
     * Database Table : demo_dolls_room; 
     * Database Column : creator_token; 
     * Database Column Remarks : 
     *   房主IM token
     */
    private String creatorToken;

    /**
     * Database Table : demo_dolls_room; 
     * Database Column : name; 
     * Database Column Remarks : 
     *   房间名称
     */
    private String name;

    /**
     * Database Table : demo_dolls_room; 
     * Database Column : is_public; 
     * Database Column Remarks : 
     *   是否为公共聊天室，0-不是；1-是
     */
    private Boolean isPublic;

    /**
     * Database Table : demo_dolls_room; 
     * Database Column : live_config; 
     * Database Column Remarks : 
     *   直播配置信息
     */
    private DollsLiveConfigDO liveConfig;

    /**
     * Database Table : demo_dolls_room; 
     * Database Column : created_at; 
     * Database Column Remarks : 
     *   创建时间
     */
    private Date createdAt;

    /**
     * Database Table : demo_dolls_room; 
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

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public DollsLiveConfigDO getLiveConfig() {
        return liveConfig;
    }

    public void setLiveConfig(DollsLiveConfigDO liveConfig) {
        this.liveConfig = liveConfig;
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
        sb.append(", roomId=").append(roomId);
        sb.append(", creator=").append(creator);
        sb.append(", creatorToken=").append(creatorToken);
        sb.append(", name=").append(name);
        sb.append(", isPublic=").append(isPublic);
        sb.append(", liveConfig=").append(liveConfig);
        sb.append(", createdAt=").append(createdAt);
        sb.append(", updatedAt=").append(updatedAt);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("}");
        return sb.toString();
    }
}