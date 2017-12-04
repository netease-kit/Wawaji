package com.netease.nim.ufocatcher.demo.ui.adapter;

import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.netease.nim.ufocatcher.demo.R;
import com.netease.nim.ufocatcher.demo.app.AppCache;
import com.netease.nimlib.sdk.chatroom.model.ChatRoomMessage;

import java.util.LinkedList;

/**
 * Created by winnie on 2017/11/20.
 */

public class MsgAdapter extends RecyclerView.Adapter<MsgAdapter.ViewHolder> implements View.OnClickListener{

    private LinkedList<ChatRoomMessage> items;

    private OnItemClickListener mOnItemClickListener = null;

    public interface OnItemClickListener {
        void onItemClick(View view , int position);
    }

    public MsgAdapter(LinkedList<ChatRoomMessage> items) {
        this.items = items;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.message_item_text, parent,false);
        ViewHolder holder = new ViewHolder(view);
        view.setOnClickListener(this);
        return holder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        ChatRoomMessage message = items.get(position);

        if (message.getChatRoomMessageExtension() != null) {
            String nick = message.getChatRoomMessageExtension().getSenderNick();
            holder.nameText.setText(TextUtils.isEmpty(nick) ? message.getFromAccount() : nick);
        } else {
            holder.nameText.setText(TextUtils.isEmpty(AppCache.getLoginInfo().getNickname()) ? AppCache.getLoginInfo().getAccount()
                    : AppCache.getLoginInfo().getNickname());
        }
        holder.bodyText.setText(message.getContent());

        holder.itemView.setTag(position);
    }

    @Override
    public int getItemCount() {
        return items == null ? 0 : items.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView bodyText;
        public TextView nameText;

        public ViewHolder(View itemView) {
            super(itemView);
            bodyText = itemView.findViewById(R.id.nim_message_item_text_body);
            nameText = itemView.findViewById(R.id.message_item_name);
        }
    }

    @Override
    public void onClick(View v) {
        if (mOnItemClickListener != null) {
            mOnItemClickListener.onItemClick(v,(int)v.getTag());
        }
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.mOnItemClickListener = listener;
    }

}
