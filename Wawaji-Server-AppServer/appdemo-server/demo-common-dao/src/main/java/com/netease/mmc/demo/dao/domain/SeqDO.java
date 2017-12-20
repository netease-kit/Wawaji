package com.netease.mmc.demo.dao.domain;

import java.io.Serializable;

/**
 * This class corresponds to the database table demo_seq
 */
public class SeqDO implements Serializable {
    /**
     * Database Table : demo_seq; 
     * Database Column : id; 
     */
    private Long id;

    private static final long serialVersionUID = 1L;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append("{");
        sb.append(", id=").append(id);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("}");
        return sb.toString();
    }
}