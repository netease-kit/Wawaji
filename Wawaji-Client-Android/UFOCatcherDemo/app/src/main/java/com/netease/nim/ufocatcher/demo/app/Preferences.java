package com.netease.nim.ufocatcher.demo.app;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by huangjun on 2017/11/20.
 */

public class Preferences {

    private final static String KEY_ACCOUNT = "KEY_ACCOUNT";

    static void saveAccount(String config) {
        saveString(KEY_ACCOUNT, config);
    }

    public static String getAccount() {
        return getString(KEY_ACCOUNT);
    }

    private static void saveString(String key, String value) {
        SharedPreferences.Editor editor = getSharedPreferences().edit();
        editor.putString(key, value);
        editor.apply();
    }

    private static String getString(String key) {
        return getSharedPreferences().getString(key, null);
    }

    private static SharedPreferences getSharedPreferences() {
        return AppCache.getContext().getSharedPreferences("APP_CACHE", Context.MODE_PRIVATE);
    }
}
