package com.netease.mmc.demo.httpdao.vcloud;

import javax.annotation.Nonnull;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.netease.mmc.demo.common.exception.LiveException;
import com.netease.mmc.demo.httpdao.AbstractApiHttpDao;
import com.netease.mmc.demo.httpdao.vcloud.dto.ChannelInfoDTO;
import com.netease.mmc.demo.httpdao.vcloud.dto.ChannelStatusDTO;
import com.netease.mmc.demo.httpdao.vcloud.dto.VCloudResponseDTO;

/**
 * 视频云服务端api接口调用类.
 *
 * @author hzwanglin1
 * @date 2017/6/24
 * @since 1.0
 */
@Component
public class VcloudServerApiHttpDao extends AbstractApiHttpDao {

    @Value("${vcloud.server.api.url}")
    private String vcloudServerUrl;

    /**
     * 创建直播频道.
     *
     * @param channelName 频道名称（最大长度64个字符，只支持中文、字母、数字和下划线）
     * @return
     */
    public VCloudResponseDTO<ChannelInfoDTO> createChannel(String channelName) {
        JSONObject param = new JSONObject();
        param.put("name", channelName);
        // api接口只支持创建rtmp频道（type=0）
        param.put("type", "0");

        String res = postJsonData("app/channel/create", param);
        if (StringUtils.isBlank(res)) {
            throw new LiveException();
        }

        return JSONObject.parseObject(res, new TypeReference<VCloudResponseDTO<ChannelInfoDTO>>() {
        });
    }

    /**
     * 查询直播频道状态.
     *
     * @param cid 直播频道id
     * @return
     */
    public VCloudResponseDTO<ChannelStatusDTO> channelStats(String cid) {
        JSONObject param = new JSONObject();
        param.put("cid", cid);

        String res = postJsonData("app/channelstats", param);
        if (StringUtils.isBlank(res)) {
            throw new LiveException();
        }

        return JSONObject.parseObject(res, new TypeReference<VCloudResponseDTO<ChannelStatusDTO>>() {
        });
    }

    @Nonnull
    @Override
    protected String createUrl(@Nonnull String path) {
        return vcloudServerUrl + path;
    }

}
