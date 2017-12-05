package com.netease.mmc.demo.service;

import java.util.List;
import java.util.Objects;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import com.netease.mmc.demo.common.enums.HttpCodeEnum;
import com.netease.mmc.demo.common.enums.LiveStatusEnum;
import com.netease.mmc.demo.common.exception.ChatroomException;
import com.netease.mmc.demo.common.exception.LiveException;
import com.netease.mmc.demo.dao.DollsLiveDao;
import com.netease.mmc.demo.dao.DollsRoomDao;
import com.netease.mmc.demo.dao.domain.DollsLiveConfigDO;
import com.netease.mmc.demo.dao.domain.DollsLiveDO;
import com.netease.mmc.demo.dao.domain.DollsRoomDO;
import com.netease.mmc.demo.httpdao.nim.NIMServerApiHttpDao;
import com.netease.mmc.demo.httpdao.nim.dto.ChatroomDTO;
import com.netease.mmc.demo.httpdao.nim.dto.ChatroomQueueResponseDTO;
import com.netease.mmc.demo.httpdao.nim.dto.ChatroomResponseDTO;
import com.netease.mmc.demo.httpdao.vcloud.VcloudServerApiHttpDao;
import com.netease.mmc.demo.httpdao.vcloud.dto.ChannelInfoDTO;
import com.netease.mmc.demo.httpdao.vcloud.dto.ChannelStatusDTO;
import com.netease.mmc.demo.httpdao.vcloud.dto.VCloudResponseDTO;
import com.netease.mmc.demo.service.model.DollsRoomModel;

/**
 * 聊天室直播房间Service实现类.
 *
 * @author hzwanglin1
 * @date 17-6-25
 * @since 1.0
 */
@Service
public class RoomService {
    private static final Logger logger = LoggerFactory.getLogger(RoomService.class);

    @Resource
    private DollsRoomDao dollsRoomDao;

    @Resource
    private DollsLiveDao dollsLiveDao;

    @Resource
    private NIMServerApiHttpDao nimServerApiHttpDao;

    @Resource
    private VcloudServerApiHttpDao vcloudServerApiHttpDao;

    /**
     *
     * 查询公开房间列表
     *
     * @param limit
     * @param offset
     * @return
     */
    public List<DollsRoomModel> queryPublicRoomList(Integer limit, Integer offset) {
        List<DollsRoomDO> roomDOList = dollsRoomDao.listPublicRoom(limit, offset);
        List<DollsRoomModel> roomModelList = Lists.newArrayList();
        for (DollsRoomDO roomDO : roomDOList) {
            DollsRoomModel roomModel = convert2RoomModel(roomDO);
            if (roomModel != null) {
                // 查询当前在线人数
                ChatroomResponseDTO chatroomResponseDTO = nimServerApiHttpDao.queryRoomInfo(roomDO.getRoomId(), true);
                if (Objects.equals(HttpCodeEnum.OK.value(), chatroomResponseDTO.getCode())) {
                    ChatroomDTO chatroomDTO = chatroomResponseDTO.getChatroom();
                    roomModel.setRoomStatus(chatroomDTO.getValid());
                    roomModel.setOnlineUserCount(chatroomDTO.getOnlineusercount());
                } else {
                    logger.error("query chatroom info failed, res:{}", chatroomResponseDTO);
                    roomModel.setRoomStatus(true);
                    roomModel.setOnlineUserCount(0L);
                }
                // 查询当前排队人数
                ChatroomQueueResponseDTO queueResponseDTO = nimServerApiHttpDao.listQueue(roomDO.getRoomId());
                if (Objects.equals(HttpCodeEnum.OK.value(), queueResponseDTO.getCode())) {
                    JSONObject queue = JSON.parseObject(queueResponseDTO.getDesc());
                    JSONArray queueArray = queue.getJSONArray("list");
                    if (queueArray != null) {
                        roomModel.setQueueCount((long) queueArray.size());
                    } else {
                        roomModel.setQueueCount(0L);
                    }
                } else {
                    logger.error("query chatroom queue list failed, res:{}", queueResponseDTO);
                    roomModel.setQueueCount(0L);
                }
                // 查询直播状态
                LiveStatusEnum cid1Status;
                LiveStatusEnum cid2Status;
                VCloudResponseDTO<ChannelStatusDTO> vcloudResponseDTO1 =
                        vcloudServerApiHttpDao.channelStats(roomModel.getCid1());
                if (Objects.equals(HttpCodeEnum.OK.value(), vcloudResponseDTO1.getCode())) {
                    ChannelStatusDTO statusDTO = vcloudResponseDTO1.getRet();
                    cid1Status = LiveStatusEnum.getEnum(statusDTO.getStatus());
                } else {
                    logger.error("query channel status failed, cid:{} res:{}", roomModel.getCid1(), vcloudResponseDTO1);
                    cid1Status = LiveStatusEnum.IDLE;
                }
                VCloudResponseDTO<ChannelStatusDTO> vcloudResponseDTO2 =
                        vcloudServerApiHttpDao.channelStats(roomModel.getCid2());
                if (Objects.equals(HttpCodeEnum.OK.value(), vcloudResponseDTO2.getCode())) {
                    ChannelStatusDTO statusDTO = vcloudResponseDTO2.getRet();
                    cid2Status = LiveStatusEnum.getEnum(statusDTO.getStatus());
                } else {
                    logger.error("query channel status failed, cid:{} res:{}", roomModel.getCid2(), vcloudResponseDTO2);
                    cid2Status = LiveStatusEnum.IDLE;
                }
                // 两路直播，有一路在直播中，则为直播中
                if (Objects.equals(cid1Status, LiveStatusEnum.LIVE) || Objects
                        .equals(cid2Status, LiveStatusEnum.LIVE)) {
                    roomModel.setLiveStatus(LiveStatusEnum.LIVE.getValue());
                } else {
                    roomModel.setLiveStatus(LiveStatusEnum.IDLE.getValue());
                }
                roomModelList.add(roomModel);
            }
        }
        return roomModelList;
    }

