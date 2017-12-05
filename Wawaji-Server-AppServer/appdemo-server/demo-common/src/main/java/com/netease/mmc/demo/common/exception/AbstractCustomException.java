package com.netease.mmc.demo.common.exception;

import com.netease.mmc.demo.common.enums.HttpCodeEnum;

/**
 * 业务逻辑异常抽象父类.
 *
 * @author hzwanglin1
 * @date 2017/6/29
 * @since 1.0
 */
public abstract class AbstractCustomException extends RuntimeException{

    private static final long serialVersionUID = 5173318776457547338L;

    private int res = HttpCodeEnum.BAD_REQUEST.value();

    public AbstractCustomException(String msg) {
        super(msg);
    }

    public int getRes() {
        return res;
    }
}
