package com.netease.nim.ufocatcher.demo.protocol;

import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.netease.nim.ufocatcher.demo.app.AppCache;
import com.netease.nim.ufocatcher.demo.common.log.LogUtil;
import com.netease.nimlib.sdk.NIMChatRoomSDK;
import com.netease.nimlib.sdk.Observer;
import com.netease.nimlib.sdk.RequestCallbackWrapper;
import com.netease.nimlib.sdk.ResponseCode;
import com.netease.nimlib.sdk.chatroom.model.ChatRoomMessage;
import com.netease.nimlib.sdk.chatroom.model.ChatRoomNotificationAttachment;
import com.netease.nimlib.sdk.chatroom.model.ChatRoomPartClearAttachment;
import com.netease.nimlib.sdk.chatroom.model.ChatRoomQueueChangeAttachment;
import com.netease.nimlib.sdk.msg.attachment.MsgAttachment;
import com.netease.nimlib.sdk.msg.constant.ChatRoomQueueChangeType;
import com.netease.nimlib.sdk.msg.constant.MsgTypeEnum;
import com.netease.nimlib.sdk.msg.constant.NotificationType;
import com.netease.nimlib.sdk.util.Entry;

import java.util.ArrayList;
import java.util.List;

/**
 * 聊天室队列控制器
 * <p>
 * Created by huangjun on 2017/11/22.
 */

public class QueueController {
    private static final String QUEUE_ITEM_VALUE_JSON_KEY_NICK = "nick";

    private String roomId;
    private boolean messageObserverRegistered;
    private boolean inQueue;
    private Observer<QueueInfo> observer;

    private List<Entry<String, String>> queue = new ArrayList<>();
    private boolean queueInit;

    public class QueueInfo {
        String firstItemAccount;
        String firstItemNickname;
        int waitingCount;
        boolean selfInQueue;

        QueueInfo(String firstItemAccount, String firstItemNickname, int waitingCount, boolean selfInQueue) {
            this.firstItemAccount = firstItemAccount;
            this.firstItemNickname = firstItemNickname;
            this.waitingCount = waitingCount;
            this.selfInQueue = selfInQueue;
        }

        @Override
        public String toString() {
            return "QueueInfo{" +
                    "firstItemAccount='" + firstItemAccount + '\'' +
                    ", firstItemNickname='" + firstItemNickname + '\'' +
                    ", waitingCount=" + waitingCount +
                    ", selfInQueue=" + selfInQueue +
                    '}';
        }

        public String getFirstItemAccount() {
            return firstItemAccount;
        }

        public String getFirstItemNickname() {
            return firstItemNickname;
        }

        public int getWaitingCount() {
            return waitingCount;
        }

        public boolean isSelfInQueue() {
            return selfInQueue;
        }
    }

    /**
     * ********************************** 对外接口 *******************************
     */

    public void init(final String roomId) {
        this.roomId = roomId;
        inQueue = false;
        queueInit = false; // 过程中，收到队列变更通知不做处理知道fetch完成

        // 可能反复初始化
        if (!messageObserverRegistered) {
            NIMChatRoomSDK.getChatRoomServiceObserve().observeReceiveMessage(messageObserver, true);
            messageObserverRegistered = true;
        }

        // 获取最新数据
        NIMChatRoomSDK.getChatRoomService().fetchQueue(roomId)
                .setCallback(new RequestCallbackWrapper<List<Entry<String, String>>>() {
                    @Override
                    public void onResult(int code, List<Entry<String, String>> result, Throwable exception) {
                        if (code == ResponseCode.RES_SUCCESS) {
                            queue.clear();
                            if (result != null && result.size() > 0) {
                                queue.addAll(result);
                            }
                            queueInit = true;
                            LogUtil.app("fetch queue done, size=" + queue.size());
                            notifyQueueInfo(); // 通知最新数据
                        } else {
                            LogUtil.app("fetch queue failed, code=" + code);
                        }
                    }
                });
    }

