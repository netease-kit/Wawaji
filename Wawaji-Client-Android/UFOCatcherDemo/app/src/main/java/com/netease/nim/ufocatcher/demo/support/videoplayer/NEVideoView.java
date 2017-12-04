
package com.netease.nim.ufocatcher.demo.support.videoplayer;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.NonNull;
import android.util.AttributeSet;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.netease.neliveplayer.sdk.NELivePlayer;
import com.netease.neliveplayer.sdk.NELivePlayer.OnCompletionListener;
import com.netease.neliveplayer.sdk.NELivePlayer.OnErrorListener;
import com.netease.neliveplayer.sdk.NELivePlayer.OnInfoListener;
import com.netease.neliveplayer.sdk.NELivePlayer.OnPreparedListener;
import com.netease.neliveplayer.sdk.NELivePlayer.OnVideoParseErrorListener;
import com.netease.neliveplayer.sdk.NELivePlayer.OnVideoSizeChangedListener;
import com.netease.neliveplayer.sdk.NEMediaInfo;
import com.netease.neliveplayer.sdk.constant.NEType;
import com.netease.nim.ufocatcher.demo.common.log.LogUtil;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class NEVideoView extends FrameLayout {
    private final static String TAG = NEVideoView.class.getSimpleName();
    // settable by the client
    private Uri mUri;

    //states refer to MediaPlayer
    private static final int IDLE = 0;
    private static final int INITIALIZED = 1;
    private static final int PREPARING = 2;
    private static final int PREPARED = 3;
    private static final int STARTED = 4;
    private static final int PAUSED = 5;
    private static final int STOPED = 6;
    private static final int PLAYBACKCOMPLETED = 7;
    private static final int END = 8;
    private static final int RESUME = 9;
    private static final int ERROR = -1;

    private int mCurrState = IDLE;
    private int mNextState = IDLE;

    private int mVideoScalingMode = VIDEO_SCALING_MODE_FIT;
    public static final int VIDEO_SCALING_MODE_NONE = 0; // 原始大小
    public static final int VIDEO_SCALING_MODE_FIT = 1; // 按比例拉伸，有一边会贴黑边
    public static final int VIDEO_SCALING_MODE_FILL = 2; // 全屏，画面可能会变形
    public static final int VIDEO_SCALING_MODE_FULL = 3; // 按比例拉伸至全屏，有一边会被裁剪

    // All the stuff we need for playing and showing a video
    private NERenderView.ISurfaceHolder mSurfaceHolder = null;
    public NESurfaceRenderView renderView;
    private NELivePlayer mLivePlayer = null;
    private int mVideoWidth;
    private int mVideoHeight;
    private int mSurfaceWidth;
    private int mSurfaceHeight;
    private OnCompletionListener mOnCompletionListener;
    private OnPreparedListener mOnPreparedListener;
    private int mCurrentBufferPercentage;
    private OnErrorListener mOnErrorListener;
    private OnInfoListener mOnInfoListener;
    private OnVideoParseErrorListener mOnVideoParseErrorListener;
    private boolean mCanPause = true;

    private Context mContext;
    private NERenderView mRenderView;
    private int mVideoSarNum;
    private int mVideoSarDen;

    private View mBuffer;
    private int mBufferStrategy = NEType.NELPLOWDELAY; //直播低延时
    private String mMediaType;
    private boolean isFirstCreate = true;
    private boolean isBackground = false;
    private boolean mHardwareDecoder = false;
    private boolean mMute = false;
    private boolean manualPause = false;
    private boolean mEnableBackgroundPlay = true;

    private boolean mIsPrepared;
//    private Handler handler;

    public NEVideoView(Context context) {
        super(context);
        mContext = context;
        initVideoView(context);
    }

    public NEVideoView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mContext = context;
        initVideoView(context);
    }

    public NEVideoView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        mContext = context;
        initVideoView(context);
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public NEVideoView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        mContext = context;
        initVideoView(context);
    }


    private void initVideoView(Context context) {
//        handler = new Handler();
//        initBackground();
        initRenderView();

        mVideoWidth = 0;
        mVideoHeight = 0;

        setFocusable(true);
        setFocusableInTouchMode(true);
        requestFocus();

        mCurrState = IDLE;
        mNextState = IDLE;
    }

    public void initRenderView() {
        renderView = new NESurfaceRenderView(getContext());

        if (mRenderView != null) {
            if (mLivePlayer != null)
                mLivePlayer.setDisplay(null);

            View renderUIView = mRenderView.getView();
            mRenderView.removeRenderCallback(mSHCallback);
            mRenderView = null;
            removeView(renderUIView);
        }

        if (renderView == null)
            return;

        mRenderView = renderView;
        renderView.setAspectRatio(mVideoScalingMode);
        if (mVideoWidth > 0 && mVideoHeight > 0)
            renderView.setVideoSize(mVideoWidth, mVideoHeight);
        if (mVideoSarNum > 0 && mVideoSarDen > 0)
            renderView.setVideoSampleAspectRatio(mVideoSarNum, mVideoSarDen);

        View renderUIView = mRenderView.getView();
        LayoutParams lp = new LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT,
                Gravity.CENTER);
        renderUIView.setLayoutParams(lp);
        addView(renderUIView);

        mRenderView.addRenderCallback(mSHCallback);
    }

    public ViewGroup.LayoutParams getRenderViewLayoutParams() {
        return renderView.getLayoutParams();
    }

    public void setRenderViewLayoutParams(ViewGroup.LayoutParams params) {
        renderView.setLayoutParams(params);
    }

    public void setZOrderMediaOverlay(boolean overlay) {
        if (renderView != null) {
            renderView.setZOrderMediaOverlay(overlay);
        }
    }

    public void setZOrderOnTop(boolean onTop) {
        if (renderView != null) {
            renderView.setZOrderOnTop(onTop);
        }
    }

    /**
     * Sets video path.
     *
     * @param path the path of the video.
     */
    public void setVideoPath(String path) {
        isBackground = false; //指示是否在后台
        initBackground();
        setVideoURI(Uri.parse(path));
    }

    /**
     * Sets video URI.
     *
     * @param uri the URI of the video.
     */
    public void setVideoURI(Uri uri) {
        mUri = uri;
        openVideo();
        requestLayout();
        invalidate();
    }

    @TargetApi(Build.VERSION_CODES.M)
    private void openVideo() {
        if (mUri == null || mSurfaceHolder == null) {
            // not ready for playback just yet, will try again later
            return;
        }

        LogUtil.i(TAG, "open video");
        Intent i = new Intent("com.android.music.musicservicecommand");
        i.putExtra("command", "pause");
        mContext.sendBroadcast(i);

        if (mLivePlayer != null) {
            mLivePlayer.reset();
            mLivePlayer.release();
            mLivePlayer = null;
        }

        mLivePlayer = NELivePlayer.create(mContext);
        mLivePlayer.setBufferStrategy(mBufferStrategy);
        mLivePlayer.setShouldAutoplay(false);
        mLivePlayer.setHardwareDecoder(mHardwareDecoder);
        mLivePlayer.setOnPreparedListener(mPreparedListener);
        mIsPrepared = false;

        mLivePlayer.setOnVideoSizeChangedListener(mSizeChangedListener);
        mLivePlayer.setOnCompletionListener(mCompletionListener);
        mLivePlayer.setOnErrorListener(mErrorListener);
        mLivePlayer.setOnInfoListener(mInfoListener);
        mLivePlayer.setOnVideoParseErrorListener(mVideoParseErrorListener);

        mCurrentBufferPercentage = 0;

//        播放器接口支持子线程调用，如果需要支持清晰度切换，那么setDataSource会执行同步耗时操作，会卡住UI，
//        所以可以打开下面的代码将setDataSource和prepareAsync的操作放到子线程中避免卡住UI,
//        同时需要将attachMediaController通过handler放到主线程中调用
//        new Thread(new Runnable() {
//            @Override
//            public void run() {
        try {
            if (mUri != null) {

                mLivePlayer.setPlaybackTimeout(30 * 1000);
                bindSurfaceHolder(mLivePlayer, mSurfaceHolder); // setDisplay在这里面调用
                mLivePlayer.setScreenOnWhilePlaying(true);

                boolean ret = mLivePlayer.setDataSource(mUri.toString());
                if (!ret) {
                    if (getWindowToken() != null && mMediaType.equals("livestream")) {
                        new AlertDialog.Builder(mContext)
                                .setTitle("error")
                                .setMessage("地址非法，请输入网易视频云官方地址！")
                                .setPositiveButton("OK",
                                        new DialogInterface.OnClickListener() {
                                            public void onClick(DialogInterface dialog, int whichButton) {
                                        /* If we get here, there is no onError listener, so
                                         * at least inform them that the video is over.
                                         */
                                                if (mOnCompletionListener != null)
                                                    mOnCompletionListener.onCompletion(mLivePlayer);
                                            }
                                        })
                                .setCancelable(false)
                                .show();
                    }
                    release();
                    return;
                }
                mCurrState = IDLE;
                mNextState = PREPARING;
            }

            /**
             * 以下为flv点播加密视频的解密模块调用的示例代码，仅供参考,开发者可以将下面的注释代码打开
             */
                    /*
                        if (mUri.toString().contains("vod.126.net") && mUri.toString().endsWith("flv")) { // flv点播的加密视频

                            // 下面的四个参数需要开发者自己获取,详见点播相关的服务及API文档
                            String transferToken = "tag=73ae7bec-c612-42e1-871c-14a75463d7ce&time=1490757567&expire=1514736000&nonce=vuwezwpuhcoasnjt&algo=1&checksum=e66bdd685005a868e7185110399d22293760eaa3";
                            String accid = "accid";
                            String appKey = "2f2a7935c3a5412a9a31be60924927f6";
                            String token = "bf99fd83c15916f59c2eb0bf8420b509bf214421";
                            mLivePlayer.initDecryption(transferToken, accid, token, appKey, mDecryptionListener);
                        }
                        else { // 直播或点播非flv格式
                            mLivePlayer.prepareAsync();
                            mCurrState = PREPARING;
                        }
                    */
            //若把上面的注释代码打开,则这两句需要注释掉
            mLivePlayer.prepareAsync();
            mCurrState = PREPARING;

        } catch (IOException ex) {
            Log.w(TAG, "Unable to open content: " + mUri, ex);
            mCurrState = ERROR;
            mNextState = ERROR;
            mErrorListener.onError(mLivePlayer, MediaPlayer.MEDIA_ERROR_UNKNOWN, 0);
        } catch (IllegalArgumentException ex) {
            Log.w(TAG, "Unable to open content: " + mUri, ex);
            mCurrState = ERROR;
            mNextState = ERROR;
            mErrorListener.onError(mLivePlayer, MediaPlayer.MEDIA_ERROR_UNKNOWN, 0);
        }
//            }
//        }).start();
        isFirstCreate = false;
    }

    public void switchContentUrl(String url) {
        if (mLivePlayer != null) {
            mLivePlayer.switchContentUrl(url);
        }
    }

    public void setBufferingIndicator(View buffer) {
        if (mBuffer != null)
            mBuffer.setVisibility(View.GONE);
        mBuffer = buffer;
    }

    NELivePlayer.OnDecryptionListener mDecryptionListener = new NELivePlayer.OnDecryptionListener() {
        @Override
        public void onDecryption(int ret) {
            Log.i(TAG, " ret = " + ret);
            switch (ret) {
                case NEType.NELP_NO_ENCRYPTION:
                case NEType.NELP_ENCRYPTION_CHECK_OK:
                    mLivePlayer.prepareAsync();
                    mCurrState = PREPARING;
                    break;
                case NEType.NELP_ENCRYPTION_UNSUPPORT_PROTOCAL:
                    break;
                case NEType.NELP_ENCRYPTION_KEY_CHECK_ERROR:
                    break;
                case NEType.NELP_ENCRYPTION_INPUT_INVALIED:
                    break;
                case NEType.NELP_ENCRYPTION_GET_KEY_TIMEOUT:
                    break;
                case NEType.NELP_ENCRYPTION_UNKNOWN_ERROR:
                    break;
                default:
                    break;
            }
        }
    };

    OnVideoSizeChangedListener mSizeChangedListener = new OnVideoSizeChangedListener() {
        public void onVideoSizeChanged(NELivePlayer mp, int width, int height, int sarNum, int sarDen) {
            mVideoWidth = mp.getVideoWidth();
            mVideoHeight = mp.getVideoHeight();
            mVideoSarNum = sarNum; //mp.getVideoSarNum();
            mVideoSarDen = sarDen; //mp.getVideoSarDen();
            if (mVideoWidth != 0 && mVideoHeight != 0) {
                if (mRenderView != null) {
                    mRenderView.setVideoSize(mVideoWidth, mVideoHeight);
                    mRenderView.setVideoSampleAspectRatio(mVideoSarNum, mVideoSarDen);
                }
                requestLayout();
            }
        }
    };

    OnPreparedListener mPreparedListener = new OnPreparedListener() {
        public void onPrepared(NELivePlayer mp) {
            LogUtil.i(TAG, "onPrepared");
            mCurrState = PREPARED;
            mNextState = STARTED;
            mIsPrepared = true;

            if (mOnPreparedListener != null) {
                mOnPreparedListener.onPrepared(mLivePlayer);
            }
            mVideoWidth = mp.getVideoWidth();
            mVideoHeight = mp.getVideoHeight();

            if (mVideoWidth != 0 && mVideoHeight != 0) {
                LogUtil.i(TAG, "renderview:" + mRenderView);
                if (mRenderView != null) {
                    LogUtil.i(TAG, "render view");
                    mRenderView.setVideoSize(mVideoWidth, mVideoHeight);
                    mRenderView.setVideoSampleAspectRatio(mVideoSarNum, mVideoSarDen);
                    if (!mRenderView.shouldWaitForResize() || mSurfaceWidth == mVideoWidth && mSurfaceHeight == mVideoHeight) {
                        // We didn't actually change the size (it was already at the size
                        // we need), so we won't get a "surface changed" callback, so
                        // start the video here instead of in the callback.
                        LogUtil.i(TAG, "mNextState:" + mNextState);
                        if (mNextState == STARTED) {
                            LogUtil.i(TAG, "1, prepare start");
                            start();
                        }
                    }
                }
            } else {
                // We don't know the video size yet, but should start anyway.
                // The video size might be reported to us later.
                if (mNextState == STARTED) {
                    if (!isPaused()) {
                        LogUtil.i(TAG, "2, prepare start");
                        start();
                    } else {
                        pause();
                    }
                }
            }
        }
    };

    private OnCompletionListener mCompletionListener = new OnCompletionListener() {
        public void onCompletion(NELivePlayer mp) {
            mCurrState = PLAYBACKCOMPLETED;
            mNextState = PLAYBACKCOMPLETED;
            if (mOnCompletionListener != null) {
                mOnCompletionListener.onCompletion(mLivePlayer);
            }

            if (getWindowToken() != null) {
                new AlertDialog.Builder(mContext)
                        .setTitle("Completed!")
                        .setMessage("播放结束！")
                        .setPositiveButton("OK",
                                new DialogInterface.OnClickListener() {
                                    public void onClick(DialogInterface dialog, int whichButton) {
                                        /* If we get here, there is no onError listener, so
                                         * at least inform them that the video is over.
                                         */
                                        if (mOnCompletionListener != null)
                                            mOnCompletionListener.onCompletion(mLivePlayer);
                                    }
                                })
                        .setCancelable(false)
                        .show();
            }
        }
    };

    private OnErrorListener mErrorListener = new OnErrorListener() {
        public boolean onError(NELivePlayer mp, int what, int extra) {
            Log.d(TAG, "Error: " + what + "," + extra);
            mCurrState = ERROR;
            mNextState = ERROR;

            /* If an error handler has been supplied, use it and finish. */
            if (mOnErrorListener != null) {
                if (mOnErrorListener.onError(mLivePlayer, what, extra)) {
                    return true;
                }
            }

            /* Otherwise, pop up an error dialog so the user knows that
             * something bad has happened. Only try and pop up the dialog
             * if we're attached to a window. When we're going away and no
             * longer have a window, don't bother showing the user an error.
             */
            if (getWindowToken() != null) {
                new AlertDialog.Builder(mContext)
                        .setTitle("Error")
                        .setMessage("There is an unknown error")
                        .setPositiveButton("Ok",
                                new DialogInterface.OnClickListener() {
                                    public void onClick(DialogInterface dialog, int whichButton) {
                                        /* If we get here, there is no onError listener, so
                                         * at least inform them that the video is over.
                                         */
                                        if (mOnCompletionListener != null)
                                            mOnCompletionListener.onCompletion(mLivePlayer);
                                    }
                                })
                        .setCancelable(false)
                        .show();
            }
            return true;
        }
    };

    private OnInfoListener mInfoListener = new OnInfoListener() {
        public boolean onInfo(NELivePlayer mp, int what, int extra) {
            if (mOnInfoListener != null) {
                mOnInfoListener.onInfo(mp, what, extra);
            }
            if (mLivePlayer != null) {
                if (what == NEType.NELP_BUFFERING_START) {
                    Log.i(TAG, "onInfo: NELP_BUFFERING_START");
                    if (mBuffer != null)
                        mBuffer.setVisibility(View.VISIBLE);
                } else if (what == NEType.NELP_BUFFERING_END) {
                    Log.i(TAG, "onInfo: NELP_BUFFERING_END");
                    if (mBuffer != null)
                        mBuffer.setVisibility(View.GONE);
                } else if (what == NEType.NELP_FIRST_VIDEO_RENDERED) {
                    Log.i(TAG, "onInfo: NELP_FIRST_VIDEO_RENDERED");
                } else if (what == NEType.NELP_FIRST_AUDIO_RENDERED) {
                    Log.i(TAG, "onInfo: NELP_FIRST_AUDIO_RENDERED");
                } else if (what == 302) {
                    Log.i(TAG, "onInfo: http pull state 302 ");
                } else if (what == 206) {
                    Log.i(TAG, "onInfo: http pull state 206 ");
                }
            }

            return true;
        }
    };

    private OnVideoParseErrorListener mVideoParseErrorListener = new OnVideoParseErrorListener() {
        public void onVideoParseError(NELivePlayer mp) {
            Log.i(TAG, "onVideoParseError");
        }
    };

    /**
     * Register a callback to be invoked when the media file
     * is loaded and ready to go.
     *
     * @param l The callback that will be run
     */
    public void setOnPreparedListener(OnPreparedListener l) {
        mOnPreparedListener = l;
    }

    /**
     * Register a callback to be invoked when the end of a media file
     * has been reached during playback.
     *
     * @param l The callback that will be run
     */
    public void setOnCompletionListener(OnCompletionListener l) {
        mOnCompletionListener = l;
    }

    /**
     * Register a callback to be invoked when an error occurs
     * during playback or setup.  If no listener is specified,
     * or if the listener returned false, VideoView will inform
     * the user of any errors.
     *
     * @param l The callback that will be run
     */
    public void setOnErrorListener(OnErrorListener l) {
        mOnErrorListener = l;
    }

    /**
     * Register a callback to be invoked when an informational event
     * occurs during playback or setup.
     *
     * @param l The callback that will be run
     */
    public void setOnInfoListener(OnInfoListener l) {
        mOnInfoListener = l;
    }

    public void setOnVideoParseErrorListener(OnVideoParseErrorListener l) {
        mOnVideoParseErrorListener = l;
    }


    // REMOVED: mSHCallback
    private void bindSurfaceHolder(NELivePlayer mp, NERenderView.ISurfaceHolder holder) {
        if (mp == null)
            return;

        if (holder == null) {
            mp.setDisplay(null);
            return;
        }

        holder.bindToMediaPlayer(mp);
    }

    NERenderView.IRenderCallback mSHCallback = new NERenderView.IRenderCallback() {
        @Override
        public void onSurfaceChanged(@NonNull NERenderView.ISurfaceHolder holder, int format, int w, int h) {
            Log.i(TAG, "onSurfaceChanged");
            if (holder.getRenderView() != mRenderView) {
                Log.e(TAG, "onSurfaceChanged: unmatched render callback\n");
                return;
            }

            mSurfaceWidth = w;
            mSurfaceHeight = h;
            boolean isValidState = (mNextState == STARTED);
            boolean hasValidSize = !mRenderView.shouldWaitForResize() || (mVideoWidth == w && mVideoHeight == h);
            if (mLivePlayer != null && isValidState && hasValidSize) {
                LogUtil.i(TAG, "onSurfaceChanged start");
                start();
            }
        }

        @Override
        public void onSurfaceCreated(@NonNull NERenderView.ISurfaceHolder holder, int width, int height) {
            Log.i(TAG, "onSurfaceCreated");
            if (holder.getRenderView() != mRenderView) {
                Log.e(TAG, "onSurfaceCreated: unmatched render callback\n");
                return;
            }

            mSurfaceHolder = holder;
            if (mLivePlayer != null)
                bindSurfaceHolder(mLivePlayer, holder); // 播放器和显示surface绑定

            if (mNextState != RESUME && isFirstCreate) { // 第一次播放
                isFirstCreate = false;
                openVideo();
            } else {
                restorePlayWithForeground();
            }
            isBackground = false; //不在后台
        }

        @Override
        public void onSurfaceDestroyed(@NonNull NERenderView.ISurfaceHolder holder) {
            Log.i(TAG, "onSurfaceDestroyed");
            if (holder.getRenderView() != mRenderView) {
                Log.e(TAG, "onSurfaceDestroyed: unmatched render callback\n");
                return;
            }

            // after we return from this we can't use the surface any more
            mSurfaceHolder = null;

            if (mLivePlayer != null) {
                mLivePlayer.setDisplay(null); // 后台视频不能渲染,需要将surface设置成null

                isBackground = true;
                mNextState = RESUME;
            }
        }
    };


    public void restorePlayWithCall() {
        if (mLivePlayer != null && mLivePlayer.getDuration() > 0) {
            // 点播视频,后台暂停,恢复调start即可
            start();
        } else {
            // 直播视频退到后台直接release,恢复需要重新初始化
            isFirstCreate = true;
            openVideo();
        }
    }

    /**
     * @brief 后台暂停, 若对于直播则需要关闭播放器
     */
    public void stopPlayWithCall() {
        if (mLivePlayer != null && mLivePlayer.getDuration() > 0)
            pause();
        else {
            release();
        }
    }


    public void restorePlayWithForeground() {
        if (isBackground == false) {
            return;
        }
        if (mEnableBackgroundPlay) {
            // 设置了后台播放
            if (mHardwareDecoder) {
                openVideo();
            }

        } else {
            if (mLivePlayer != null && mLivePlayer.getDuration() > 0) {
                start();
            } else {
                openVideo();
            }
        }
        isBackground = false;
    }

    public void stopPlayWithBackground() {
        if (isBackground == true) {
            return;
        }
        if (mEnableBackgroundPlay) {
            if (mHardwareDecoder) {
                release();
            } else {
                enterBackground();
            }
        } else {
            if (mLivePlayer != null && mLivePlayer.getDuration() > 0)
                pause();
            else {
                release();
            }
        }
        isBackground = true;
    }


    /**
     * @brief 开始播放或暂停后恢复播放
     */
    public void start() {
        if (isInPlaybackState()) {
            LogUtil.i(TAG, "do start");
            mLivePlayer.start();
            mLivePlayer.setMute(mMute);
            mCurrState = STARTED;
        }
        mNextState = STARTED;
    }

    /**
     * @brief 暂停播放
     */
    public void pause() {
        if (isInPlaybackState()) {
            if (mLivePlayer.isPlaying()) {
                mLivePlayer.pause();
                mCurrState = PAUSED;
            }
        }
        mNextState = PAUSED;
    }

    public void suspend() {
        release();
    }

    public void resume() {
        openVideo();
    }


    public void manualPause(boolean paused) {
        manualPause = paused;
    }

    public boolean isPaused() {
        //return (mCurrentState == PLAY_STATE_PAUSED) ? true : false;
        return manualPause;
    }

    private boolean isInPlaybackState() {
        return (mLivePlayer != null &&
                mCurrState != ERROR &&
                mCurrState != IDLE &&
                mCurrState != PREPARING);
    }

    /**
     * @param videoScalingMode 显示模式
     * @brief 设置画面显示模式
     */
    public void setVideoScalingMode(int videoScalingMode) {
        if (mRenderView != null)
            mRenderView.setAspectRatio(videoScalingMode);
    }

    //-------------------------
    // Extend: Background
    //-------------------------

    /**
     * @brief 初始化后台播放, 采用service
     */
    private void initBackground() {
        if (mEnableBackgroundPlay) {
            NELivePlayerService.intentToStart(getContext());
            mLivePlayer = NELivePlayerService.getMediaPlayer();
        }
    }


    /**
     * @brief 进入后台进行播放
     */
    public void enterBackground() {
        NELivePlayerService.setMediaPlayer(mLivePlayer);
    }


    /**
     * @param MediaType 媒体类型
     * @brief 设置媒体类型
     */
    public void setMediaType(String MediaType) {
        mMediaType = MediaType;
    }

    /**
     * @return 媒体类型
     * @brief 获取媒体类型
     */
    public String getMediaType() {
        return mMediaType;
    }

    /**
     * @param bufferStrategy 缓冲类型
     * @brief 设置缓冲类型
     */
    public void setBufferStrategy(int bufferStrategy) {
        mBufferStrategy = bufferStrategy;
    }

    /**
     * @return 是否是硬件解码
     * @brief 是否是用硬件解码
     */
    public boolean isHardware() {
        return mHardwareDecoder;
    }

    /**
     * @param enabled 是否开启硬件解码
     * @brief 设置解码类型, 是否开启硬解解码
     */
    public void setHardwareDecoder(boolean enabled) {
        mHardwareDecoder = enabled;
    }

    /**
     * @return
     * @brief 是否在后台
     */
    public boolean isInBackground() {
        return isBackground;
    }

    /**
     * @param enabled
     * @brief 设置后台是否继续播放
     */
    public void setEnableBackgroundPlay(boolean enabled) {
        mEnableBackgroundPlay = enabled;
    }

    /**
     * @param mute 是否静音
     * @brief 静音功能
     */
    public void setMute(boolean mute) {
        mMute = mute;
    }


    /**
     * @brief 截图功能
     */
    @SuppressLint("SdCardPath")
    public void getSnapshot() {
        NEMediaInfo mediaInfo = mLivePlayer.getMediaInfo();
        if (mediaInfo.mVideoDecoderMode.equals("MediaCodec")) {
            Log.d(TAG, "======= hardware decoder unsupport snapshot ========");
        } else {
            Bitmap bitmap = Bitmap.createBitmap(mVideoWidth, mVideoHeight, Bitmap.Config.ARGB_8888);
            //Bitmap bitmap = null;
            mLivePlayer.getSnapshot(bitmap);
            String picName = "/sdcard/NESnapshot.jpg";
            File f = new File(picName);
            try {
                f.createNewFile();
            } catch (IOException e1) {
                e1.printStackTrace();
            }
            FileOutputStream fOut = null;
            try {
                fOut = new FileOutputStream(f);
                if (picName.substring(picName.lastIndexOf(".") + 1, picName.length()).equals("jpg")) {
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 100, fOut);
                } else if (picName.substring(picName.lastIndexOf(".") + 1, picName.length()).equals("png")) {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, fOut);
                }
                fOut.flush();
                fOut.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

            Toast.makeText(mContext, "截图成功", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * @return sdk版本号
     * @brief 获取sdk版本号
     */
    public String getVersion() {
        if (mLivePlayer == null)
            return null;
        return mLivePlayer.getVersion();
    }

    /**
     * @brief 释放播放器资源
     */
    public void release() {
        if (mLivePlayer != null) {
            mLivePlayer.reset();
            mLivePlayer.release();
            mLivePlayer = null;
            mCurrState = IDLE;
        }
    }


    public void destroy() {
        release();
//        handler.removeCallbacksAndMessages(null);
        mContext = null;
    }

}