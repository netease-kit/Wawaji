package com.netease.nim.ufocatcher.demo.ui.module;

import android.view.View;

import com.netease.nimlib.sdk.chatroom.ChatRoomMessageBuilder;
import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * Created by huangjun on 2017/9/18.
 */
public class ChatRoomInputPanel extends InputPanel {

    public ChatRoomInputPanel(Container container, View view) {
        super(container, view);
    }

    @Override
    protected IMMessage createTextMessage(String text) {
        return ChatRoomMessageBuilder.createChatRoomTextMessage(container.account, text);
    }
}
