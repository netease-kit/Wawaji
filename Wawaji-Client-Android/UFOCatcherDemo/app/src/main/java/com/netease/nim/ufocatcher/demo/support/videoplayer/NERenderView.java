package com.netease.nim.ufocatcher.demo.support.videoplayer;

import android.graphics.SurfaceTexture;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.View;

import com.netease.neliveplayer.sdk.NELivePlayer;

/**
 * Created by netease on 17/4/6.
 */
public interface NERenderView {

    View getView();

    boolean shouldWaitForResize();

    void setVideoSize(int videoWidth, int videoHeight);

    void setVideoSampleAspectRatio(int videoSarNum, int videoSarDen);

    void setAspectRatio(int aspectRatio);

    void addRenderCallback(@NonNull IRenderCallback callback);

    void removeRenderCallback(@NonNull IRenderCallback callback);

    interface ISurfaceHolder {
        void bindToMediaPlayer(NELivePlayer mp);

        @NonNull
        NERenderView getRenderView();

        @Nullable
        SurfaceHolder getSurfaceHolder();

        @Nullable
        Surface openSurface();

        @Nullable
        SurfaceTexture getSurfaceTexture();
    }

    interface IRenderCallback {
        /**
         * @param holder
         * @param width  could be 0
         * @param height could be 0
         */
        void onSurfaceCreated(@NonNull ISurfaceHolder holder, int width, int height);

        /**
         * @param holder
         * @param format could be 0
         * @param width
         * @param height
         */
        void onSurfaceChanged(@NonNull ISurfaceHolder holder, int format, int width, int height);

        void onSurfaceDestroyed(@NonNull ISurfaceHolder holder);
    }
}
