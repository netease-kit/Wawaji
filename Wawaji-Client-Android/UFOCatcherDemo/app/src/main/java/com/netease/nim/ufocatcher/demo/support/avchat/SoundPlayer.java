package com.netease.nim.ufocatcher.demo.support.avchat;

import android.media.AudioManager;
import android.media.SoundPool;

import com.netease.nim.ufocatcher.demo.app.AppCache;

/**
 * Created by huangjun on 2017/11/19
 * <p>
 * SoundPool 铃声尽量不要超过1M
 */
public class SoundPlayer {
    private SoundPool soundPool;
    private int soundId;
    private int streamId;
    private boolean loop;
    private boolean paused;

    public synchronized void play(int audioResId, boolean loop) {
        initSoundPool();
        this.loop = loop;
        soundId = soundPool.load(AppCache.getContext(), audioResId, 1);
        paused = false;
    }

    public synchronized void stop() {
        if (soundPool != null) {
            if (streamId != 0) {
                soundPool.stop(streamId);
                streamId = 0;
            }
            if (soundId != 0) {
                soundPool.unload(soundId);
                soundId = 0;
            }
        }
    }

    public synchronized void pause() {
        if (soundPool != null && streamId != 0 && !paused) {
            soundPool.pause(streamId);
            paused = true;
        }
    }

    public synchronized void resume() {
        if (soundPool != null && streamId != 0 && paused) {
            soundPool.resume(streamId);
            paused = false;
        }
    }

    public synchronized void mute(boolean mute) {
        if (soundPool != null && streamId != 0) {
            float volume = mute ? 0.0f : 1.0f;
            soundPool.setVolume(streamId, volume, volume);
        }
    }

    private void initSoundPool() {
        stop();
        if (soundPool == null) {
            soundPool = new SoundPool(1, AudioManager.STREAM_MUSIC, 0);
            soundPool.setOnLoadCompleteListener(onLoadCompleteListener);
        }
    }

    private SoundPool.OnLoadCompleteListener onLoadCompleteListener = new SoundPool.OnLoadCompleteListener() {
        @Override
        public void onLoadComplete(SoundPool soundPool, int sampleId, int status) {
            if (soundId != 0 && status == 0) {
                streamId = soundPool.play(soundId, 1, 1, 1, loop ? -1 : 0, 1f);
            }
        }
    };

    /**
     * ******************************* single instance *******************************
     */
    private static SoundPlayer instance;

    public static synchronized SoundPlayer getInstance() {
        if (instance == null) {
            instance = new SoundPlayer();
        }

        return instance;
    }
}
