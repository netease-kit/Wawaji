package com.netease.mmc.demo.httpdao;

import javax.annotation.CheckForNull;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.annotation.Resource;

import org.apache.http.protocol.HTTP;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSONObject;
import com.netease.mmc.demo.common.constant.CommonConst;
import com.netease.mmc.demo.common.util.CheckSumBuilder;
import com.netease.mmc.demo.common.util.MDCUtil;
import com.netease.mmc.demo.common.util.UUIDUtil;

/**
 * AbstractApiHttpDao
 *
 * @author hzwanglin1
 * @date 2017/6/24
 * @since 1.0
 */
public abstract class AbstractApiHttpDao {

    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractApiHttpDao.class);

    private static final String BEFORE_REQUEST_LOG_TEMPLATE = "Req: [Url]{} [Headers]{} [Params]{}";

    private static final String AFTER_REQUEST_LOG_TEMPLATE = "Rep: [Url]{} [Res]{}";

    @Value("${appkey}")
    protected String appKey;

    @Value("${appsecret}")
    protected String appSecret;

    @Resource
    private RestTemplate restTemplate;

    /**
     * 以Form表单的形式提交Post请求
     *
     * @param path
     * @param params
     * @return 如果有异常则返回null
     */
    @CheckForNull
    @Nullable
    protected String postFormData(@Nonnull String path, @Nonnull final MultiValueMap params) {
        return postFormData(path, params, appKey, appSecret);
    }

    /**
     * 以Form表单的形式提交Post请求
     *
     * @param path
     * @param params
     * @param appKey
     * @param appSecret
     * @return 如果有异常则返回null
     */
    @CheckForNull
    @Nullable
    protected String postFormData(@Nonnull String path, @Nonnull final MultiValueMap params, @Nonnull String appKey, @Nonnull String appSecret) {
        // set headers
        HttpHeaders headers = new HttpHeaders();
        setAuthenticationHeaders(headers, appKey, appSecret);
        headers.set(HTTP.CONTENT_TYPE, CommonConst.APPLICATION_FORM_URLENCODED_UTF8_VALUE);
        // set req_id
        MDCUtil.fillRequestIdHeader(headers);

        // set parameters
        HttpEntity<MultiValueMap> requestEntity = new HttpEntity<>(params, headers);

        // get request url
        String targetUrl = createUrl(path);

        LOGGER.info(BEFORE_REQUEST_LOG_TEMPLATE, targetUrl, headers, params);
        String response = restTemplate.postForObject(targetUrl, requestEntity, String.class);
        LOGGER.info(AFTER_REQUEST_LOG_TEMPLATE, targetUrl, response);
        return response;
    }

    /**
     * 以json格式提交Post请求
     *
     * @param path
     * @param params
     * @return 如果有异常则返回null
     */
    @CheckForNull
    @Nullable
    protected String postJsonData(@Nonnull String path, @Nonnull Object params) {
        return postJsonData(path, params, appKey, appSecret);
    }

    /**
     * 以json格式提交Post请求
     *
     * @param path
     * @param params
     * @param appKey
     * @param appSecret
     * @return 如果有异常则返回null
     */
    @CheckForNull
    @Nullable
    protected String postJsonData(@Nonnull String path, @Nonnull Object params, @Nonnull String appKey, @Nonnull String appSecret) {
        // set headers
        HttpHeaders headers = new HttpHeaders();
        setAuthenticationHeaders(headers, appKey, appSecret);
        headers.set(HTTP.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        // set req_id
        MDCUtil.fillRequestIdHeader(headers);

        // set parameters
        HttpEntity<String> requestEntity = new HttpEntity<>(JSONObject.toJSONString(params), headers);

        // get request url
        String targetUrl = createUrl(path);

        LOGGER.info(BEFORE_REQUEST_LOG_TEMPLATE, targetUrl, headers, params);
        String response = restTemplate.postForObject(targetUrl, requestEntity, String.class);
        LOGGER.info(AFTER_REQUEST_LOG_TEMPLATE, targetUrl, response);
        return response;
    }

    /**
     * 根据path拼接成目标url
     *
     * @param path
     * @return
     */
    @Nonnull
    protected abstract String createUrl(@Nonnull String path);

    /**
     * 设置接口鉴权校验请求头.
     *
     * @param headers
     * @param appKey
     * @param appSecret
     */
    private void setAuthenticationHeaders(@Nonnull HttpHeaders headers, String appKey, String appSecret) {
        headers.set("AppKey", appKey);
        String nonce = UUIDUtil.getUUID();
        headers.set("Nonce", nonce);
        String curTime = String.valueOf(System.currentTimeMillis() / 1000);
        headers.set("CurTime", curTime);
        String checksum = CheckSumBuilder.getCheckSum(appSecret, nonce, curTime);
        headers.set("CheckSum", checksum);
    }

}
