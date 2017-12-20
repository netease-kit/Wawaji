package com.netease.mmc.demo.common.exception;

import com.netease.mmc.demo.common.enums.HttpCodeEnum;

/**
 * 游客账号相关异常
 *
 * @author hzwanglin1
 * @date 2017/6/5
 * @since 1.0
 */
public class TouristException extends AbstractCustomException{

	private static final long serialVersionUID = -8494642490434315309L;

	private int res = HttpCodeEnum.TOURIST_ERROR.value();

    public TouristException() {
    	super(HttpCodeEnum.TOURIST_ERROR.getReasonPhrase());
	}

	public TouristException(String msg){
		super(msg);
	}

	public TouristException(HttpCodeEnum code) {
		this(code.value(), code.getReasonPhrase());
	}

	public TouristException(int res, String msg){
		super(msg);
		this.res = res;
	}

	public int getRes(){
		return res;
	}
}