    /**
     *
     * 根据房间号查询娃娃机房间信息
     *
     * @param roomId
     * @return
     */
    public DollsRoomModel queryCatcherRoom(long roomId) {
        DollsRoomDO roomDO = dollsRoomDao.findByRoomId(roomId);
        if (roomDO == null) {
            return null;
        }
        DollsRoomModel roomModel = convert2RoomModel(roomDO);

        ChatroomResponseDTO responseDTO = nimServerApiHttpDao.queryRoomInfo(roomDO.getRoomId(), false);
        if (Objects.equals(HttpCodeEnum.OK.value(), responseDTO.getCode())) {
            ChatroomDTO chatroomDTO = responseDTO.getChatroom();
            roomModel.setRoomStatus(chatroomDTO.getValid());
        } else {
            logger.error("query chatroom info failed, res:{}", responseDTO);
            roomModel.setRoomStatus(true);
        }
        return roomModel;
    }

    /**
     * 创建娃娃机房间
     *
     * @param creator
     * @param token
     * @param name
     * @return
     */
    public DollsRoomDO createRoom(String creator, String token, String name) {
        // 创建聊天室
        ChatroomResponseDTO roomResDTO = nimServerApiHttpDao.createRoom(creator, name, null, null, null);
        if (!Objects.equals(roomResDTO.getCode(), HttpCodeEnum.OK.value())) {
            logger.error("createRoom.createChatroom failed creator[{}] for reason[{}]", creator, roomResDTO);
            throw new ChatroomException(roomResDTO.getDesc());
        }
        ChatroomDTO chatroomDTO = roomResDTO.getChatroom();
        DollsRoomDO roomDO = new DollsRoomDO();
        roomDO.setCreator(chatroomDTO.getCreator());
        roomDO.setCreatorToken(token);
        roomDO.setIsPublic(false);
        roomDO.setName(chatroomDTO.getName());
        roomDO.setRoomId(chatroomDTO.getRoomid());

        // 创建直播频道1
        DollsLiveDO liveDO1 = createLiveChannel(creator + "_1");
        // 创建直播频道2
        DollsLiveDO liveDO2 = createLiveChannel(creator + "_2");
        DollsLiveConfigDO liveConfigDO = new DollsLiveConfigDO();
        liveConfigDO.setCid1(liveDO1.getCid());
        liveConfigDO.setCid2(liveDO2.getCid());
        roomDO.setLiveConfig(liveConfigDO);

        if (dollsRoomDao.insertSelective(roomDO) > 0) {
            return roomDO;
        } else {
            logger.error("db create dolls catcher host failed, {}", roomDO);
            throw new LiveException(HttpCodeEnum.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 变更聊天室状态
     *
     * @param roomId 目标房间号
     * @param operator 操作人accid
     * @param roomStatus 目标状态
     * @return
     */
    public boolean changeRoomStatus(long roomId, String operator, boolean roomStatus) {
        ChatroomResponseDTO responseDTO = nimServerApiHttpDao.changeRoomStatus(roomId, operator, roomStatus);
        if (Objects.equals(responseDTO.getCode(), HttpCodeEnum.OK.value())) {
            return true;
        } else {
            logger.error("changeRoomStatus failed, reason:{}", responseDTO);
            return false;
        }
    }

    /**
     * 设置房间在首页列表是否可见
     *
     * @param roomId 目标房间号
     * @param isPublic 首页列表是否可见
     * @return
     */
    public boolean changeRoomPublic(long roomId, boolean isPublic) {
        return dollsRoomDao.updateIsPublicByRoomId(roomId, isPublic) > 0;
    }

    private DollsRoomModel convert2RoomModel(DollsRoomDO roomDO) {
        if (roomDO == null) {
            return null;
        }
        DollsRoomModel roomModel = new DollsRoomModel();
        roomModel.setRoomId(roomDO.getRoomId());
        roomModel.setCreator(roomDO.getCreator());
        roomModel.setCreatorToken(roomDO.getCreatorToken());
        roomModel.setName(roomDO.getName());
        // 查询直播信息
        String cid1 = roomDO.getLiveConfig().getCid1();
        roomModel.setCid1(cid1);
        String cid2 = roomDO.getLiveConfig().getCid2();
        roomModel.setCid2(cid2);
        List<DollsLiveDO> liveDOList = dollsLiveDao.listByCids(Lists.newArrayList(cid1, cid2));
        for (DollsLiveDO liveDO : liveDOList) {
            if (StringUtils.equals(liveDO.getCid(), cid1)) {
                roomModel.setPushUrl1(liveDO.getPushUrl());
                roomModel.setRtmpPullUrl1(liveDO.getRtmpPullUrl());
                roomModel.setHttpPullUrl1(liveDO.getHttpPullUrl());
                roomModel.setHlsPullUrl1(liveDO.getHlsPullUrl());
            } else if (StringUtils.equals(liveDO.getCid(), cid2)) {
                roomModel.setPushUrl2(liveDO.getPushUrl());
                roomModel.setRtmpPullUrl2(liveDO.getRtmpPullUrl());
                roomModel.setHttpPullUrl2(liveDO.getHttpPullUrl());
                roomModel.setHlsPullUrl2(liveDO.getHlsPullUrl());
            }
        }

        return roomModel;
    }

    /**
     * 创建直播频道
     *
     * @param channelName 频道名称
     * @return
     */
    private DollsLiveDO createLiveChannel(String channelName) {
        VCloudResponseDTO<ChannelInfoDTO> liveResDTO = vcloudServerApiHttpDao.createChannel(channelName);
        if (!Objects.equals(liveResDTO.getCode(), HttpCodeEnum.OK.value())) {
            logger.error("createRoom.createChannel failed channelName[{}] for reason[{}]", channelName, liveResDTO);
            throw new LiveException(liveResDTO.getMsg());
        } else {
            ChannelInfoDTO channelInfoDTO = liveResDTO.getRet();
            DollsLiveDO liveDO = new DollsLiveDO();
            liveDO.setCid(channelInfoDTO.getCid());
            liveDO.setName(channelInfoDTO.getName());
            // 默认rtmp频道
            liveDO.setType(0);
            liveDO.setPushUrl(channelInfoDTO.getPushUrl());
            liveDO.setHttpPullUrl(channelInfoDTO.getHttpPullUrl());
            liveDO.setHlsPullUrl(channelInfoDTO.getHlsPullUrl());
            liveDO.setRtmpPullUrl(channelInfoDTO.getRtmpPullUrl());

            if (dollsLiveDao.insertSelective(liveDO) > 0) {
                return liveDO;
            } else {
                logger.error("db create live channel failed, {}", liveDO);
                throw new LiveException(HttpCodeEnum.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
