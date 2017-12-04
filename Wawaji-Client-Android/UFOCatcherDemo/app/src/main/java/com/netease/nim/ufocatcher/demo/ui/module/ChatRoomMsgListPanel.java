package com.netease.nim.ufocatcher.demo.ui.module;

import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import com.netease.nim.ufocatcher.demo.R;
import com.netease.nim.ufocatcher.demo.ui.adapter.MsgAdapter;
import com.netease.nimlib.sdk.chatroom.model.ChatRoomMessage;

import java.util.LinkedList;

/**
 * 消息列表
 * Created by winnie on 2017/11/20.
 */

public class ChatRoomMsgListPanel {
    private static final int MESSAGE_CAPACITY = 500;

    // data
    private Container container;
    private MsgAdapter adapter;
    private LinkedList<ChatRoomMessage> items;

    private View rootView;
    public RecyclerView messageListView;

    public ChatRoomMsgListPanel(Container container, View rootView) {
        this.container = container;
        this.rootView = rootView;

        init();
    }

    private void init() {
        initRecyclerView();
    }

    private void initRecyclerView() {
        LinearLayoutManager layoutManager = new LinearLayoutManager(container.activity);
        messageListView = rootView.findViewById(R.id.recycler_view);
        messageListView.setLayoutManager(layoutManager);
        items = new LinkedList<>();
        adapter = new MsgAdapter(items);
        messageListView.setAdapter(adapter);

        messageListView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                if (newState != RecyclerView.SCROLL_STATE_IDLE) {
                    container.proxy.shouldCollapseInputPanel();
                }
            }
        });
        adapter.setOnItemClickListener((view, position) -> {
            container.proxy.shouldCollapseInputPanel();
        });
    }

    // 发送消息后，更新本地消息列表
    public void onMsgSend(ChatRoomMessage message) {
        saveMessage(message);

        adapter.notifyDataSetChanged();
        doScrollToBottom();
    }

    private void saveMessage(final ChatRoomMessage message) {
        if (message == null) {
            return;
        }

        if (items.size() >= MESSAGE_CAPACITY) {
            items.poll();
        }

        items.add(message);
    }

    private void doScrollToBottom() {
        messageListView.scrollToPosition(adapter.getItemCount() - 1);
    }

    // 收到新消息 显示
    public void onIncomingMessage(ChatRoomMessage message) {
        boolean needRefresh = false;
        // 保证显示到界面上的消息，来自同一个聊天室
        if (isMyMessage(message)) {
            saveMessage(message);
            needRefresh = true;
        }

        if (needRefresh) {
            adapter.notifyDataSetChanged();
        }

        doScrollToBottom();
    }


    public boolean isMyMessage(ChatRoomMessage message) {
        return message.getSessionType() == container.sessionType
                && message.getSessionId() != null
                && message.getSessionId().equals(container.account);
    }
}
