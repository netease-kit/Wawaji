package com.netease.mmc.demo.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 健康检查Controller.
 *
 * @author hzwanglin1
 * @date 17-5-7
 * @since 1.0
 */
@Controller
public class HealthCheckController {
    @RequestMapping(value = "healthCheck")
    @ResponseBody
    public String healthCheck(){
        return "OK";
    }
}
