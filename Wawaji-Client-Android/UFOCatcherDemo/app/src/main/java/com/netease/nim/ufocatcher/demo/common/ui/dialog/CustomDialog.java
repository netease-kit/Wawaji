package com.netease.nim.ufocatcher.demo.common.ui.dialog;

import android.app.AlertDialog;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.netease.nim.ufocatcher.demo.R;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * Created by winnie on 2017/11/27.
 */

public class CustomDialog extends AlertDialog {

    @BindView(R.id.title_image)
    ImageView titleImage;
    @BindView(R.id.title_text)
    TextView titleText;
    @BindView(R.id.content_text)
    TextView contentText;
    @BindView(R.id.cancel_btn)
    Button cancelBtn;
    @BindView(R.id.ok_btn)
    Button okBtn;
    @BindView(R.id.alert_root)
    LinearLayout alertRoot;
    private Context context;
    private OnDialogActionListener listener;

    public interface OnDialogActionListener {
        void doCancelAction();

        void doOkAction();
    }

    public CustomDialog(Context context) {
        super(context);
        this.context = context;
    }

    public CustomDialog(Context context, boolean cancelable, OnCancelListener cancelListener) {
        super(context, cancelable, cancelListener);
        this.context = context;
    }

    public CustomDialog(Context context, int themeResId) {
        super(context, themeResId);
        this.context = context;
    }

    public CustomDialog(Context context, OnDialogActionListener listener) {
        super(context);
        this.context = context;
        this.listener = listener;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.alert_item_layout);

        ButterKnife.bind(this);
    }

    @OnClick({R.id.cancel_btn, R.id.ok_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.cancel_btn:
                doCancel();
                break;
            case R.id.ok_btn:
                doOk();
                break;
        }
    }

    private void doOk() {
        dismiss();
        listener.doOkAction();
    }

    private void doCancel() {
        dismiss();
        listener.doCancelAction();
    }

    public void setTitleImage(int resId) {
        if (resId != 0) {
            titleImage.setBackgroundResource(resId);
        }
    }

    public void setTitle(int title) {
        titleText.setText(context.getText(title));
    }

    public void setContent(int content) {
        contentText.setText(context.getText(content));
    }

    public void setBackground(int resId) {
        if (resId != 0) {
            alertRoot.setBackgroundResource(resId);
        }
    }
}
