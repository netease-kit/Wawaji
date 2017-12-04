//
//  NTESControlCommandDefine.h
//  NIMDragonClaw
//
//  Created by chris on 2017/11/24.
//  Copyright © 2017年 Netease. All rights reserved.
//

#ifndef NTESControlCommandDefine_h
#define NTESControlCommandDefine_h

//娃娃机爪方向控制
typedef NS_ENUM(NSInteger, NTESControlDirection) {
    //娃娃机爪方向向上
    NTESControlDirectionUp,
    //娃娃机爪方向向下
    NTESControlDirectionDown,
    //娃娃机爪方向向左
    NTESControlDirectionLeft,
    //娃娃机爪方向向右
    NTESControlDirectionRight,
};

//娃娃机摄像机编号
typedef NS_ENUM(NSInteger, NTESCameraNumber) {
    //娃娃机摄像机编号1
    NTESCameraNumber1 = 1,
    //娃娃机摄像机编号2
    NTESCameraNumber2 = 2,
};

//娃娃机控制指令
typedef NS_ENUM(NSInteger, NTESControlCommand) {
    //娃娃机爪控制 {"command":1, "data":"left"}   data 可为 上下左右，  up down left right
    NTESControlCommandClaw   = 1,
    //娃娃机下爪  {"command":2}
    NTESControlCommandTryLuck  = 2,
    //娃娃机摄像头切换 {"command":3,"data":"1"}   data为摄像机编号，目前只有1，2号摄像机
    NTESControlCommandCamera = 3,
    //PC 结果通知 {"command":4,"data":"true"}      data 为 true false
    NTESControlCommandResult = 4,
};


#endif /* NTESControlCommandDefine_h */
