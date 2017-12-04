package com.netease.nim.ufocatcher.demo.protocol;

import android.text.TextUtils;

import com.alibaba.fastjson.JSONObject;
import com.netease.nim.ufocatcher.demo.app.AppCache;
import com.netease.nim.ufocatcher.demo.common.log.LogUtil;
import com.netease.nim.ufocatcher.demo.protocol.model.JsonObject2Model;
import com.netease.nim.ufocatcher.demo.protocol.model.PCNotification;
import com.netease.nimlib.sdk.NIMSDK;
import com.netease.nimlib.sdk.Observer;
import com.netease.nimlib.sdk.RequestCallbackWrapper;
import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;
import com.netease.nimlib.sdk.msg.model.CustomNotification;

/**
 * 与PC机器的控制指令，用于切换PC客户端的推流的视频采集设备及下发PC机器抓娃娃指令。
 * <p>
 * Created by huangjun on 2017/11/21.
 */

public class PCController {
    private static final String COMMAND = "command";
    private static final String DATA = "data";

    private static final String camera0DirectionCommand[] = {"", "up", "down", "left", "right"};
    private static final String camera1DirectionCommand[] = {"", "left", "right", "down", "up"};
    private static final String cameraDirectionAllCommands[][] = {camera0DirectionCommand, camera1DirectionCommand};

    private String pcAccount;
    private Observer<PCNotification> observer;

    public void init(String pcAccount) {
        this.pcAccount = pcAccount;
        NIMSDK.getMsgServiceObserve().observeCustomNotification(customNotificationObserver, true);
        LogUtil.app("PCController init, pc account=" + pcAccount);
    }

    public void destroy() {
        NIMSDK.getMsgServiceObserve().observeCustomNotification(customNotificationObserver, false);
        LogUtil.app("PCController destroy");
    }

    public static class Builder {
        private static String buildCommand(int command, Object data) {
            JSONObject obj = new JSONObject();
            obj.put(COMMAND, command);
            if (data != null) {
                obj.put(DATA, data);
            }

            return obj.toString();
        }

        public static String buildUPCommand(int cameraId) {
            return buildCommand(1, cameraDirectionAllCommands[cameraId][1]);
        }

        public static String buildDownCommand(int cameraId) {
            return buildCommand(1, cameraDirectionAllCommands[cameraId][2]);
        }

        public static String buildLeftCommand(int cameraId) {
            return buildCommand(1, cameraDirectionAllCommands[cameraId][3]);
        }

        public static String buildRightCommand(int cameraId) {
            return buildCommand(1, cameraDirectionAllCommands[cameraId][4]);
        }

        public static String buildFuckCommand() {
            return buildCommand(2, null);
        }

        public static String buildSwitchToCamera1() {
            return buildCommand(3, 1);
        }

        public static String buildSwitchToCamera2() {
            return buildCommand(3, 2);
        }
    }

    public void sendCommandToPC(String command, RequestCallbackWrapper<Void> callback) {
        CustomNotification notification = new CustomNotification();
        notification.setFromAccount(AppCache.getLoginInfo().getAccount());
        notification.setSessionId(pcAccount);
        notification.setSessionType(SessionTypeEnum.P2P);
        notification.setSendToOnlineUserOnly(true);
        notification.setContent(command);

        NIMSDK.getMsgService().sendCustomNotification(notification).setCallback(callback);
    }

    public void observePCNotification(Observer<PCNotification> observer, boolean register) {
        if (observer == null) {
            return;
        }

        this.observer = register ? observer : null;
    }

    // 游戏事件通知
    private Observer<CustomNotification> customNotificationObserver = (customNotification) -> {
        if (!customNotification.getFromAccount().equals(pcAccount) || TextUtils.isEmpty(customNotification.getContent())) {
            return;
        }

        String jsonStr = customNotification.getContent();
        PCNotification notification = (PCNotification) JsonObject2Model.parseJsonToModule(jsonStr, PCNotification.class);
        LogUtil.app("receive PCNotification=" + notification);

        if (observer != null && notification.getCommand() != PCNotification.COMMAND_UNKNOWN) {
            observer.onEvent(notification);
        }
    };
}
