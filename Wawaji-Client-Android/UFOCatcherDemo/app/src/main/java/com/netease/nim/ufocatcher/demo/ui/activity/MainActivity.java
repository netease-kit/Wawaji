package com.netease.nim.ufocatcher.demo.ui.activity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import com.netease.nim.ufocatcher.demo.R;
import com.netease.nim.ufocatcher.demo.common.log.LogUtil;
import com.netease.nim.ufocatcher.demo.common.recyclerview.BaseQuickAdapter;
import com.netease.nim.ufocatcher.demo.common.recyclerview.decoration.SpacingDecoration;
import com.netease.nim.ufocatcher.demo.common.recyclerview.listener.OnItemClickListener;
import com.netease.nim.ufocatcher.demo.common.ui.ToolBarOptions;
import com.netease.nim.ufocatcher.demo.common.ui.UI;
import com.netease.nim.ufocatcher.demo.common.utils.ScreenUtil;
import com.netease.nim.ufocatcher.demo.protocol.DemoServerController;
import com.netease.nim.ufocatcher.demo.protocol.model.RoomInfo;
import com.netease.nim.ufocatcher.demo.support.permission.MPermission;
import com.netease.nim.ufocatcher.demo.support.permission.annotation.OnMPermissionDenied;
import com.netease.nim.ufocatcher.demo.support.permission.annotation.OnMPermissionGranted;
import com.netease.nim.ufocatcher.demo.support.permission.annotation.OnMPermissionNeverAskAgain;
import com.netease.nim.ufocatcher.demo.ui.adapter.ChatRoomListAdapter;
import com.netease.nimlib.sdk.avchat.AVChatManager;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class MainActivity extends UI {
    private static final long FETCH_ROOM_LIST_DELTA_TIME = 30 * 1000;

    private static long lastFetchRoomListTime;

    @BindView(R.id.recycler_view)
    RecyclerView recyclerView;
    @BindView(R.id.layout_swipe_refresh)
    SwipeRefreshLayout swipeRefreshLayout;

    private ChatRoomListAdapter adapter;

    public static void start(Context context) {
        start(context, null);
    }

    public static void start(Context context, Intent extras) {
        Intent intent = new Intent();
        intent.setClass(context, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        if (extras != null) {
            intent.putExtras(extras);
        }
        context.startActivity(intent);
    }

    @Override
    public void onBackPressed() {
        moveTaskToBack(true); // 将activity 退到后台，不是finish()退出。
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        setTitle();

        ButterKnife.bind(this);

        findViews();
        fetchRoomList(false);
        checkPermission();
    }

    @Override
    protected void onResume() {
        super.onResume();

        fetchRoomList(false); // 回退到此界面
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.main_menu, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.about_menu_btn:
                startActivity(new Intent(MainActivity.this, AboutActivity.class));
            default:
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void setTitle() {
        ToolBarOptions options = new ToolBarOptions();
        options.titleString = getString(R.string.main_title);
        options.isNeedNavigate = false;
        setToolBar(R.id.toolbar, options);
    }

    private void findViews() {
        adapter = new ChatRoomListAdapter(recyclerView);
        recyclerView.setAdapter(adapter);
        adapter.openLoadAnimation(BaseQuickAdapter.ALPHAIN);
        recyclerView.setLayoutManager(new GridLayoutManager(this, 2));
        recyclerView.addItemDecoration(new SpacingDecoration(ScreenUtil.dip2px(10), ScreenUtil.dip2px(10), true));
        recyclerView.addOnItemTouchListener(new OnItemClickListener<ChatRoomListAdapter>() {
            @Override
            public void onItemClick(ChatRoomListAdapter adapter, View view, int position) {
                RoomInfo roomInfo = adapter.getItem(position);
                if (roomInfo.isRoomStatus()) {
                    PlayerActivity.startActivity(MainActivity.this, roomInfo);
                } else {
                    Toast.makeText(MainActivity.this, "敬请期待！", Toast.LENGTH_SHORT).show();
                }
            }
        });
        swipeRefreshLayout.setOnRefreshListener(() -> {
            fetchRoomList(true);
        });
    }

    private void fetchRoomList(boolean force) {
        if (force || System.currentTimeMillis() - lastFetchRoomListTime > FETCH_ROOM_LIST_DELTA_TIME) {
            DemoServerController.getInstance().fetchRoomList(new DemoServerController.IHttpCallback<List<RoomInfo>>() {
                @Override
                public void onSuccess(List<RoomInfo> rooms) {
                    LogUtil.app("fetch room list success! rooms size=" + rooms.size());
                    onFetchDone();
                    adapter.setNewData(rooms);
                }

                @Override
                public void onFailed(int code, String error) {
                    LogUtil.app("fetch room list failed! code=" + code + ", error=" + error);
                    onFetchDone();
                    Toast.makeText(MainActivity.this, "fetch data error, code:" + code, Toast.LENGTH_SHORT).show();

                }
            });
            LogUtil.app("fetch room list...");
            lastFetchRoomListTime = System.currentTimeMillis();
        } else {
            LogUtil.app("frequency control!");
        }
    }

    private void onFetchDone() {
        swipeRefreshLayout.setRefreshing(false);
        adapter.closeLoadAnimation();
    }

    /**
     * *************************** 权限管理 ***************************
     */
    private static final int BASIC_PERMISSION_REQUEST_CODE = 0x100;

    private void checkPermission() {
        List<String> lackPermissions = AVChatManager.getInstance().checkPermission(MainActivity.this);
        if (lackPermissions.isEmpty()) {
            onBasicPermissionSuccess();
        } else {
            String[] permissions = new String[lackPermissions.size()];
            for (int i = 0; i < lackPermissions.size(); i++) {
                permissions[i] = lackPermissions.get(i);
            }
            MPermission.with(MainActivity.this)
                    .setRequestCode(BASIC_PERMISSION_REQUEST_CODE)
                    .permissions(permissions)
                    .request();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        MPermission.onRequestPermissionsResult(this, requestCode, permissions, grantResults);
    }

    @OnMPermissionGranted(BASIC_PERMISSION_REQUEST_CODE)
    public void onBasicPermissionSuccess() {
        LogUtil.app("permission check ok!");
    }

    @OnMPermissionDenied(BASIC_PERMISSION_REQUEST_CODE)
    @OnMPermissionNeverAskAgain(BASIC_PERMISSION_REQUEST_CODE)
    public void onBasicPermissionFailed() {
        Toast.makeText(this, "娃娃机所需权限未全部授权，部分功能可能无法正常运行！", Toast.LENGTH_SHORT).show();
    }
}
