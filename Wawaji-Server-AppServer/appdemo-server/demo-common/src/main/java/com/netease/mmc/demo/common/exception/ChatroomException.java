package com.netease.mmc.demo.common.exception;

import com.netease.mmc.demo.common.enums.HttpCodeEnum;

/**
 * 聊天室相关异常
 *
 * @author hzwanglin1
 * @date 2017/6/5
 * @since 1.0
 */
public class ChatroomException extends AbstractCustomException{

	private static final long serialVersionUID = -89131975089238959L;

	private int res = HttpCodeEnum.CHATROOM_ERROR.value();

    public ChatroomException() {
    	super(HttpCodeEnum.CHATROOM_ERROR.getReasonPhrase());
	}

	public ChatroomException(String msg){
		super(msg);
	}

	public ChatroomException(HttpCodeEnum code){
		this(code.value(), code.getReasonPhrase());
	}

	public ChatroomException(int res, String msg){
		super(msg);
		this.res = res;
	}
	
	public int getRes(){
		return res;
	}
}
