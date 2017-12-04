package com.netease.nim.ufocatcher.demo.ui.activity;

import android.os.Bundle;
import android.os.CountDownTimer;
import android.text.TextUtils;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.netease.nim.ufocatcher.demo.R;
import com.netease.nim.ufocatcher.demo.common.log.LogUtil;
import com.netease.nim.ufocatcher.demo.common.net.ConnectivityWatcher;
import com.netease.nim.ufocatcher.demo.common.net.NetworkUtil;
import com.netease.nim.ufocatcher.demo.common.ui.dialog.CustomDialog;
import com.netease.nim.ufocatcher.demo.common.ui.dialog.DialogMaker;
import com.netease.nim.ufocatcher.demo.protocol.PCController;
import com.netease.nim.ufocatcher.demo.protocol.QueueController;
import com.netease.nim.ufocatcher.demo.protocol.model.PCNotification;
import com.netease.nim.ufocatcher.demo.support.avchat.MediaPlayer;
import com.netease.nim.ufocatcher.demo.support.avchat.SimpleAVChatStateObserver;
import com.netease.nim.ufocatcher.demo.support.videoplayer.VideoConstant;
import com.netease.nim.ufocatcher.demo.support.videoplayer.VideoPlayer;
import com.netease.nimlib.sdk.NIMChatRoomSDK;
import com.netease.nimlib.sdk.Observer;
import com.netease.nimlib.sdk.RequestCallback;
import com.netease.nimlib.sdk.RequestCallbackWrapper;
import com.netease.nimlib.sdk.ResponseCode;
import com.netease.nimlib.sdk.StatusCode;
import com.netease.nimlib.sdk.avchat.AVChatCallback;
import com.netease.nimlib.sdk.avchat.AVChatManager;
import com.netease.nimlib.sdk.avchat.constant.AVChatVideoScalingType;
import com.netease.nimlib.sdk.avchat.model.AVChatCommonEvent;
import com.netease.nimlib.sdk.avchat.model.AVChatData;
import com.netease.nimlib.sdk.avchat.model.AVChatParameters;
import com.netease.nimlib.sdk.chatroom.model.ChatRoomStatusChangeData;
import com.netease.nimlib.sdk.chatroom.model.EnterChatRoomData;

import butterknife.OnClick;

import static com.netease.nim.ufocatcher.demo.protocol.model.PCNotification.COMMAND_GAME_OVER_RESULT_FAILED;
import static com.netease.nim.ufocatcher.demo.protocol.model.PCNotification.COMMAND_GAME_OVER_RESULT_SUCCESS;

/**
 * 游戏主流程控制
 * <p>
 * 播放器前后台切换及断网重连策略：
 * 1. APP退后台，不停流，由Service保持拉流。
 * 2. 网络断开，立即停流。
 * 3. 在网络恢复、APP回到前台时尝试恢复拉流。
 * 4. 尝试拉流：必须在网络可用 && APP在前台 && 没有被停流 三个条件都符合时才重新初始化流。
 */

public class PlayerActivity extends PlayerActivityBase {
    private static final int SECOND = 1000;
    private static final int VIDEO_PLAYER_INIT_DELAY_TIME = 300;
    private static final int GAME_START_COUNT_DOWN_TIME = 10 * SECOND;
    private static final int GAME_OVER_COUNT_DOWN_TIME = 30 * SECOND;
    private static final int JOIN_ROOM_TIMEOUT = 10 * SECOND;
    private static final int GAME_OVER_RESULT_TIMEOUT = 20 * SECOND;
    private static long lastVideoPlayerDestroyTimeTag; // 最后一次销毁播放器的时间

    // 核心组件
    private VideoPlayer videoPlayer; // 前置拉流
    private VideoPlayer videoPlayer2; // 后置拉流
    private QueueController queueController = new QueueController(); // 游戏队列管理
    private PCController pcController = new PCController(); // 游戏控制指令管理
    private ConnectivityWatcher connectivityWatcher;

    // 状态控制
    private boolean isPlaying = false; // 游戏中
    private boolean isFront = true; // 是否前置拉流
    private boolean isMusicOn = true; // 音乐是否播放，默认开启
    private int currentCamera = 0; // 当前现实的画面源(0/1)
    private int gameOverCountDownTime = GAME_OVER_COUNT_DOWN_TIME; // 玩游戏的30s倒计时
    private int gameStartCountDownTime = GAME_START_COUNT_DOWN_TIME; // 开始游戏前的10s倒计时
    private long channelId; // 音视频通话的频道号

