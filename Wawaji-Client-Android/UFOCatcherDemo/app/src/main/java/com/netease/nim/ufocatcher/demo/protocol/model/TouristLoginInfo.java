package com.netease.nim.ufocatcher.demo.protocol.model;

import com.netease.nim.ufocatcher.demo.common.annotation.KeepMemberNames;

/**
 * Created by huangjun on 2017/11/20.
 */

@KeepMemberNames
public class TouristLoginInfo {
    private String accid;
    private String imToken;
    private String nickname;

    public String getAccount() {
        return accid;
    }

    public String getToken() {
        return imToken;
    }

    public String getNickname() {
        return nickname;
    }

    @Override
    public String toString() {
        return "LoginInfo{" +
                "account='" + accid + '\'' +
                ", nickname='" + nickname + '\'' +
                '}';
    }
}