    public void destroy() {
        if (messageObserverRegistered) {
            NIMChatRoomSDK.getChatRoomServiceObserve().observeReceiveMessage(messageObserver, false);
            messageObserverRegistered = false;
        }

        observer = null;
        inQueue = false;
        queueInit = false;
        queue.clear();
        roomId = null;
    }

    public void addQueue(RequestCallbackWrapper<Void> callback) {
        if (roomId == null) {
            return;
        }

        final String key = AppCache.getLoginInfo().getAccount();
        JSONObject val = new JSONObject();
        val.put(QUEUE_ITEM_VALUE_JSON_KEY_NICK, AppCache.getLoginInfo().getNickname());

        NIMChatRoomSDK.getChatRoomService().updateQueueEx(roomId, key, val.toJSONString(), true)
                .setCallback(new RequestCallbackWrapper<Void>() {
                    @Override
                    public void onResult(int code, Void result, Throwable exception) {
                        if (code == ResponseCode.RES_SUCCESS) {
                            inQueue = true;
                            LogUtil.app("add queue success, key=" + key);
                        } else {
                            LogUtil.app("add queue failed, code=" + code);
                        }

                        if (callback != null) {
                            callback.onResult(code, result, exception);
                        }
                    }
                });
    }

    public void cancelQueue(RequestCallbackWrapper<Void> callback) {
        if (roomId == null) {
            return;
        }

        String key = AppCache.getLoginInfo().getAccount();
        NIMChatRoomSDK.getChatRoomService().pollQueue(roomId, key)
                .setCallback(new RequestCallbackWrapper<Entry<String, String>>() {
                    @Override
                    public void onResult(int code, Entry<String, String> result, Throwable exception) {
                        if (code == ResponseCode.RES_SUCCESS) {
                            inQueue = false;
                            LogUtil.app("cancel queue success, key=" + key);
                        } else {
                            LogUtil.app("cancel queue failed, code=" + code);
                        }

                        if (callback != null) {
                            callback.onResult(code, null, exception);
                        }
                    }
                });
    }

    public void observeQueueChange(Observer<QueueInfo> observer, boolean register) {
        if (observer == null) {
            return;
        }

        if (register) {
            this.observer = observer;
        } else {
            this.observer = null;
        }
    }

    /**
     * ********************************** 队列变更维护 *******************************
     */

    private class QueueChangedItem {
        int type; // 1 增加 2 移除 3清空
        String key;
        String value;

        QueueChangedItem(int type, String key, String value) {
            this.type = type;
            this.key = key;
            this.value = value;
        }
    }

    private Observer<List<ChatRoomMessage>> messageObserver = (messages) -> {
        if (!queueInit) {
            return; // 队列还没有初始化好，扔掉数据
        }

        if (messages == null || messages.isEmpty()) {
            return;
        }

        List<ChatRoomMessage> pending = new ArrayList<>(messages.size()); // 待处理的消息
        for (ChatRoomMessage message : messages) {
            if (message.getMsgType() == MsgTypeEnum.notification) {
                MsgAttachment attachment = message.getAttachment();
                if (attachment instanceof ChatRoomNotificationAttachment) {
                    ChatRoomNotificationAttachment notificationAttachment = (ChatRoomNotificationAttachment) attachment;
                    if (notificationAttachment.getType() == NotificationType.CHATROOM_QUEUE_BATCH_CHANGE ||
                            notificationAttachment.getType() == NotificationType.ChatRoomQueueChange) {
                        pending.add(message);
                    }
                }
            }
        }

        onReceiveQueueChangedMessage(pending);
    };

