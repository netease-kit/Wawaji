package com.netease.nim.ufocatcher.demo.common.net;

public interface NetworkEnums {
	public enum Event {
		/** 
		 * connection established
		 * 
		 * connected to server and initialized
		 */
		CONN_ESTABLISHED,

		/** 
		 * connection broken
		 * 
		 * any reason cause connection lost
		 */		
		CONN_BROKEN,
		
		/** 
		 * keep alive timeout
		 * 
		 * 
		 */				
		KEEP_ALIVE_TIMEOUT,
		
		/** network unavailable */
		NETWORK_UNAVAILABLE,
		
		/** network available */		
		NETWORK_AVAILABLE,
		
		/** network change */
		NETWORK_CHANGE,
		
		/** background data off */
		BACKGROUND_DATA_OFF,

		/** background data on */
		BACKGROUND_DATA_ON,
	};
}
