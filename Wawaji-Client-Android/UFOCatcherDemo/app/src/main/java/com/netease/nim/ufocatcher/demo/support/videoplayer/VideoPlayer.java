package com.netease.nim.ufocatcher.demo.support.videoplayer;

import android.content.Context;
import android.os.Handler;
import android.view.View;

import com.netease.neliveplayer.sdk.NELivePlayer;
import com.netease.nim.ufocatcher.demo.common.log.LogUtil;

public class VideoPlayer {
    public interface VideoPlayerProxy {
        boolean isDisconnected();

        void onError();

        void onCompletion();

        void onPrepared();

        void onInfo(NELivePlayer mp, int what, int extra);
    }

    private final String TAG = "NEVideoPlayer";

    public static final int VIDEO_ERROR_REOPEN_TIMEOUT = 10 * 1000;
    public static final int VIDEO_COMPLETED_REOPEN_TIMEOUT = 30 * 1000;

    private VideoPlayerProxy proxy;
    private NEVideoView videoView;
    private Handler handler;

    private String videoPath; // 拉流地址
    private boolean pauseInBackgroud = true;
    private boolean isHardWare = false;
    private boolean isMute = false; // 播放时是否禁音

    public VideoPlayer(Context context, NEVideoView videoView, String videoPath,
                       int bufferStrategy, VideoPlayerProxy proxy, int videoScaleMode, boolean isMute) {
        this.handler = new Handler(context.getMainLooper());
        this.videoView = videoView;
        this.videoPath = videoPath;
        this.proxy = proxy;
        this.isMute = isMute;

        videoView.setVideoPath(videoPath);
        videoView.setBufferStrategy(bufferStrategy); //直播低延时/抗抖动
        videoView.setMediaType("livestream");
//        videoView.setMediaController(mMediaController, videoScaleMode);
        videoView.setHardwareDecoder(isHardWare);// 硬件解码还是软件解码
//        videoView.setPauseInBackground(pauseInBackgroud);
        videoView.setOnErrorListener(onVideoErrorListener);
        videoView.setOnPreparedListener(onVideoPreparedListener);
        videoView.setOnCompletionListener(onCompletionListener);
        videoView.setOnInfoListener(onInfoListener);
        videoView.setVisibility(View.VISIBLE);
        videoView.setMute(isMute);
    }

    public void onActivityResume() {
        if (pauseInBackgroud && videoView != null && !videoView.isPaused()) {
            videoView.start(); //锁屏打开后恢复播放
        }
    }

    public void onActivityPause() {
        if (pauseInBackgroud && videoView != null) {
            videoView.pause(); //锁屏时暂停
        }
    }

    public void resetVideo() {
        clearReopenVideoTask();
        resetResource();
    }

    public void resetResource() {
        if (videoView != null) {
            videoView.release();
        }
    }

    // start
    public void openVideo() {
        clearReopenVideoTask();
        videoView.requestFocus();
        videoView.start();
        LogUtil.i(TAG, "open video, path=" + videoPath);
    }

    public void switchContentUrl(String url) {
        if (videoView != null) {
            videoView.switchContentUrl(url);
        }
    }

    // onPrepared
    private NELivePlayer.OnPreparedListener onVideoPreparedListener = new NELivePlayer.OnPreparedListener() {
        @Override
        public void onPrepared(NELivePlayer neLivePlayer) {
            LogUtil.i(TAG, "video on prepared");

            if (proxy != null) {
                proxy.onPrepared(); // 视频已经准备好了
            }
        }
    };

    // onError
    private NELivePlayer.OnErrorListener onVideoErrorListener = new NELivePlayer.OnErrorListener() {
        @Override
        public boolean onError(NELivePlayer neLivePlayer, int i, int i1) {
            LogUtil.i(TAG, "video on error, post delay reopen task, delay " + VIDEO_ERROR_REOPEN_TIMEOUT);

            if (proxy != null) {
                proxy.onError();
            }

            postReopenVideoTask(VIDEO_ERROR_REOPEN_TIMEOUT);
            return true;
        }
    };

    // onCompletion
    private NELivePlayer.OnCompletionListener onCompletionListener = new NELivePlayer.OnCompletionListener() {
        @Override
        public void onCompletion(NELivePlayer neLivePlayer) {
            LogUtil.i(TAG, "video on completed, post delay reopen task, delay " + VIDEO_COMPLETED_REOPEN_TIMEOUT);

            if (proxy != null) {
                proxy.onCompletion();
            }
            postReopenVideoTask(VIDEO_COMPLETED_REOPEN_TIMEOUT);
        }
    };

    private NELivePlayer.OnInfoListener onInfoListener = new NELivePlayer.OnInfoListener() {
        @Override
        public boolean onInfo(NELivePlayer neLivePlayer, int i, int i1) {
            LogUtil.i(TAG, "video on info, what:" + i);

            if (proxy != null) {
                proxy.onInfo(neLivePlayer, i, i1);
            }
            return false;
        }
    };

    private Runnable reopenVideoRunnable = new Runnable() {
        @Override
        public void run() {
            if (proxy != null && proxy.isDisconnected()) {
                LogUtil.i(TAG, "reopen video task run but disconnected");
                return;
            }

            LogUtil.i(TAG, "reopen video task run");
            openVideo();
        }
    };

    public void postReopenVideoTask(long time) {
        handler.postDelayed(reopenVideoRunnable, time); // 开启reopen定时器
    }

    private void clearReopenVideoTask() {
        LogUtil.i(TAG, "clear reopen task");
        handler.removeCallbacks(reopenVideoRunnable);
    }
}
