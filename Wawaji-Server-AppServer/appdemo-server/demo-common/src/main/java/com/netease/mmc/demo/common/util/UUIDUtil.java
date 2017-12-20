package com.netease.mmc.demo.common.util;

import java.util.UUID;

import org.apache.commons.lang3.ArrayUtils;

public class UUIDUtil {
	private UUIDUtil() {
		throw new UnsupportedOperationException("UUIDUtil.class can not be construct to a instance");
	}

	/**
	 * @return String UUID
	 */
	public static String getUUID() {
		String s = UUID.randomUUID().toString();
		return s.substring(0, 8) + s.substring(9, 13) + s.substring(14, 18) + s.substring(19, 23) + s.substring(24);
	}

	/**
	 * @param number The number of UUID required
	 * @return String[] UUID
	 */
	public static String[] getUUID(int number) {
        if (number < 1) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }
		String[] ss = new String[number];
		for (int i = 0; i < number; i++) {
			ss[i] = getUUID();
		}
		return ss;
	}
}