    private void onReceiveQueueChangedMessage(final List<ChatRoomMessage> messages) {
        if (messages == null || messages.isEmpty()) {
            return;
        }

        List<QueueChangedItem> pending = new ArrayList<>(messages.size());
        for (ChatRoomMessage message : messages) {
            if (message.getAttachment() instanceof ChatRoomQueueChangeAttachment) {
                ChatRoomQueueChangeAttachment attachment = (ChatRoomQueueChangeAttachment) message.getAttachment();
                // type 1 2 3
                pending.add(new QueueChangedItem(attachment.getChatRoomQueueChangeType().getValue(),
                        attachment.getKey(), attachment.getContent()));
            } else if (message.getAttachment() instanceof ChatRoomPartClearAttachment) {
                ChatRoomPartClearAttachment attachment = (ChatRoomPartClearAttachment) message.getAttachment();
                for (String key : attachment.getContentMap().keySet()) {
                    // batch poll as 2
                    pending.add(new QueueChangedItem(ChatRoomQueueChangeType.POLL.getValue(), key, null));
                }
            }
        }

        onConsumeChange(pending); // 处理变更
        notifyQueueInfo(); // 通知最新数据
    }

    private void onConsumeChange(final List<QueueChangedItem> pending) {
        for (QueueChangedItem item : pending) {
            final int type = item.type;
            final String key = item.key;
            final String value = item.value;
            final boolean self = key.equals(AppCache.getLoginInfo().getAccount()); // 是否操作的是自己
            int existIndex;
            switch (type) {
                case 1:
                    existIndex = findQueueItem(key);
                    if (existIndex < 0) {
                        queue.add(new Entry<>(key, value)); // add
                        LogUtil.app("add queue item, key=" + key);
                    } else {
                        queue.set(existIndex, new Entry<>(key, value)); //update
                        LogUtil.app("update queue item, key=" + key + ", new value=" + value);
                    }
                    if (self) {
                        inQueue = true; // 自己加入了队列
                    }
                    break;
                case 2:
                    existIndex = findQueueItem(key);
                    if (existIndex >= 0) {
                        queue.remove(existIndex); // delete
                        if (self) {
                            inQueue = false; // 自己被移除了
                        }
                        LogUtil.app("remove queue item, key=" + key);
                    }
                    break;
                case 3:
                    queue.clear(); // clear all
                    inQueue = false;
                    LogUtil.app("clear all queue items!!!");
                    break;
                default:
                    LogUtil.app("invalid type on consume pending change!!!");
                    break;
            }
        }
        pending.clear(); // pending done
    }

    private void notifyQueueInfo() {
        // 变更回调
        if (observer != null) {
            if (queue.size() > 0) {
                Entry<String, String> firstItem = queue.get(0);
                String firstItemAccount = firstItem.key;
                String firstItemNickname = null;
                try {
                    JSONObject value = JSONObject.parseObject(firstItem.value);
                    firstItemNickname = value.getString(QUEUE_ITEM_VALUE_JSON_KEY_NICK);
                } catch (JSONException e) {
                    e.printStackTrace();
                    LogUtil.app("notifyQueueInfo parse json to parse nickname throw error=" + e.getMessage());
                }

                int waitingCount = inQueue ? findQueueItem(AppCache.getLoginInfo().getAccount()) : queue.size();

                if (waitingCount < 0) {
                    waitingCount = 0;
                }
                QueueInfo info = new QueueInfo(firstItemAccount, firstItemNickname, waitingCount, inQueue);
                LogUtil.app("notify " + info);
                observer.onEvent(info);
            } else {
                observer.onEvent(new QueueInfo(null, null, 0, false));
            }
        }

        // log
        printQueue();
    }

    private int findQueueItem(final String key) {
        for (int i = 0; i < queue.size(); i++) {
            if (key.equals(queue.get(i).key)) {
                return i;
            }
        }

        return -1;
    }

    private void printQueue() {
        if (queue.isEmpty()) {
            LogUtil.app("queue is empty!");
            return;
        }

        LogUtil.app("------------- queue -------------");
        String key;
        String value;
        for (int i = 0; i < queue.size(); i++) {
            key = queue.get(i).key;
            value = queue.get(i).value;
            String tag = key.equals(AppCache.getLoginInfo().getAccount()) ? "<--" : "";
            LogUtil.app("* " + (i + 1) + "." + key + " " + value + " " + tag);
        }
        LogUtil.app("------------- queue -------------");
    }
}
