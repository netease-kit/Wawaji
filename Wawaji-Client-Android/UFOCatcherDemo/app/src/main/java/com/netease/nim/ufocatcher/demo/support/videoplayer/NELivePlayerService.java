package com.netease.nim.ufocatcher.demo.support.videoplayer;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.netease.neliveplayer.sdk.NELivePlayer;

/**
 * Created by netease on 17/4/6.
 */
public class NELivePlayerService extends Service {
    private static NELivePlayer sMediaPlayer;

    public static Intent newIntent(Context context) {
        Intent intent = new Intent(context, NELivePlayerService.class);
        return intent;
    }

    public static void intentToStart(Context context) {
        context.startService(newIntent(context));
    }

    public static void intentToStop(Context context) {
        context.stopService(newIntent(context));
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    public static void setMediaPlayer(NELivePlayer mp) {
        if (sMediaPlayer != null && sMediaPlayer != mp) {
            if (sMediaPlayer.isPlaying())
                sMediaPlayer.stop();
            sMediaPlayer.release();
            sMediaPlayer = null;
        }
        sMediaPlayer = mp;
    }

    public static NELivePlayer getMediaPlayer() {
        return sMediaPlayer;
    }
}
