package com.netease.mmc.demo.web.controller;

import java.util.Objects;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.netease.mmc.demo.common.enums.HttpCodeEnum;
import com.netease.mmc.demo.common.util.DataPack;
import com.netease.mmc.demo.dao.domain.DollsRoomDO;
import com.netease.mmc.demo.service.RoomService;
import com.netease.mmc.demo.service.UserService;
import com.netease.mmc.demo.service.model.DollsRoomModel;
import com.netease.mmc.demo.service.model.UserModel;
import com.netease.mmc.demo.web.util.ParamCheckUtil;
import com.netease.mmc.demo.web.util.VOUtil;

/**
 * 娃娃机主机相关Controller.
 *
 * @author hzwanglin1
 * @date 17-11-22
 * @since 1.0
 */
@Controller
@RequestMapping("dollsCatcher/host")
public class DollsHostController {

    @Resource
    private RoomService roomService;

    @Resource
    private UserService userService;

    /**
     * 娃娃机查询房间信息
     *
     * @param roomId
     * @return
     */
    @RequestMapping(value = "query", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ModelMap queryCatcherInfo(@RequestParam(value = "roomId") Long roomId) {
        DollsRoomModel roomModel = roomService.queryCatcherRoom(roomId);
        if (roomModel == null) {
            return DataPack.packFailure(HttpCodeEnum.CHATROOM_NOT_FOUND);
        }
        return DataPack.packOk(VOUtil.INSTANCE.roomModel2CatcherVO(roomModel));
    }

    /**
     * 初始化娃娃机房间信息
     *
     * @param accid
     * @param nickname
     * @param password
     * @param name
     * @return
     */
    @RequestMapping(value = "create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ModelMap createMachine(@RequestParam("accid") String accid, @RequestParam("nickname") String nickname,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "name") String name) {
        // 注册参数校验
        if (!ParamCheckUtil.validateAccid(accid)) {
            return DataPack.packFailure(HttpCodeEnum.ACCID_INVALID);
        }
        if (!ParamCheckUtil.validateNickname(nickname)) {
            return DataPack.packFailure(HttpCodeEnum.NICKNAME_INVALID);
        }

        // 将accid统一小写处理
        String lowerCaseAccid = StringUtils.lowerCase(accid);

        // 创建娃娃机账号
        UserModel userModel = userService.createUser(lowerCaseAccid, nickname, password);

        // 创建娃娃机房间
        DollsRoomDO dollsRoomDO = roomService.createRoom(userModel.getAccid(), userModel.getImToken(), name);

        return DataPack.packOk(dollsRoomDO.getRoomId());
    }

    /**
     * 管理娃娃机房间
     *
     * @param roomId 房间id
     * @param roomStatus 房间状态
     * @param bePublic 首页列表是否可见
     * @return
     */
    @RequestMapping(value = "manage", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ModelMap changeRoomStatus(@RequestParam long roomId, @RequestParam(required = false) Boolean roomStatus,
            @RequestParam(required = false) Boolean bePublic) {

        if (roomStatus == null && bePublic == null) {
            return DataPack.packFailure(HttpCodeEnum.BAD_REQUEST);
        }
        DollsRoomModel roomModel = roomService.queryCatcherRoom(roomId);
        if (roomModel == null) {
            return DataPack.packFailure(HttpCodeEnum.CHATROOM_NOT_FOUND);
        }

        // 设置房间可见性
        if (bePublic != null && !roomService.changeRoomPublic(roomId, bePublic)) {
            return DataPack.packFailure(HttpCodeEnum.INTERNAL_SERVER_ERROR);
        }

        // 设置房间状态
        if (roomStatus != null) {
            // 当前房间状态已经是目标状态，直接返回成功，否则变更房间状态
            if (Objects.equals(roomModel.getRoomStatus(), roomStatus) || roomService
                    .changeRoomStatus(roomId, roomModel.getCreator(), roomStatus)) {
                return DataPack.packOk();
            } else {
                return DataPack.packFailure(HttpCodeEnum.CHATROOM_CHANGE_STATUS_ERROR);
            }
        }

        return DataPack.packOk();
    }
}
