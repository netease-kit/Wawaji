package com.netease.nim.ufocatcher.demo.protocol.model;

import com.netease.nim.ufocatcher.demo.common.annotation.KeepMemberNames;

import java.io.Serializable;

/**
 * Created by huangjun on 2017/11/20.
 */
@KeepMemberNames
public class RoomInfo implements Serializable {
    private String roomId;
    private String name;
    private String creator;
    private String rtmpPullUrl1;
    private String rtmpPullUrl2;
    private int liveStatus;
    private boolean roomStatus;
    private int onlineUserCount;
    private int queueCount;

    public String getRoomId() {
        return roomId;
    }

    public String getName() {
        return name;
    }

    public String getCreator() {
        return creator;
    }

    public String getRtmpPullUrl1() {
        return rtmpPullUrl1;
    }

    public String getRtmpPullUrl2() {
        return rtmpPullUrl2;
    }

    public int getLiveStatus() {
        return liveStatus;
    }

    public boolean isRoomStatus() {
        return roomStatus;
    }

    public int getOnlineUserCount() {
        return onlineUserCount;
    }

    public int getQueueCount() {
        return queueCount;
    }

    public static RoomInfo createFakeRoomInfo(String roomId, String name) {
        RoomInfo r = new RoomInfo();
        r.roomId = roomId;
        r.name = name;
        return r;
    }
}
