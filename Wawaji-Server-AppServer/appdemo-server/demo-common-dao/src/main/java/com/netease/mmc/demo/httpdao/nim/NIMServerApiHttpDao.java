package com.netease.mmc.demo.httpdao.nim;

import java.util.Objects;

import javax.annotation.Nonnull;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.alibaba.fastjson.JSONObject;
import com.netease.mmc.demo.common.enums.HttpCodeEnum;
import com.netease.mmc.demo.common.enums.RoomAddressTypeEnum;
import com.netease.mmc.demo.common.exception.ChatroomException;
import com.netease.mmc.demo.common.exception.UserException;
import com.netease.mmc.demo.httpdao.AbstractApiHttpDao;
import com.netease.mmc.demo.httpdao.nim.dto.AddrResponseDTO;
import com.netease.mmc.demo.httpdao.nim.dto.ChatroomQueueResponseDTO;
import com.netease.mmc.demo.httpdao.nim.dto.ChatroomResponseDTO;
import com.netease.mmc.demo.httpdao.nim.dto.NIMUserResponseDTO;
import com.netease.mmc.demo.httpdao.nim.util.NIMErrorCode;

/**
 * 云信服务端api接口调用类.
 *
 * @author hzwanglin1
 * @date 17-6-24
 * @since 1.0
 */
@Component
public class NIMServerApiHttpDao extends AbstractApiHttpDao {
    private static final Logger LOGGER = LoggerFactory.getLogger(NIMServerApiHttpDao.class);

    @Value("${nim.server.api.url}")
    private String nimServerUrl;

    /**
     * 创建IM用户账号.
     *
     * @param accid 用户名，最大长度32字符
     * @param name  用户昵称，最大长度64字符
     * @param token 云信token，最大长度128字符，如果未指定，会自动生成token，并在创建成功后返回
     * @return
     */
    public NIMUserResponseDTO createUser(String accid, String name, String token) {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>(3);
        param.set("accid", accid);
        param.set("name", name);
        if (token != null) {
            param.set("token", token);
        }

        String res = postFormData("user/create.action", param);
        if (StringUtils.isBlank(res)) {
            throw new UserException();
        }

        return JSONObject.parseObject(res, NIMUserResponseDTO.class);
    }

    /**
     * 更新用户账号token.
     *
     * @param accid 用户账号
     * @param token 需要更新的token
     * @return
     */
    public boolean updateUserToken(String accid, String token) {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>(2);
        param.set("accid", accid);
        param.set("token", token);

        String res = postFormData("user/update.action", param);
        if (StringUtils.isBlank(res)) {
            throw new UserException();
        }

        NIMUserResponseDTO responseDTO = JSONObject.parseObject(res, NIMUserResponseDTO.class);
        // 账号不存在
        if (Objects.equals(responseDTO.getCode(), NIMErrorCode.ILLEGAL_PARAM.value())) {
            throw new UserException(HttpCodeEnum.USER_NOT_FOUND_ON_SERVER);
        } else if (!Objects.equals(responseDTO.getCode(), HttpCodeEnum.OK.value())) {
            LOGGER.error("updateUserIMToken failed accid[{}] for reason[{}]", accid, responseDTO);
            throw new UserException(responseDTO.getDesc());
        }
        return true;
    }

    /**
     * 创建聊天室
     *
     * @param creator      房主账号
     * @param roomName     聊天室房间名称
     * @param announcement 聊天室公告
     * @param broadcastUrl 广播地址
     * @param ext          聊天室扩展字段（约定为json格式）
     * @return
     */
    public ChatroomResponseDTO createRoom(String creator, String roomName, String announcement, String broadcastUrl,
            String ext) {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>(5);
        param.set("creator", creator);
        param.set("name", roomName);
        if (announcement != null) {
            param.set("announcement", announcement);
        }
        if (broadcastUrl != null) {
            param.set("broadcasturl", broadcastUrl);
        }
        if (ext != null) {
            param.set("ext", ext);
        }

        String res = postFormData("chatroom/create.action", param);
        if (StringUtils.isBlank(res)) {
            throw new ChatroomException();
        }

        return JSONObject.parseObject(res, ChatroomResponseDTO.class);
    }

