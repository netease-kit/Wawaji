package com.netease.mmc.demo.common.exception;

import com.netease.mmc.demo.common.enums.HttpCodeEnum;

/**
 * 用户账号相关异常
 *
 * @author hzwanglin1
 * @date 2017/6/5
 * @since 1.0
 */
public class UserException extends AbstractCustomException{

	private static final long serialVersionUID = -8494642490434315309L;

	private int res = HttpCodeEnum.USER_ERROR.value();

    public UserException() {
    	super(HttpCodeEnum.USER_ERROR.getReasonPhrase());
	}

	public UserException(String msg){
		super(msg);
	}

	public UserException(HttpCodeEnum code) {
		this(code.value(), code.getReasonPhrase());
	}

	public UserException(int res, String msg){
		super(msg);
		this.res = res;
	}

	public int getRes(){
		return res;
	}
}
