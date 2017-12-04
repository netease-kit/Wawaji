package com.netease.nim.ufocatcher.demo.app.crash;

import android.content.Context;

import java.lang.Thread.UncaughtExceptionHandler;

/**
 * Created by huangjun on 2017/11/19.
 */

public class AppCrashHandler {

    private UncaughtExceptionHandler uncaughtExceptionHandler;

    private static AppCrashHandler instance;

    private AppCrashHandler(Context context, String logDir) {
        // get default
        uncaughtExceptionHandler = Thread.getDefaultUncaughtExceptionHandler();

        // install
        Thread.setDefaultUncaughtExceptionHandler((thread, ex) -> {
            // save log
            CrashSaver.save(context, logDir, ex);

            // uncaught
            uncaughtExceptionHandler.uncaughtException(thread, ex);
        });
    }

    public static AppCrashHandler init(Context mContext, String logDir) {
        if (instance == null) {
            instance = new AppCrashHandler(mContext, logDir);
        }

        return instance;
    }
}
