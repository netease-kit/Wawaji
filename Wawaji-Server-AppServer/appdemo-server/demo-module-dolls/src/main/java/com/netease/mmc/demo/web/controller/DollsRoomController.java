package com.netease.mmc.demo.web.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.collect.Lists;
import com.netease.mmc.demo.common.util.DataPack;
import com.netease.mmc.demo.service.RoomService;
import com.netease.mmc.demo.service.model.DollsRoomModel;
import com.netease.mmc.demo.web.util.VOUtil;
import com.netease.mmc.demo.web.vo.DollsRoomPlayerVO;

/**
 * 娃娃机房间Controller.
 *
 * @author hzwanglin1
 * @date 17-6-25
 * @since 1.0
 */
@Controller
@RequestMapping("dollsCatcher/room")
public class DollsRoomController {

    @Resource
    private RoomService roomService;

    @RequestMapping(value = "mock", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ModelMap mockMachineList() {
        List<DollsRoomPlayerVO> roomList = Lists.newArrayList();
        DollsRoomPlayerVO roomVO = new DollsRoomPlayerVO();
        roomVO.setCreator("wawaji001");
        roomVO.setName("初代娃娃机");
        roomVO.setRoomId(19141459L);
        roomVO.setLiveStatus(1);
        roomVO.setRoomStatus(true);
        roomVO.setOnlineUserCount(8L);
        roomVO.setQueueCount(6L);
        roomVO.setRtmpPullUrl1("rtmp://vb31114d6.live.126.net/live/da811ef687404d0ebda0ec7622322402");
        roomVO.setRtmpPullUrl2("rtmp://vb31114d6.live.126.net/live/b549c48a9a964746adb6dedef59cd880");
        roomList.add(roomVO);

        return DataPack.packOkList(roomList);
    }

    @RequestMapping(value = "list", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ModelMap machineList(@RequestParam(value = "limit", defaultValue = "10") Integer limit,
            @RequestParam(value = "offset", defaultValue = "0") Integer offset) {
        List<DollsRoomModel> roomModelList = roomService.queryPublicRoomList(limit, offset);
        return DataPack.packOkList(VOUtil.INSTANCE.roomModelList2PlayerVOList(roomModelList));
    }
}
