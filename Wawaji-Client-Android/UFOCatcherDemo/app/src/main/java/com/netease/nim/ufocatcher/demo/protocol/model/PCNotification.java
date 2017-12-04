package com.netease.nim.ufocatcher.demo.protocol.model;

import android.text.TextUtils;

import com.netease.nim.ufocatcher.demo.common.annotation.KeepMemberNames;

/**
 * Created by huangjun on 2017/11/24.
 */

@KeepMemberNames
public class PCNotification {
    private static final String PC_NOTIFICATION_GAME_OVER_RESULT = "4";
    private static final String PC_NOTIFICATION_GAME_OVER_RESULT_SUCCESS = "true";
    private static final String PC_NOTIFICATION_GAME_OVER_RESULT_FAILED = "false";
    private static final String PC_NOTIFICATION_OPERATE_ACK = "5";

    public static final int COMMAND_UNKNOWN = 0;
    public static final int COMMAND_GAME_OVER_RESULT_SUCCESS = 1;
    public static final int COMMAND_GAME_OVER_RESULT_FAILED = 2;

    private String command;
    private String data;

    public int getCommand() {
        if (TextUtils.isEmpty(command) || TextUtils.isEmpty(data)) {
            return COMMAND_UNKNOWN;
        }

        if (command.equals(PC_NOTIFICATION_GAME_OVER_RESULT) && data.equals(PC_NOTIFICATION_GAME_OVER_RESULT_SUCCESS)) {
            return COMMAND_GAME_OVER_RESULT_SUCCESS;
        } else if (command.equals(PC_NOTIFICATION_GAME_OVER_RESULT) && data.equals(PC_NOTIFICATION_GAME_OVER_RESULT_FAILED)) {
            return COMMAND_GAME_OVER_RESULT_FAILED;
        }

        return COMMAND_UNKNOWN;
    }

    @Override
    public String toString() {
        return "PCNotification{" +
                "command='" + command + '\'' +
                ", data='" + data + '\'' +
                '}';
    }
}
