//
//  NTESControlService.h
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NTESControlCommandDefine.h"

@interface NTESControlService : NSObject

//改变机爪方向
- (void)clawDirection:(NTESControlDirection)direction
               clawId:(NSString *)clawId;

//抓取
- (void)tryLuck:(NSString *)clawId;

//切换摄像头
- (void)changeCamera:(NTESCameraNumber)cameraNumber
              clawId:(NSString *)clawId;

//加入等待队列
- (void)joinPendingQueue:(NSString *)roomId completion:(void(^)(NSError *))completion;

//离开等待队列
- (void)leavePendingQueue:(NSString *)roomId completion:(void(^)(NSError *))completion;;

@end
