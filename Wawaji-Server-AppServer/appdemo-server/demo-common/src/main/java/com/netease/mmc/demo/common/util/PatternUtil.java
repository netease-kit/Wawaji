package com.netease.mmc.demo.common.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.apache.commons.collections4.CollectionUtils;

/**
 * PatternUtil
 *
 * @author hzzhanghan
 * @date  2016/10/19
 * @since 1.0
 */
public class PatternUtil {

    private static Map<String, Pattern> patternCacheMap = new HashMap<>();

    private PatternUtil() {
        throw new UnsupportedOperationException("PatternUtil.class can not be construct to a instance");
    }

    /**
     * 以非获取匹配的方式拼接正则set
     * 
     * @param regexSet
     * @return
     */
    public static String combineNonFetchedMatchRegex(Set<String> regexSet) {
        if (CollectionUtils.isEmpty(regexSet)) {
            throw new IllegalArgumentException("regex set must not empty");
        }
        StringBuilder regexCombineBuilder = new StringBuilder();
        int appendTime = 0;
        for (String regex : regexSet) {
            if (appendTime > 0) {
                regexCombineBuilder.append("|");
            }
            regexCombineBuilder.append("(?:");
            regexCombineBuilder.append(regex);
            regexCombineBuilder.append(")");
            appendTime++;
        }
        return regexCombineBuilder.toString();
    }

    /**
     * 匹配并将Pattern对象缓存以便下次重复利用
     * 
     * @param regex
     * @param value
     * @return
     */
    public static boolean matchesWithCache(String regex, CharSequence value) {
        Pattern pattern = patternCacheMap.get(regex);
        if (pattern == null) {
            pattern = Pattern.compile(regex);
            patternCacheMap.put(regex, pattern);
        }
        return pattern.matcher(value).matches();
    }

    /**
     * 普通匹配
     * 
     * @param regex
     * @param value
     * @return
     */
    public static boolean matches(String regex, CharSequence value) {
        return Pattern.matches(regex, value);
    }

    public static boolean find(String regex, CharSequence value) {
        return Pattern.compile(regex).matcher(value).find();
    }

    public static boolean findWithCache(String regex, CharSequence value) {
        Pattern pattern = patternCacheMap.get(regex);
        if (pattern == null) {
            pattern = Pattern.compile(regex);
            patternCacheMap.put(regex, pattern);
        }
        return pattern.matcher(value).find();
    }
}
