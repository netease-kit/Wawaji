package com.netease.nim.ufocatcher.demo.ui.module;

import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * Created by huangjun on 2017/11/24.
 */

public class DefaultModuleProxy implements ModuleProxy {
    @Override
    public boolean sendMessage(IMMessage msg) {
        return false;
    }

    @Override
    public void onInputPanelExpand() {

    }

    @Override
    public void shouldCollapseInputPanel() {

    }

    @Override
    public boolean isLongClickEnabled() {
        return false;
    }

    @Override
    public void onItemFooterClick(IMMessage message) {

    }
}
