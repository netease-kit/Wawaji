package com.netease.mmc.demo.web.interceptor;

import javax.annotation.Nonnull;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.netease.mmc.demo.common.context.WebContextHolder;
import com.netease.mmc.demo.common.enums.HttpCodeEnum;
import com.netease.mmc.demo.common.session.SessionUserModel;
import com.netease.mmc.demo.common.util.DataPack;
import com.netease.mmc.demo.service.TouristService;
import com.netease.mmc.demo.service.UserService;
import com.netease.mmc.demo.service.model.TouristModel;
import com.netease.mmc.demo.service.model.UserModel;

/**
 * 用户验证拦截器.
 *
 * @author huzhengguang
 * @date 17-7-10
 * @since 1.0
 */
public class ValidateUserInterceptor extends HandlerInterceptorAdapter {

    @Resource
    private TouristService touristService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String sid = request.getParameter("sid");
        if (StringUtils.isBlank(sid)) {
            response.setContentType(MediaType.APPLICATION_JSON.toString());
            response.getWriter().print(DataPack
                    .failResponseByJson(HttpCodeEnum.BAD_REQUEST.value(), HttpCodeEnum.BAD_REQUEST.getReasonPhrase()));
            return false;
        }
        TouristModel touristModel = touristService.queryTourist(sid);
        if (touristModel == null) {
            response.setContentType(MediaType.APPLICATION_JSON.toString());
            response.getWriter().print(DataPack.failResponseByJson(HttpCodeEnum.UNAUTHORIZED.value(),
                    HttpCodeEnum.UNAUTHORIZED.getReasonPhrase()));
            return false;
        } else {
            WebContextHolder.setCurrentUser(convert2SessionUserModel(touristModel));
        }
        return true;
    }

    /**
     * 将游客模型转换为session用户信息模型
     *
     * @param touristModel
     * @return
     */
    private SessionUserModel convert2SessionUserModel(@Nonnull TouristModel touristModel) {
        SessionUserModel sessionUserModel = new SessionUserModel();
        sessionUserModel.setAccid(touristModel.getAccid());
        sessionUserModel.setNickname(touristModel.getNickname());
        sessionUserModel.setImToken(touristModel.getImToken());
        return sessionUserModel;
    }
}
