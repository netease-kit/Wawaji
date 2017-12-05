package com.netease.mmc.demo.dao.domain;

import java.io.Serializable;
import java.util.Date;

/**
 * This class corresponds to the database table demo_user
 */
public class UserDO implements Serializable {
    /**
     * Database Table : demo_user; 
     * Database Column : id; 
     * Database Column Remarks : 
     *   主键ID
     */
    private Long id;

    /**
     * Database Table : demo_user; 
     * Database Column : accid; 
     * Database Column Remarks : 
     *   用户账号
     */
    private String accid;

    /**
     * Database Table : demo_user; 
     * Database Column : nickname; 
     * Database Column Remarks : 
     *   用户昵称
     */
    private String nickname;

    /**
     * Database Table : demo_user; 
     * Database Column : password; 
     * Database Column Remarks : 
     *   密码
     */
    private String password;

    /**
     * Database Table : demo_user; 
     * Database Column : phone; 
     * Database Column Remarks : 
     *   电话
     */
    private String phone;

    /**
     * Database Table : demo_user; 
     * Database Column : im_token; 
     * Database Column Remarks : 
     *   im token
     */
    private String imToken;

    /**
     * Database Table : demo_user; 
     * Database Column : vod_token; 
     * Database Column Remarks : 
     *   点播token
     */
    private String vodToken;

    /**
     * Database Table : demo_user; 
     * Database Column : created_at; 
     * Database Column Remarks : 
     *   创建时间
     */
    private Date createdAt;

    /**
     * Database Table : demo_user; 
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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
        sb.append(", accid=").append(accid);
        sb.append(", nickname=").append(nickname);
        sb.append(", password=").append(password);
        sb.append(", phone=").append(phone);
        sb.append(", imToken=").append(imToken);
        sb.append(", vodToken=").append(vodToken);
        sb.append(", createdAt=").append(createdAt);
        sb.append(", updatedAt=").append(updatedAt);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("}");
        return sb.toString();
    }
}