    // video拉流切换
    private ViewGroup.LayoutParams frontVideoLayout;
    private ViewGroup.LayoutParams backVideoLayout;
    private FrameLayout.LayoutParams hideParams = new FrameLayout.LayoutParams(1, 1);
    private boolean firstBlood; // 是否首次初始化完成，断网重连状态控制
    private boolean foreground; // 是否回到前台
    private boolean netAvailable; // 网络是否连通

    // 布局显示状态控制
    private int WAITING = 0; // 初始化状态
    private int IN_LINE = 1; // 排队中
    private int PREPARE = 2; // 准备开始游戏
    private int GAME = 3;   // 游戏中
    private int currentState = WAITING;

    /**
     * ********************************* 启动流程 ******************************
     */

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // PC通知监听
        pcController.init(pcAccount);
        // 监听(音视频/队列/PC)
        registerObserves(true);
        // 聊天室
        enterRoom();
        // 拉流播放器
        firstBlood = true;
        netAvailable = NetworkUtil.isNetAvailable(PlayerActivity.this);
        final int delay = shouldDelayInitRTMPVideo() ? VIDEO_PLAYER_INIT_DELAY_TIME : 0;
        getHandler().postDelayed(videoPlayerInitTask, delay); // 避免第一次退出时析构还未完成，狗日的
        // 监听网络
        connectivityWatcher = new ConnectivityWatcher(this, connectivityCallback);
        connectivityWatcher.startup();
    }

    @Override
    protected void onStop() {
        super.onStop();
        LogUtil.app("Activity onStop");

        foreground = false;
    }

    @Override
    protected void onResume() {
        super.onResume();
        LogUtil.app("Activity onResume");

        foreground = true;
        recoveryRTMPVideo(false); // 重新恢复拉流视频
    }

    @Override
    public void onBackPressed() {
        if (isInputShow) {
            switchInputLayout(false);
            return;
        }

        super.onBackPressed();
    }

    private void enterRoom() {
        NIMChatRoomSDK.getChatRoomService().enterChatRoomEx(new EnterChatRoomData(roomId), 1).setCallback(new RequestCallback() {
            @Override
            public void onSuccess(Object param) {
                LogUtil.app("enter chat room success, roomId=" + roomId);
            }

            @Override
            public void onFailed(int code) {
                LogUtil.app("enter chat room failed, code=" + code);
                Toast.makeText(context, "进入聊天室失败, code=" + code, Toast.LENGTH_SHORT).show();
                finish();
            }

            @Override
            public void onException(Throwable exception) {
                LogUtil.app("enter chat room error, e=" + exception.getMessage());
                Toast.makeText(context, "进入聊天室出错, error=" + exception.getMessage(), Toast.LENGTH_SHORT).show();
                finish();
            }
        });
    }

    private void registerObserves(boolean register) {
        AVChatManager.getInstance().observeIncomingCall(incomingObserver, register);
        AVChatManager.getInstance().observeAVChatState(stateObserver, register);
        AVChatManager.getInstance().observeHangUpNotification(hangUpObserver, register);
        NIMChatRoomSDK.getChatRoomServiceObserve().observeOnlineStatus(onlineStatusObserver, register);
        pcController.observePCNotification(pcNotificationObserver, register);
        queueController.observeQueueChange(queueInfoObserver, register);
    }

    /**
     * ********************************* 游戏主流程 *******************************
     */

    @OnClick({R.id.down_btn, R.id.left_btn, R.id.up_btn, R.id.right_btn, R.id.go_btn_layout,
            R.id.line_up_layout, R.id.cancel_btn, R.id.start_game_layout, R.id.talk_btn, R.id.input_layout})
    public void onViewClicked(View view) {
        String command = null;
        switch (view.getId()) {
            case R.id.down_btn:
                command = PCController.Builder.buildDownCommand(currentCamera);
                break;
            case R.id.left_btn:
                command = PCController.Builder.buildLeftCommand(currentCamera);
                break;
            case R.id.up_btn:
                command = PCController.Builder.buildUPCommand(currentCamera);
                break;
            case R.id.right_btn:
                command = PCController.Builder.buildRightCommand(currentCamera);
                break;
            case R.id.go_btn_layout:
                // 发送抓起娃娃指令，清空正在游戏的倒计时
                gameOverTimer.cancel();
                command = clickGo(false);
                break;
            case R.id.line_up_layout:
                // 开始排队
                lineUp();
                break;
            case R.id.cancel_btn:
                // 取消排队
                cancelLineUp();
                break;
            case R.id.start_game_layout:
                // 停止开始游戏倒计时,进入音视频通道
                gameStartCountDownTime = GAME_START_COUNT_DOWN_TIME;
                gameStartTimer.cancel();
                joinChannel();
                break;
            case R.id.talk_btn:
                // 显示输入框
                switchInputLayout(true);
                break;
            case R.id.input_layout:
                // 隐藏输入框
                switchInputLayout(false);
                break;
        }

        sendCommandToPC(command);
    }

    private void sendCommandToPC(String command) {
        if (command != null) {
            pcController.sendCommandToPC(command, new RequestCallbackWrapper<Void>() {
                @Override
                public void onResult(int code, Void result, Throwable exception) {
                    LogUtil.app("send PC control command " + command + " ,code=" + code);
                }
            });
        }
    }

    // 根据状态改变布局
    private void updateControlLayout(int state) {
        LogUtil.app("current state change to " + state);
        currentState = state;

        msgListPanel.messageListView.setVisibility(state == GAME ? View.GONE : View.VISIBLE);
        playingLayout.setVisibility(state == GAME ? View.VISIBLE : View.GONE);
        talkBtn.setVisibility(state == GAME ? View.GONE : View.VISIBLE);

        if (inputPanel.messageActivityBottomLayout.getVisibility() == View.VISIBLE) {
            // 输入法正在打字 就不显示排队的控制条
            lineLayout.setVisibility(View.GONE);
        } else {
            lineLayout.setVisibility(state == GAME ? View.GONE : View.VISIBLE);
        }

        lineUpLayout.setVisibility(state == WAITING ? View.VISIBLE : View.GONE);
        inLineLayout.setVisibility(state == IN_LINE ? View.VISIBLE : View.GONE);
        startGameLayout.setVisibility(state == PREPARE ? View.VISIBLE : View.GONE);
    }

    // 开始排队
    private void lineUp() {
        // 界面禁止操作
        lineUpLayout.setEnabled(false);
        lineUpImage.setBackgroundResource(R.mipmap.ic_line_up_word_disable);

        // 队列控制
        queueController.addQueue(new RequestCallbackWrapper<Void>() {
            @Override
            public void onResult(int code, Void result, Throwable exception) {
                lineUpLayout.setEnabled(true); // 解禁
                lineUpImage.setBackgroundResource(R.mipmap.ic_line_up_word);
                if (code == ResponseCode.RES_SUCCESS) {
                    LogUtil.app("add queue success");
                    updateControlLayout(IN_LINE); // 显示排队中
                } else {
                    Toast.makeText(context, "排队失败，请重试! code=" + code, Toast.LENGTH_SHORT).show();
                    LogUtil.app("add queue failed, code=" + code);
                    // 从游戏结果界面，可以点击「重新排队」，这时候失败，应该恢复成初始画面
                    updateControlLayout(WAITING);
                }
            }
        });
    }

    // 取消排队
    private void cancelLineUp() {
        // 界面禁止操作
        cancelBtn.setEnabled(false);
        cancelBtn.setBackgroundResource(R.mipmap.ic_cancel_disable);

        // 队列控制
        queueController.cancelQueue(new RequestCallbackWrapper<Void>() {
            @Override
            public void onResult(int code, Void result, Throwable exception) {
                cancelBtn.setEnabled(true); // 解禁
                cancelBtn.setBackgroundResource(R.mipmap.ic_cancel);
                if (code == ResponseCode.RES_SUCCESS) {
                    LogUtil.app("cancel queue success");
                    updateControlLayout(WAITING); // 已经移除队列，重新显示排队按钮
                } else {
                    Toast.makeText(context, "取消排队失败,请重试!code=" + code, Toast.LENGTH_SHORT).show();
                    LogUtil.app("cancel queue failed, code=" + code);
                }
            }
        });
    }

    // 收到PC音视频Call，等待玩家点击开始游戏，这里显示开始游戏倒计时
    private void countDownGame() {
        updateControlLayout(PREPARE);
        gameStartTimer.start(); // 开启定时器，更新界面倒计时，倒计时结束开始玩游戏
    }

    // 游戏准备开始倒计时
    private CountDownTimer gameStartTimer = new CountDownTimer(GAME_START_COUNT_DOWN_TIME, SECOND) {
        @Override
        public void onTick(long millisUntilFinished) {
            gameStartCountDownTime -= SECOND;
            startGameBtn.setText(String.format("(%ds)", gameStartCountDownTime / SECOND));
        }

        @Override
        public void onFinish() {
            // 失败了，则挂断音视频通话
            onJoinChannelFailed();
            gameStartCountDownTime = GAME_START_COUNT_DOWN_TIME;
            Toast.makeText(context, "放弃游戏！", Toast.LENGTH_SHORT).show();
        }
    };

    // 成功进入音视频通道,开始玩游戏
    private void startGame() {
        switchEnablePlay(true);
        updateGoLayout(false);
        // 隐藏聊天消息列表
        msgListPanel.messageListView.setVisibility(View.GONE);
        // 隐藏输入框
        inputPanel.messageActivityBottomLayout.setVisibility(View.GONE);
        inputPanel.switchToTextLayout(false);

        updateControlLayout(GAME);

        // 开启30s游戏倒计时，游戏结束，返回排队界面
        gameOverTimer.start();
        isPlaying = true;
    }

    // 游戏按钮是否可点击
    private void switchEnablePlay(boolean enable) {
        goText.setEnabled(enable);
        upBtn.setEnabled(enable);
        downBtn.setEnabled(enable);
        leftBtn.setEnabled(enable);
        rightBtn.setEnabled(enable);
    }

    // go 按钮状态
    private void updateGoLayout(boolean isFinished) {
        if (isFinished) {
            // 游戏已结束
            goText.setVisibility(View.GONE);
            goImage.setVisibility(View.GONE);
            goBtnLayout.setBackgroundResource(R.mipmap.ic_go_finished);
        } else {
            goBtnLayout.setBackgroundResource(R.drawable.go_selector);
            goText.setVisibility(View.VISIBLE);
            goImage.setVisibility(View.VISIBLE);
        }
    }

    // 游戏结束倒计时
    private CountDownTimer gameOverTimer = new CountDownTimer(GAME_OVER_COUNT_DOWN_TIME, SECOND) {
        @Override
        public void onTick(long millisUntilFinished) {
            gameOverCountDownTime -= SECOND;
            goText.setText(String.format("(%ds)", gameOverCountDownTime / 1000));
        }

        @Override
        public void onFinish() {
            // 超过 30s 还没点go，自动结束，发送go指令
            sendCommandToPC(clickGo(true));
        }
    };

    // 下爪子 抓娃娃
    private String clickGo(boolean auto) {
        String command;
        command = PCController.Builder.buildFuckCommand();
        gameOverCountDownTime = GAME_OVER_COUNT_DOWN_TIME;
        // 上下左右，go不可点击，go按钮更换背景, 等待游戏结束返回的通知
        switchEnablePlay(false);
        updateGoLayout(true);

        getHandler().postDelayed(waitForGameOverResultTimeoutTask, GAME_OVER_RESULT_TIMEOUT);
        LogUtil.app(auto ? "auto" : "manual" + " click go! wait for game over result...");
        return command;
    }

    // 等待游戏结果通知
    private Runnable waitForGameOverResultTimeoutTask = () -> {
        LogUtil.app("wait for game over result timeout!!! show result failed!");
        Toast.makeText(context, "获取游戏结果超时", Toast.LENGTH_SHORT).show();
        showResult(false);
    };

    // 游戏结果事件通知
    private Observer<PCNotification> pcNotificationObserver = (notification) -> {
        int command = notification.getCommand();
        switch (command) {
            case COMMAND_GAME_OVER_RESULT_SUCCESS:
                LogUtil.app("game over! success!");
                showResult(true); // 抓到娃娃了
                break;
            case COMMAND_GAME_OVER_RESULT_FAILED:
                LogUtil.app("game over! failed!");
                showResult(false); // 没有抓到
                break;
        }
    };

    // 是否抓到娃娃的结果
    private void showResult(boolean isSuccess) {
        if (!isPlaying) {
            return; // 游戏已经结束了，不需要显示结果了，可能PC的结果通知延迟了
        }

        isPlaying = false;
        getHandler().removeCallbacks(waitForGameOverResultTimeoutTask);
        LogUtil.app("show game over result=" + isSuccess);
        CustomDialog dialog = new CustomDialog(this, new CustomDialog.OnDialogActionListener() {
            @Override
            public void doCancelAction() {
                // 结束游戏
                updateControlLayout(WAITING);
            }

            @Override
            public void doOkAction() {
                // 重新排队
                lineUp();
            }
        });
        dialog.setCancelable(false);
        dialog.show();
        if (isSuccess) {
            dialog.setBackground(R.mipmap.ic_success_bg);
            dialog.setTitleImage(R.mipmap.ic_success_icon);
            dialog.setTitle(R.string.success_tip);
            dialog.setContent(R.string.success_content);
        } else {
            dialog.setBackground(R.mipmap.ic_failed_bg);
            dialog.setTitleImage(R.mipmap.ic_failed_icon);
            dialog.setTitle(R.string.failed_tip);
            dialog.setContent(R.string.failed_content);
        }
    }

    // 全局队列信息变更通知
    private Observer<QueueController.QueueInfo> queueInfoObserver = (queueInfo) -> {
        if (queueInfo == null) {
            return;
        }
        lineUpBtn.setText(String.format("(%d人)", queueInfo.getWaitingCount()));
        inLineBtn.setText(String.format("(%d人)", queueInfo.getWaitingCount()));
        // 谁正在玩游戏
        if (!TextUtils.isEmpty(queueInfo.getFirstItemAccount())) {
            playerAccountText.setVisibility(View.VISIBLE);
            playerAccountText.setText(queueInfo.getFirstItemNickname());
        } else {
            playerAccountText.setVisibility(View.GONE);
        }

        if (currentState == IN_LINE && !queueInfo.isSelfInQueue()) {
            LogUtil.app("be removed from queue!");
            // 我正在排队，又收到我被移除队列的通知，则表示排队失败，切换到初始状态
            Toast.makeText(context, "排队失败", Toast.LENGTH_SHORT).show();
            updateControlLayout(WAITING);
        }
    };

    /**
     * *********************** 音视频控制 ************************
     */

    private Observer<AVChatData> incomingObserver = (data) -> {
        channelId = data.getChatId();
        AVChatManager.getInstance().enableRtc();
        AVChatManager.getInstance().enableVideo();
        AVChatManager.getInstance().setParameter(AVChatParameters.KEY_VIDEO_ROTATE_IN_RENDING, false); // 不要旋转画面

        // 接到可以玩游戏的呼叫，开始游戏倒计时!
        countDownGame();
    };

    // 开始游戏,开始进入音视频通道, 开始转菊花
    private void joinChannel() {
        if (channelId != 0) {
            AVChatManager.getInstance().accept2(channelId, new AVChatCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    LogUtil.app("accept avchat success");
                }

                @Override
                public void onFailed(int code) {
                    if (code == -1) {
                        Toast.makeText(context, "本地音视频启动失败", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(context, "无法建立音视频通道!无法开启游戏!", Toast.LENGTH_SHORT).show();
                    }
                    LogUtil.app("accept avchat failed=" + code);
                    onJoinChannelFailed();
                }

                @Override
                public void onException(Throwable exception) {
                    LogUtil.app("accept avchat throw exception=" + exception.getMessage());
                    onJoinChannelFailed();
                }
            });

            // 转菊花，并进行音视频连接(最多等待10s)
            waitingForJoinRoom();
        }
    }

    private void waitingForJoinRoom() {
        getHandler().postDelayed(joinRoomTimeoutTask, JOIN_ROOM_TIMEOUT);
        DialogMaker.showProgressDialog(PlayerActivity.this, getString(R.string.waiting), false);
    }

    private Runnable joinRoomTimeoutTask = () -> {
        LogUtil.app("join room timeout!");
        onJoinChannelFailed();
    };

    private void onJoinChannelFailed() {
        hangUp();
        updateControlLayout(WAITING);
        DialogMaker.dismissProgressDialog();
    }

    private SimpleAVChatStateObserver stateObserver = new SimpleAVChatStateObserver() {
        @Override
        public void onUserJoined(String account) {
            LogUtil.app("on user joined");
            // 移除超时任务
            getHandler().removeCallbacks(joinRoomTimeoutTask);

            showAVChatVideo();
            AVChatManager.getInstance().setupRemoteVideoRender(account, avChatSurfaceViewRenderer, false, AVChatVideoScalingType.SCALE_ASPECT_BALANCED);

            // 开始游戏
            startGame();

            // 去掉等待界面
            DialogMaker.dismissProgressDialog();
        }
    };

    private void hangUp() {
        if (channelId != 0) {
            AVChatManager.getInstance().hangUp2(channelId, new AVChatCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    LogUtil.app("hang up avchat call success!");
                }

                @Override
                public void onFailed(int code) {
                    LogUtil.app("hang up avchat call failed, code=" + code);
                }

                @Override
                public void onException(Throwable exception) {
                    LogUtil.app("hang up avchat call error, e=" + exception.getMessage());
                }
            });
            channelId = 0;
        }
    }

    private Observer<AVChatCommonEvent> hangUpObserver = (Observer<AVChatCommonEvent>) avChatCommonEvent -> {
        // 收到主播挂断抓娃娃的通知, 移除音视频画面，显示推流画面
        LogUtil.app("receive hang up from PC");
        currentCamera = 0;
        channelId = 0;
        showRTMPVideo(isFront);
    };

    /**
     * *********************** 拉流播放器控制 ************************
     */

    private void showRTMPVideo(boolean front) {
        LogUtil.app("show rtmp video to " + (front ? "front" : "back"));

        avChatSurfaceViewRenderer.setVisibility(View.GONE);

        if (front) {
            videoView.setRenderViewLayoutParams(frontVideoLayout);
            videoViewBack.setRenderViewLayoutParams(hideParams);
        } else {
            videoView.setRenderViewLayoutParams(hideParams);
            videoViewBack.setRenderViewLayoutParams(backVideoLayout);
        }

        isFront = front;
    }

    private void showAVChatVideo() {
        LogUtil.app("show rtc video, hide all rtmp video");

        videoView.setRenderViewLayoutParams(hideParams);
        videoViewBack.setRenderViewLayoutParams(hideParams);
        avChatSurfaceViewRenderer.setVisibility(View.VISIBLE);
    }

    private void destroyRTMPVideo() {
        LogUtil.app("destroy video player...");

        if (videoPlayer != null) {
            videoPlayer.resetVideo();
            videoPlayer = null;
        }

        if (videoPlayer2 != null) {
            videoPlayer2.resetVideo();
            videoPlayer2 = null;
        }

        lastVideoPlayerDestroyTimeTag = System.currentTimeMillis();
    }

    private boolean shouldDelayInitRTMPVideo() {
        return System.currentTimeMillis() - lastVideoPlayerDestroyTimeTag <= 3 * SECOND;
    }

    private void recoveryRTMPVideo(boolean netRecovery) {
        if (firstBlood) {
            return;
        }

        // 没有网络或者没有在前台就不需要重新初始化视频了
        if (netRecovery && !foreground) {
            // case 1: 如果APP在后台网络恢复了，那么等回到前台后再重新初始化播放器。如果在前台网络断了恢复后，立即初始化
            LogUtil.app("cancel recovery video from net recovery as app in background!");
            return;
        }

        if (!netRecovery && !netAvailable) {
            // case 2: 如果APP回到前台，发现没有网络，那么不立即初始化，等待网络连通了再初始化
            LogUtil.app("cancel recovery video from activity on resume as network is unavailable!");
            return;
        }

        // 如果已经销毁掉了，才需要重新初始化。比如退到后台，实际上有Service继续拉流，那么回到前台时，SurfaceView onCreate之后会继续渲染拉流
        String tip = netRecovery ? "net available" : "activity on resume" + ", foreground=" + foreground;
        if (videoPlayer == null || videoPlayer2 == null) {
            long delayTime = (!netRecovery || shouldDelayInitRTMPVideo()) ? VIDEO_PLAYER_INIT_DELAY_TIME : 0;
            getHandler().removeCallbacks(videoPlayerInitTask);
            getHandler().postDelayed(videoPlayerInitTask, delayTime);
            LogUtil.app("recovery video from " + tip + ", delay " + delayTime);
        } else {
            LogUtil.app("cancel recovery video as video player is not null! From " + tip);
        }
    }

    private Runnable videoPlayerInitTask = () -> {
        LogUtil.app("start init video player...");
        if (firstBlood) {
            // 首次初始化
            frontVideoLayout = videoView.getRenderViewLayoutParams();
            backVideoLayout = videoViewBack.getRenderViewLayoutParams();
        } else {
            // 断网重连,需要重新初始化
            videoViewBack.setRenderViewLayoutParams(backVideoLayout);
            videoView.setRenderViewLayoutParams(frontVideoLayout);
        }

        videoPlayer = new VideoPlayer(PlayerActivity.this, videoView, videoUrl1, 0,
                null, VideoConstant.VIDEO_SCALING_MODE_FILL_BLACK, false);
        videoPlayer.openVideo();

        videoPlayer2 = new VideoPlayer(PlayerActivity.this, videoViewBack, videoUrl2, 0,
                null, VideoConstant.VIDEO_SCALING_MODE_FILL_BLACK, false);
        videoPlayer2.openVideo();

        showRTMPVideo(isFront); // 首次启动 true, 断网重连根据最后更新的状态

        firstBlood = false; // 一血献了
    };

    /**
     * ********************************* 菜单事件响应 *******************************
     */

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.camera_menu_btn:
                if (channelId != 0) {
                    // 我正在玩游戏
                    if (currentCamera == 0) {
                        pcController.sendCommandToPC(PCController.Builder.buildSwitchToCamera2(), new RequestCallbackWrapper<Void>() {
                            @Override
                            public void onResult(int code, Void result, Throwable exception) {
                                if (code == 200) {
                                    currentCamera = 1;
                                }
                            }
                        });
                    } else {
                        pcController.sendCommandToPC(PCController.Builder.buildSwitchToCamera1(), new RequestCallbackWrapper<Void>() {
                            @Override
                            public void onResult(int code, Void result, Throwable exception) {
                                if (code == 200) {
                                    currentCamera = 0;
                                }
                            }
                        });
                    }
                } else {
                    // 我是普通观众
                    showRTMPVideo(!isFront);
                }
                break;
            case R.id.music_menu_btn:
                isMusicOn = !isMusicOn;
                item.setIcon(isMusicOn ? R.drawable.music_on_selector : R.drawable.music_off_selector);
                MediaPlayer.getInstance().mute(!isMusicOn);
                break;
            default:
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    /**
     * ********************************* 断网重连 ******************************
     */

    private Observer<ChatRoomStatusChangeData> onlineStatusObserver = (data) -> {
        if (data.status == StatusCode.LOGINED) {
            LogUtil.app("room reconnect success, queue init...");
            queueController.init(roomId); // 首次or断网重连登录聊天室，初始化队列
        }
    };

    private ConnectivityWatcher.Callback connectivityCallback = (event) -> {
        switch (event) {
            case NETWORK_AVAILABLE:
                onNetworkAvailable();
                break;
            case NETWORK_UNAVAILABLE:
                onNetworkUnavailable();
                break;
        }
    };

    private void onNetworkAvailable() {
        LogUtil.app("network available!!!");
        Toast.makeText(context, "网络恢复", Toast.LENGTH_SHORT).show();
        netWorkText.setVisibility(View.GONE);
        netAvailable = true;

        recoveryRTMPVideo(true); // 可能需要重启播放器
    }

    private void onNetworkUnavailable() {
        LogUtil.app("network unavailable!!!");
        Toast.makeText(context, "网络断开", Toast.LENGTH_SHORT).show();
        netWorkText.setVisibility(View.VISIBLE);
        netAvailable = false;
        destroyRTMPVideo();
    }

    /**
     * ********************************* 退出流程 ******************************
     */

    @Override
    protected void onDestroy() {
        super.onDestroy();
        LogUtil.app("PlayerActivity on destroy");

        // 取消监听
        registerObserves(false);

        // 移除delay task
        getHandler().removeCallbacks(videoPlayerInitTask);
        getHandler().removeCallbacks(joinRoomTimeoutTask);
        getHandler().removeCallbacks(waitForGameOverResultTimeoutTask);

        // 取消监听pc通知
        pcController.destroy();

        // 取消队列变更监听
        queueController.destroy();

        // 离开聊天室
        LogUtil.app("exit chat room");
        NIMChatRoomSDK.getChatRoomService().exitChatRoom(roomId);

        // 离开音视频房间
        hangUp();

        // 释放播放器
        destroyRTMPVideo();

        // 游戏计数器
        gameStartTimer.cancel();
        gameOverTimer.cancel();

        // 关闭网络监听
        connectivityWatcher.shutdown();
    }
}
