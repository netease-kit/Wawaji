package com.netease.nim.ufocatcher.demo.ui.activity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.netease.nim.ufocatcher.demo.R;
import com.netease.nim.ufocatcher.demo.common.log.LogUtil;
import com.netease.nim.ufocatcher.demo.common.ui.ToolBarOptions;
import com.netease.nim.ufocatcher.demo.common.ui.UI;
import com.netease.nim.ufocatcher.demo.common.ui.dialog.DialogMaker;
import com.netease.nim.ufocatcher.demo.common.utils.ScreenUtil;
import com.netease.nim.ufocatcher.demo.protocol.model.RoomInfo;
import com.netease.nim.ufocatcher.demo.support.avchat.MediaPlayer;
import com.netease.nim.ufocatcher.demo.support.videoplayer.NEVideoView;
import com.netease.nim.ufocatcher.demo.ui.module.ChatRoomInputPanel;
import com.netease.nim.ufocatcher.demo.ui.module.ChatRoomMsgListPanel;
import com.netease.nim.ufocatcher.demo.ui.module.Container;
import com.netease.nim.ufocatcher.demo.ui.module.DefaultModuleProxy;
import com.netease.nimlib.sdk.NIMChatRoomSDK;
import com.netease.nimlib.sdk.NIMClient;
import com.netease.nimlib.sdk.Observer;
import com.netease.nimlib.sdk.RequestCallback;
import com.netease.nimlib.sdk.ResponseCode;
import com.netease.nimlib.sdk.avchat.model.AVChatSurfaceViewRenderer;
import com.netease.nimlib.sdk.chatroom.ChatRoomService;
import com.netease.nimlib.sdk.chatroom.model.ChatRoomMessage;
import com.netease.nimlib.sdk.msg.constant.MsgTypeEnum;
import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;
import com.netease.nimlib.sdk.msg.model.IMMessage;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * 封装所有UI控件的获取及基本聊天组件
 * <p>
 * Created by huangjun on 2017/11/24.
 */

class PlayerActivityBase extends UI {
    // constant
    private static final String EXTRA_ROOM_INFO = "room_info";

    // context
    protected Context context;

    // view
    protected ChatRoomInputPanel inputPanel;
    protected ChatRoomMsgListPanel msgListPanel;
    @BindView(R.id.root_view)
    protected RelativeLayout rootView;
    @BindView(R.id.scroll)
    ScrollView scrollView;
    @BindView(R.id.playing_layout)
    protected RelativeLayout playingLayout;
    @BindView(R.id.down_btn)
    protected ImageButton downBtn;
    @BindView(R.id.left_btn)
    protected ImageButton leftBtn;
    @BindView(R.id.up_btn)
    protected ImageButton upBtn;
    @BindView(R.id.right_btn)
    protected ImageButton rightBtn;
    @BindView(R.id.go_btn_layout)
    protected LinearLayout goBtnLayout;
    @BindView(R.id.go_text)
    protected TextView goText;
    @BindView(R.id.go_image)
    protected ImageView goImage;
    @BindView(R.id.line_up_layout)
    protected LinearLayout lineUpLayout;
    @BindView(R.id.line_up_btn)
    protected TextView lineUpBtn;
    @BindView(R.id.line_up_image)
    protected ImageView lineUpImage;
    @BindView(R.id.in_line_btn)
    protected TextView inLineBtn;
    @BindView(R.id.cancel_btn)
    protected TextView cancelBtn;
    @BindView(R.id.in_line_layout)
    protected LinearLayout inLineLayout;
    @BindView(R.id.start_game_layout)
    protected LinearLayout startGameLayout;
    @BindView(R.id.start_game_btn)
    protected TextView startGameBtn;
    @BindView(R.id.line_layout)
    protected LinearLayout lineLayout;
    @BindView(R.id.talk_btn)
    protected ImageButton talkBtn;
    @BindView(R.id.input_layout)
    protected RelativeLayout inputLayout;
    @BindView(R.id.player_account)
    protected TextView playerAccountText;
    @BindView(R.id.network_text)
    protected TextView netWorkText;

    // 核心组件：三个video
    @BindView(R.id.video_view)
    protected NEVideoView videoView;
    @BindView(R.id.video_view_back)
    protected NEVideoView videoViewBack;
    @BindView(R.id.avchat_view)
    protected AVChatSurfaceViewRenderer avChatSurfaceViewRenderer;

    // data
    protected String roomId;
    protected String pcAccount;
    protected int onlineCount;
    protected String videoUrl1;
    protected String videoUrl2;
    protected boolean isInputShow = false;