    /**
     * 更新聊天室信息
     *
     * @param roomId 聊天室id
     * @param roomName 聊天室房间名称
     * @param announcement 聊天室公告
     * @param broadcastUrl 广播地址
     * @param ext 聊天室扩展字段（约定为json格式）
     * @return
     */
    public ChatroomResponseDTO updateRoom(long roomId, String roomName, String announcement, String broadcastUrl,
            String ext) {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>(5);
        param.set("roomid", String.valueOf(roomId));
        if (roomName != null) {
            param.set("name", roomName);
        }
        if (announcement != null) {
            param.set("announcement", announcement);
        }
        if (broadcastUrl != null) {
            param.set("broadcasturl", broadcastUrl);
        }
        if (ext != null) {
            param.set("ext", ext);
        }

        String res = postFormData("chatroom/update.action", param);
        if (StringUtils.isBlank(res)) {
            throw new ChatroomException();
        }

        return JSONObject.parseObject(res, ChatroomResponseDTO.class);
    }

    /**
     * 修改聊天室开启/关闭状态
     *
     * @param roomId   聊天室房间名称
     * @param operator 操作者账号，必须是创建者才可以操作
     * @param valid    true或false，false:关闭聊天室；true:打开聊天室
     * @return
     */
    public ChatroomResponseDTO changeRoomStatus(long roomId, String operator, boolean valid) {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>(3);
        param.set("roomid", String.valueOf(roomId));
        param.set("operator", operator);
        param.set("valid", String.valueOf(valid));

        String res = postFormData("chatroom/toggleCloseStat.action", param);
        if (StringUtils.isBlank(res)) {
            throw new ChatroomException();
        }

        return JSONObject.parseObject(res, ChatroomResponseDTO.class);
    }

    /**
     * 请求聊天室地址.
     *
     * @param roomId      聊天室房间id
     * @param accid       请求进入聊天室的账号
     * @param addressType 客户端类型 {@link RoomAddressTypeEnum}
     * @return
     */
    public AddrResponseDTO requestRoomAddress(long roomId, String accid, RoomAddressTypeEnum addressType) {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>(3);
        param.set("roomid", String.valueOf(roomId));
        param.set("accid", accid);
        if (addressType != null) {
            param.set("clienttype", String.valueOf(addressType.getValue()));
        }

        String res = postFormData("chatroom/requestAddr.action", param);
        if (StringUtils.isBlank(res)) {
            throw new ChatroomException();
        }

        return JSONObject.parseObject(res, AddrResponseDTO.class);
    }

    /**
     * 查询聊天室信息.
     *
     * @param roomId 聊天室房间id
     * @param needOnlineUserCount 是否需要返回在线人数
     * @return
     */
    public ChatroomResponseDTO queryRoomInfo(long roomId, Boolean needOnlineUserCount) {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>(2);
        param.set("roomid", String.valueOf(roomId));
        if (needOnlineUserCount != null) {
            param.set("needOnlineUserCount", String.valueOf(needOnlineUserCount));
        }

        String res = postFormData("chatroom/get.action", param);
        if (StringUtils.isBlank(res)) {
            throw new ChatroomException();
        }

        return JSONObject.parseObject(res, ChatroomResponseDTO.class);
    }

    /**
     * 往聊天室有序队列中新加或更新元素
     *
     * @param roomId
     * @param key  连麦请求者
     * @param value 连麦请求ext
     * @return
     */
    public ChatroomQueueResponseDTO pushQueue(long roomId, String key, String value) {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>(3);
        param.set("roomid", String.valueOf(roomId));
        param.set("key", key);
        param.set("value", value);
        String res = postFormData("chatroom/queueOffer.action", param);
        if (StringUtils.isBlank(res)) {
            throw new ChatroomException();
        }
        return JSONObject.parseObject(res, ChatroomQueueResponseDTO.class);
    }

    /**
     * 从队列中取出元素
     *
     * @param roomId 
     * @param key 指定取连麦请求者(可选)
     * @return
     */
    public ChatroomQueueResponseDTO popQueue(long roomId, String key) {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>(2);
        param.set("roomid", String.valueOf(roomId));
        if (StringUtils.isNotBlank(key)) {
            param.set("key", key);
        }
        String res = postFormData("chatroom/queuePoll.action", param);
        if (StringUtils.isBlank(res)) {
            throw new ChatroomException();
        }
        return JSONObject.parseObject(res, ChatroomQueueResponseDTO.class);
    }

    /**
     * 排序列出队列中所有元素
     *
     * @param roomId
     * @return
     */
    public ChatroomQueueResponseDTO listQueue(long roomId) {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>(1);
        param.set("roomid", String.valueOf(roomId));

        String res = postFormData("chatroom/queueList.action", param);
        if (StringUtils.isBlank(res)) {
            throw new ChatroomException();
        }
        return JSONObject.parseObject(res, ChatroomQueueResponseDTO.class);
    }
    
    @Nonnull
    @Override
    protected String createUrl(@Nonnull String path) {
        return nimServerUrl + path;
    }
}
