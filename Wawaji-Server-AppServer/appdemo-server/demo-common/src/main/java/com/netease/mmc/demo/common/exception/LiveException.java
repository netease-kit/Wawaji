package com.netease.mmc.demo.common.exception;

import com.netease.mmc.demo.common.enums.HttpCodeEnum;

/**
 * 直播相关异常.
 *
 * @author hzwanglin1
 * @date 2017/6/6
 * @since 1.0
 */
public class LiveException extends AbstractCustomException{

    private static final long serialVersionUID = -3379637664740491223L;

    private int res = HttpCodeEnum.LIVE_ERROR.value();

    public LiveException() {
        super(HttpCodeEnum.LIVE_ERROR.getReasonPhrase());
    }

    public LiveException(String msg){
        super(msg);
    }

    public LiveException(HttpCodeEnum code) {
        this(code.value(), code.getReasonPhrase());
    }

    public LiveException(int res, String msg){
        super(msg);
        this.res = res;
    }

    public int getRes(){
        return res;
    }
}