    public static void startActivity(Context context, RoomInfo roomInfo) {
        Intent intent = new Intent();
        intent.setClass(context, PlayerActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        intent.putExtra(EXTRA_ROOM_INFO, roomInfo);
        context.startActivity(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.context = PlayerActivityBase.this.getApplicationContext();

        setContentView(R.layout.activity_live);
        ButterKnife.bind(this);

        parseIntent();
        setTitle();
        findViews();
        registerObserves(true);

        // 本地背景乐
        MediaPlayer.getInstance().play(this, R.raw.playing, true);
    }

    @Override
    protected void onResume() {
        super.onResume();
        MediaPlayer.getInstance().resume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        MediaPlayer.getInstance().pause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        registerObserves(false);

        MediaPlayer.getInstance().stop();

        // 去掉loading
        if (DialogMaker.isShowing()) {
            DialogMaker.dismissProgressDialog();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.player_menu, menu);
        return super.onCreateOptionsMenu(menu);
    }

    private void parseIntent() {
        RoomInfo roomInfo = (RoomInfo) getIntent().getSerializableExtra(EXTRA_ROOM_INFO);
        roomId = roomInfo.getRoomId();
        onlineCount = roomInfo.getOnlineUserCount();
        pcAccount = roomInfo.getCreator();
        videoUrl1 = roomInfo.getRtmpPullUrl1();
        videoUrl2 = roomInfo.getRtmpPullUrl2();

        LogUtil.app("rtmp video url1=" + videoUrl1);
        LogUtil.app("rtmp video url2=" + videoUrl2);
    }

    private void setTitle() {
        ToolBarOptions options = new ToolBarOptions();
        options.titleString = "房间" + roomId + "-" + "观众" + onlineCount;
        options.isNeedNavigate = true;
        options.navigateId = R.mipmap.ic_white_back;
        setToolBar(R.id.toolbar, options);
    }

    private void findViews() {
        scrollView.setEnabled(false);

        Container container = new Container(this, roomId, SessionTypeEnum.ChatRoom, moduleProxy);
        if (inputPanel == null) {
            inputPanel = new ChatRoomInputPanel(container, rootView);
        } else {
            inputPanel.reload(container);
        }

        if (msgListPanel == null) {
            msgListPanel = new ChatRoomMsgListPanel(container, rootView);
        }
    }

    private void registerObserves(boolean register) {
        NIMChatRoomSDK.getChatRoomServiceObserve().observeReceiveMessage(incomingChatRoomMsg, register);
    }

    protected DefaultModuleProxy moduleProxy = new DefaultModuleProxy() {
        @Override
        public boolean sendMessage(IMMessage msg) {
            ChatRoomMessage message = (ChatRoomMessage) msg;

            NIMClient.getService(ChatRoomService.class).sendMessage(message, false)
                    .setCallback(new RequestCallback<Void>() {
                        @Override
                        public void onSuccess(Void param) {
                        }

                        @Override
                        public void onFailed(int code) {
                            if (code == ResponseCode.RES_CHATROOM_MUTED) {
                                Toast.makeText(PlayerActivityBase.this, "用户被禁言", Toast.LENGTH_SHORT).show();
                            } else if (code == ResponseCode.RES_CHATROOM_ROOM_MUTED) {
                                Toast.makeText(PlayerActivityBase.this, "全体禁言", Toast.LENGTH_SHORT).show();
                            } else {
                                Toast.makeText(PlayerActivityBase.this, "消息发送失败：code:" + code, Toast.LENGTH_SHORT).show();
                            }
                        }

                        @Override
                        public void onException(Throwable exception) {
                            Toast.makeText(PlayerActivityBase.this, "消息发送失败！", Toast.LENGTH_SHORT).show();
                        }
                    });
            msgListPanel.onMsgSend(message);
            return true;
        }

        @Override
        public void shouldCollapseInputPanel() {
            switchInputLayout(false);
        }
    };

    // 切换输入法
    protected void switchInputLayout(boolean isShow) {
        isInputShow = isShow;
        inputPanel.messageActivityBottomLayout.setVisibility(isShow ? View.VISIBLE : View.GONE);
        inputPanel.switchToTextLayout(isShow);

        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ScreenUtil.dip2px(100));
        if (isShow) {
            // 显示输入法
            lineLayout.setVisibility(View.GONE);
            params.addRule(RelativeLayout.ABOVE, R.id.messageActivityBottomLayout);
            params.setMargins(ScreenUtil.dip2px(15), 0, 0, ScreenUtil.dip2px(10));
            msgListPanel.messageListView.setLayoutParams(params);
        } else {
            params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
            params.setMargins(ScreenUtil.dip2px(15), 0, 0, ScreenUtil.dip2px(70));
            msgListPanel.messageListView.setLayoutParams(params);
            getHandler().postDelayed(() -> lineLayout.setVisibility(isShow ? View.GONE : View.VISIBLE), 200);
        }
    }

    private Observer<List<ChatRoomMessage>> incomingChatRoomMsg = (messages) -> {
        if (messages == null || messages.isEmpty()) {
            return;
        }

        for (ChatRoomMessage msg : messages) {
            // 只有text类型可以显示
            if (msg.getMsgType() == MsgTypeEnum.text) {
                msgListPanel.onIncomingMessage(msg);
            }
        }
    };
}
