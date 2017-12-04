package com.netease.nim.ufocatcher.demo.protocol;

/**
 * Created by huangjun on 2017/11/19.
 */

public final class Servers {

    private final static boolean SERVER_ONLINE = true;

    private static final String APP_KEY_ONLINE = "682a4df6d71da43ce09787dceb502987";
    private static final String APP_KEY_TEST = "d410bc0ebc78d587b723a83d44f09c9f";

    private final static String SERVER_ADDRESS_ONLINE = "https://app.netease.im/appdemo";
    private final static String SERVER_ADDRESS_TEST = "http://apptest.netease.im/appdemo";

    private static boolean isOnlineEnvironment() {
        return SERVER_ONLINE;
    }

    static String getServerAddress() {
        return isOnlineEnvironment() ? SERVER_ADDRESS_ONLINE : SERVER_ADDRESS_TEST;
    }

    public static String getAppKey() {
        return isOnlineEnvironment() ? APP_KEY_ONLINE : APP_KEY_TEST;
    }
}
