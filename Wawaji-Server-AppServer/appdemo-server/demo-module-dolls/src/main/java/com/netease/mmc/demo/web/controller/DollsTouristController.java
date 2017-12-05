package com.netease.mmc.demo.web.controller;

import javax.annotation.Resource;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.netease.mmc.demo.common.context.WebContextHolder;
import com.netease.mmc.demo.common.enums.HttpCodeEnum;
import com.netease.mmc.demo.common.util.DataPack;
import com.netease.mmc.demo.service.TouristService;
import com.netease.mmc.demo.service.model.TouristModel;
import com.netease.mmc.demo.web.util.VOUtil;

/**
 * 游客账号Controller.
 *
 * @author hzwanglin1
 * @date 2017/11/20
 * @since 1.0
 */
@Controller
@RequestMapping("dollsCatcher/tourist")
public class DollsTouristController {

    @Resource
    private TouristService touristService;

    /**
     * 游客登陆.
     *
     * @param accid 当前使用的游客账号
     * @return
     */
    @RequestMapping(value = "", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ModelMap get(@RequestParam(value = "sid", required = false) String accid) {
        TouristModel touristModel = touristService.validateAndRefreshUser(accid);
        // 继续使用当前账号并重置账号失效时间
        if (touristModel != null) {
            return DataPack.packOk(VOUtil.INSTANCE.touristModel2VO(touristModel));
        }

        String ip = WebContextHolder.getIp();
        // 针对ip进行频控
        if (touristService.isIpLimited(ip)) {
            return DataPack.packFailure(HttpCodeEnum.TOURIST_GET_LIMIT);
        }
        // 从当前账号池获取账号
        touristModel = touristService.getFromTouristPool();
        if (touristModel == null) {
            // 如果账号池中没有账号，同步创建新的游客账号
            touristModel = touristService.createNewTourist();
        }

        if (touristModel == null) {
            return DataPack.packFailure(HttpCodeEnum.TOURIST_GET_ERROR);
        } else {
            // 成功获取到账号，更新ip频控计数
            touristService.incrTouristGetCount(ip);
            return DataPack.packOk(VOUtil.INSTANCE.touristModel2VO(touristModel));
        }
    }

}