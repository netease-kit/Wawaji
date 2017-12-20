package com.netease.mmc.demo.dao.domain;

/**
 * 与娃娃机房间绑定的直播配置信息.
 *
 * @author hzwanglin1
 * @date 2017/11/21
 * @since 1.0
 */
public class DollsLiveConfigDO {
    /**
     * 直播频道1，对应摄像头1
     */
    private String cid1;

    /**
     * 直播频道2，对应摄像头2
     */
    private String cid2;

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

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("DollsLiveConfigDO{");
        sb.append("cid1='").append(cid1).append('\'');
        sb.append(", cid2='").append(cid2).append('\'');
        sb.append('}');
        return sb.toString();
    }
}