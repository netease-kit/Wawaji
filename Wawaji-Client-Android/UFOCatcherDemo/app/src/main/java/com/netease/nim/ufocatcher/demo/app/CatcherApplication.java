package com.netease.nim.ufocatcher.demo.app;

import android.app.Application;
import android.util.Log;

import com.netease.nim.ufocatcher.demo.app.crash.AppCrashHandler;
import com.netease.nim.ufocatcher.demo.common.log.LogUtil;
import com.netease.nim.ufocatcher.demo.common.utils.StorageUtil;
import com.netease.nim.ufocatcher.demo.protocol.Servers;
import com.netease.nimlib.sdk.NIMClient;
import com.netease.nimlib.sdk.SDKOptions;
import com.netease.nimlib.sdk.util.NIMUtil;

public class CatcherApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        NIMClient.init(this, null, getSDKOptions());

        if (NIMUtil.isMainProcess(this)) {
            initMainProcess();
        }
    }

    private SDKOptions getSDKOptions() {
        SDKOptions options = new SDKOptions();
        options.appKey = Servers.getAppKey();
        options.reducedIM = true;
        options.asyncInitSDK = true;
        options.sdkStorageRootPath = StorageUtil.getAppCacheDir(getApplicationContext()) + "/nim"; // 可以不设置，那么将采用默认路径

        return options;
    }

    private void initMainProcess() {
        AppCache.setContext(getApplicationContext());

        final String logDir = StorageUtil.getAppCacheDir(getApplicationContext()) + "/app/log";
        AppCrashHandler.init(this, logDir);
        LogUtil.init(logDir, Log.DEBUG);
    }
}
