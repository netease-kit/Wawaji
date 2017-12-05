package com.netease.mmc.demo.web.exception;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.TypeMismatchException;
import org.springframework.expression.AccessException;
import org.springframework.http.MediaType;
import org.springframework.ui.ModelMap;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.netease.mmc.demo.common.constant.CommonConst;
import com.netease.mmc.demo.common.enums.HttpCodeEnum;
import com.netease.mmc.demo.common.exception.AbstractCustomException;
import com.netease.mmc.demo.common.util.DataPack;
import com.netease.mmc.demo.common.util.HttpUtil;

/**
 * 全局异常处理.
 *
 * @author hzwanglin1
 * @date 2017/6/21
 * @since 1.0
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static final String ERROR_LOG_TEMPLATE = "request url error {}";

    @ExceptionHandler(TypeMismatchException.class)
    public ModelAndView handleTypeMismatchException(TypeMismatchException ex, HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        logger.error(ERROR_LOG_TEMPLATE, request.getRequestURI(), ex);
        ModelMap modelMap = DataPack.packBadRequest("illegal request param");
        return boxingReturnModelMap(modelMap, request, response);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ModelAndView handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException ex,
            HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.error(ERROR_LOG_TEMPLATE, request.getRequestURI(), ex);
        ModelMap modelMap = DataPack.packBadRequest("http media type not support");
        return boxingReturnModelMap(modelMap, request, response);
    }

    @ExceptionHandler(ServletRequestBindingException.class)
    public ModelAndView handleServletRequestBindingException(ServletRequestBindingException ex,
            HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.error(ERROR_LOG_TEMPLATE, request.getRequestURI(), ex);
        ModelMap modelMap = DataPack.packFailure(HttpCodeEnum.BAD_REQUEST);
        return boxingReturnModelMap(modelMap, request, response);
    }

    @ExceptionHandler(ServletException.class)
    public ModelAndView handleServletException(ServletException ex, HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        logger.error(ERROR_LOG_TEMPLATE, request.getRequestURI(), ex);
        ModelMap modelMap = DataPack.packBadRequest(ex.getMessage());
        return boxingReturnModelMap(modelMap, request, response);
    }

    @ExceptionHandler(AbstractCustomException.class)
    public ModelAndView handleCustomException(AbstractCustomException ex, HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        logger.error(ERROR_LOG_TEMPLATE, request.getRequestURI(), ex);
        ModelMap modelMap = DataPack.packFailure(ex.getRes(), ex.getMessage());
        return boxingReturnModelMap(modelMap, request, response);
    }

    @ExceptionHandler(AccessException.class)
    public ModelAndView handleAccessException(AccessException ex, HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        logger.error(ERROR_LOG_TEMPLATE, request.getRequestURI(), ex);
        ModelMap modelMap = DataPack.packFailure(HttpCodeEnum.FORBIDDEN);
        return boxingReturnModelMap(modelMap, request, response);
    }

    @ExceptionHandler(Exception.class)
    public ModelAndView handleException(Exception ex, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        logger.error(ERROR_LOG_TEMPLATE, request.getRequestURI(), ex);
        ModelMap modelMap = DataPack.packFailure(HttpCodeEnum.INTERNAL_SERVER_ERROR);
        return boxingReturnModelMap(modelMap, request, response);
    }

    private ModelAndView boxingReturnModelMap(ModelMap modelMap, HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        response.setCharacterEncoding(CommonConst.CHARSET_NAME_UTF_8);
        if (HttpUtil.isAjaxRequest(request) || HttpUtil.isAcceptJsonResponse(request)) {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(JSON.toJSONString(modelMap));
            logger.debug("boxing request {} to application/json", request.getRequestURI());
            return new ModelAndView();
        } else {
            response.setContentType(MediaType.APPLICATION_XHTML_XML_VALUE);
            // TODO: 2017/6/21 add view resolver
            logger.debug("boxing request {} to application/xhtml with view name {}", request.getRequestURI(), "");
        }
        return new ModelAndView("", modelMap);
    }
}
