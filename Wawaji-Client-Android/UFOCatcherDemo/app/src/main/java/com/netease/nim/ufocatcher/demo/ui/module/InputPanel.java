package com.netease.nim.ufocatcher.demo.ui.module;

import android.content.Context;
import android.os.Handler;
import android.text.Editable;
import android.text.InputType;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.netease.nim.ufocatcher.demo.R;
import com.netease.nim.ufocatcher.demo.common.utils.StringUtil;
import com.netease.nimlib.sdk.msg.MessageBuilder;
import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * 底部文本编辑等模块
 * Created by hzxuwen on 2015/6/16.
 */
public class InputPanel {

    private static final String TAG = "MsgSendLayout";

    private static final int SHOW_LAYOUT_DELAY = 200;

    protected Container container;
    protected View view;
    protected Handler uiHandler;

    protected View actionPanelBottomLayout; // 更多布局
    public LinearLayout messageActivityBottomLayout;
    protected EditText messageEditText;// 文本消息编辑框
    protected View sendMessageButtonInInputBar;// 发送消息按钮
    protected View messageInputBar;

    // 语音
    private boolean isKeyboardShowed = true; // 是否显示键盘

    public InputPanel(Container container, View view) {
        this.container = container;
        this.view = view;
        this.uiHandler = new Handler();
        init();
    }

    public boolean collapse(boolean immediately) {
        boolean respond = (actionPanelBottomLayout != null && actionPanelBottomLayout.getVisibility() == View.VISIBLE);

        hideAllInputLayout(immediately);

        return respond;
    }

    private void init() {
        initViews();
        initInputBarListener();
        initTextEdit();
        restoreText(false);
    }


    public void reload(Container container) {
        this.container = container;
    }

    private void initViews() {
        // input bar
        messageActivityBottomLayout = (LinearLayout) view.findViewById(R.id.messageActivityBottomLayout);
        messageInputBar = view.findViewById(R.id.textMessageLayout);
        sendMessageButtonInInputBar = view.findViewById(R.id.buttonSendMessage);
        messageEditText = (EditText) view.findViewById(R.id.editTextMessage);

    }

    private void initInputBarListener() {
        sendMessageButtonInInputBar.setOnClickListener(clickListener);
    }

    private void initTextEdit() {
        messageEditText.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        messageEditText.setOnTouchListener(new View.OnTouchListener() {

            public boolean onTouch(View v, MotionEvent event) {
                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    switchToTextLayout(true);
                }
                return false;
            }
        });
        messageEditText.setOnFocusChangeListener(new View.OnFocusChangeListener() {

            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                messageEditText.setHint("");
            }
        });

        messageEditText.addTextChangedListener(new TextWatcher() {
            private int start;
            private int count;

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                this.start = start;
                this.count = count;
            }

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void afterTextChanged(Editable s) {
                int editEnd = messageEditText.getSelectionEnd();
                messageEditText.removeTextChangedListener(this);
                while (StringUtil.counterChars(s.toString()) > 5000 && editEnd > 0) {
                    s.delete(editEnd - 1, editEnd);
                    editEnd--;
                }
                messageEditText.setSelection(editEnd);
                messageEditText.addTextChangedListener(this);
            }
        });
    }

    /**
     * ************************* 键盘布局切换 *******************************
     */

    private View.OnClickListener clickListener = new View.OnClickListener() {

        @Override
        public void onClick(View v) {
            if (v == sendMessageButtonInInputBar) {
                onTextMessageSendButtonPressed();
            }
        }
    };

    // 发送文本消息
    private void onTextMessageSendButtonPressed() {
        String text = messageEditText.getText().toString();
        if (TextUtils.isEmpty(text.trim())) {
            Toast.makeText(container.activity, "请不要发送空消息!", Toast.LENGTH_SHORT).show();
            return;
        }
        IMMessage textMessage = createTextMessage(text);

        if (container.proxy.sendMessage(textMessage)) {
            restoreText(true);
        }
    }

    protected IMMessage createTextMessage(String text) {
        return MessageBuilder.createTextMessage(container.account, container.sessionType, text);
    }

    // 点击edittext，切换键盘和更多布局
    public void switchToTextLayout(boolean needShowInput) {
        messageEditText.setVisibility(View.VISIBLE);

        messageInputBar.setVisibility(View.VISIBLE);

        if (needShowInput) {
            uiHandler.postDelayed(showTextRunnable, SHOW_LAYOUT_DELAY);
        } else {
            hideInputMethod();
        }
    }

    // 隐藏键盘布局
    private void hideInputMethod() {
        isKeyboardShowed = false;
        uiHandler.removeCallbacks(showTextRunnable);
        InputMethodManager imm = (InputMethodManager) container.activity.getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(messageEditText.getWindowToken(), 0);
        messageEditText.clearFocus();
    }

    // 显示键盘布局
    private void showInputMethod() {
        messageEditText.requestFocus();
        //如果已经显示,则继续操作时不需要把光标定位到最后
        if (!isKeyboardShowed) {
            messageEditText.setSelection(messageEditText.getText().length());
            isKeyboardShowed = true;
        }


        InputMethodManager imm = (InputMethodManager) container.activity.getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.showSoftInput(messageEditText, 0);

        container.proxy.onInputPanelExpand();
    }


    private Runnable showTextRunnable = new Runnable() {
        @Override
        public void run() {
            showInputMethod();
        }
    };

    private void restoreText(boolean clearText) {
        if (clearText) {
            messageEditText.setText("");
        }

    }

    private Runnable hideAllInputLayoutRunnable;

    /**
     * 隐藏所有输入布局
     */
    private void hideAllInputLayout(boolean immediately) {
        if (hideAllInputLayoutRunnable == null) {
            hideAllInputLayoutRunnable = new Runnable() {

                @Override
                public void run() {
                    hideInputMethod();
                }
            };
        }
        long delay = immediately ? 0 : ViewConfiguration.getDoubleTapTimeout();
        uiHandler.postDelayed(hideAllInputLayoutRunnable, delay);
    }
}
