package com.netease.nim.ufocatcher.demo.common.net;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import com.netease.nim.ufocatcher.demo.common.log.LogUtil;

public class ConnectivityWatcher {

    public interface Callback {
        void onNetworkEvent(NetworkEnums.Event event);
    }

    private Callback mCallback;
    private Context mContext;

    private boolean mAvailable;
    private String mTypeName;

    public ConnectivityWatcher(Context context, Callback callback) {
        mContext = context;
        mCallback = callback;
    }

    public boolean isAvailable() {
        return mAvailable || NetworkUtil.isNetworkConnected(mContext);
    }

    public void startup() {
        ConnectivityManager cm = (ConnectivityManager) mContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo info = cm.getActiveNetworkInfo();
            mAvailable = (info != null && info.isAvailable());
            mTypeName = mAvailable ? info.getTypeName() : null;
        }

        IntentFilter filter = new IntentFilter();
        filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);

        mContext.registerReceiver(mReceiver, filter);
    }

    public void shutdown() {
        mContext.unregisterReceiver(mReceiver);
    }

    private BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm != null) {
                String action = intent.getAction();
                if (ConnectivityManager.CONNECTIVITY_ACTION.equals(action)) {
                    NetworkInfo info = cm.getActiveNetworkInfo();
                    boolean available = info != null && info.isAvailable();
                    String typeName = available ? info.getTypeName() : null;
                    if (mAvailable != available) {
                        // update
                        mAvailable = available;
                        mTypeName = typeName;

                        // notify
                        onAvailable(available);
                    } else if (mAvailable) {
                        if (!typeName.equals(mTypeName)) {
                            // update
                            mTypeName = typeName;

                            // notify
                            notifyEvent(NetworkEnums.Event.NETWORK_CHANGE);
                        }
                    }
                }
            }
        }
    };

    private void onAvailable(boolean available) {
        if (available) {
            notifyEvent(NetworkEnums.Event.NETWORK_AVAILABLE);
        } else {
            notifyEvent(NetworkEnums.Event.NETWORK_UNAVAILABLE);
        }
    }

    private void notifyEvent(NetworkEnums.Event event) {
        if (mCallback != null) {
            mCallback.onNetworkEvent(event);
        }

        if (mAvailable) {
            LogUtil.app("network type changed to: " + mTypeName);
        }
    }
}
