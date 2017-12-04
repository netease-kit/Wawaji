package com.netease.nim.ufocatcher.demo.support.avchat;

import android.content.Context;
import android.media.AudioManager;

import com.netease.nim.ufocatcher.demo.common.log.LogUtil;

/**
 * Created by huangjun on 2017/11/24.
 */

public class MediaPlayer {

    private android.media.MediaPlayer player;

    public synchronized void play(Context context, int audioResId, boolean looping) {
        stop();

        player = android.media.MediaPlayer.create(context, audioResId);
        player.setAudioStreamType(AudioManager.STREAM_MUSIC);
        player.setLooping(looping);
        player.start();
        LogUtil.app("media player start...");
    }

    public synchronized void stop() {
        if (player != null) {
            player.stop();
            player.release();
            player = null;
            LogUtil.app("media player stop and release!");
        }
    }

    public synchronized void pause() {
        if (player != null && player.isPlaying()) {
            LogUtil.app("media player pause");
            player.pause();
        }
    }

    public synchronized void resume() {
        if (player != null && !player.isPlaying()) {
            LogUtil.app("media player resume");
            player.start();
        }
    }

    public synchronized void mute(boolean mute) {
        if (player != null) {
            float volume = mute ? 0.0f : 1.0f;
            player.setVolume(volume, volume);
            LogUtil.app("media player set volume=" + (int) volume);
        }
    }

    /**
     * ******************************* single instance *******************************
     */
    private static MediaPlayer instance;

    public static synchronized MediaPlayer getInstance() {
        if (instance == null) {
            instance = new MediaPlayer();
        }

        return instance;
    }
}
