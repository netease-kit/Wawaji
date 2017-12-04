package com.netease.nim.ufocatcher.demo.ui.adapter;

import android.support.v7.widget.RecyclerView;
import android.widget.ImageView;
import android.widget.TextView;

import com.netease.nim.ufocatcher.demo.R;
import com.netease.nim.ufocatcher.demo.common.recyclerview.BaseQuickAdapter;
import com.netease.nim.ufocatcher.demo.common.recyclerview.holder.BaseViewHolder;
import com.netease.nim.ufocatcher.demo.protocol.model.RoomInfo;
import com.netease.nim.ufocatcher.demo.ui.activity.MainActivity;

/**
 * 聊天室列表数据适配器
 * Created by huangjun on 2016/12/9.
 */
public class ChatRoomListAdapter extends BaseQuickAdapter<RoomInfo, BaseViewHolder> {
    private final static int COUNT_LIMIT = 10000;

    public ChatRoomListAdapter(RecyclerView recyclerView) {
        super(recyclerView, R.layout.chat_room_item, null);
    }

    @Override
    protected void convert(BaseViewHolder holder, RoomInfo room, int position, boolean isScrolling) {
        // bg
        holder.getConvertView().setBackgroundResource(R.drawable.nim_list_item_bg_selecter);
        // cover
        ImageView coverImage = holder.getView(R.id.cover_image);
        ChatRoomHelper.setCoverImage(room.getRoomId(), coverImage, false);
        // name
        holder.setText(R.id.tv_name, room.getName());
        // online count
        TextView onlineCountText = holder.getView(R.id.tv_online_count);
        if (!room.isRoomStatus()) {
            onlineCountText.setText(R.string.please_waiting);
        } else {
            setOnlineCount(onlineCountText, room);
        }
    }

    private void setOnlineCount(TextView onlineCountText, RoomInfo room) {
        if (room.getQueueCount() == 0) {
            onlineCountText.setText(R.string.idle);
            onlineCountText.setTextColor(mContext.getResources().getColor(R.color.color_green_5ccd84));
        } else if (room.getOnlineUserCount() < COUNT_LIMIT) {
            onlineCountText.setText(String.valueOf(room.getQueueCount()) + "人排队");
            onlineCountText.setTextColor(mContext.getResources().getColor(R.color.color_red_ff7849));
        } else if (room.getOnlineUserCount() >= COUNT_LIMIT) {
            onlineCountText.setText(String.format("%.1f", room.getQueueCount() / (float) COUNT_LIMIT) + "万人排队");
            onlineCountText.setTextColor(mContext.getResources().getColor(R.color.color_red_ff7849));
        }
    }
}
