//
//  NTESControlService.m
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESControlService.h"
#import "NSDictionary+NTESJson.h"
#import "NTESInfoManager.h"
#import "NTESUser.h"

@interface NTESControlService()<NIMSystemNotificationManagerDelegate>

@property (nonatomic,assign) NSUInteger serial;

@end

@implementation NTESControlService

- (instancetype)init
{
    self = [super init];
    if (self)
    {
        [[NIMSDK sharedSDK].systemNotificationManager addDelegate:self];
        _serial = 0;
    }
    return self;
}

- (void)dealloc
{
    [[NIMSDK sharedSDK].systemNotificationManager removeDelegate:self];
}

//改变机爪方向
- (void)clawDirection:(NTESControlDirection)direction
               clawId:(NSString *)clawId
{
    static NSDictionary *directions;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        directions = @{
                          @(NTESControlDirectionUp)    : @"up",
                          @(NTESControlDirectionDown)  : @"down",
                          @(NTESControlDirectionLeft)  : @"left",
                          @(NTESControlDirectionRight) : @"right",
                      };
    });
    NSString *data = [directions objectForKey:@(direction)];
    [self sendCommand:NTESControlCommandClaw data:data clawId:clawId];
}

//抓取
- (void)tryLuck:(NSString *)clawId;
{
    [self sendCommand:NTESControlCommandTryLuck data:nil clawId:clawId];
}

//切换摄像头
- (void)changeCamera:(NTESCameraNumber)cameraNumber
              clawId:(NSString *)clawId
{
    [self sendCommand:NTESControlCommandCamera data:@(cameraNumber).stringValue clawId:clawId];
}


//加入等待队列
- (void)joinPendingQueue:(NSString *)roomId completion:(void(^)(NSError *))completion
{
    NTESUser *user = [[NTESInfoManager sharedManager] userById:[NIMSDK sharedSDK].loginManager.currentAccount];
    NIMChatroomQueueUpdateRequest *request = [[NIMChatroomQueueUpdateRequest alloc] init];
    request.roomId = roomId;
    request.key = user.userId;
    request.value = [@{@"nick":user.nick?:@""} toJson];
    request.transient = YES;
    
    [[NIMSDK sharedSDK].chatroomManager updateChatroomQueueObject:request completion:completion];
}

//离开等待队列
- (void)leavePendingQueue:(NSString *)roomId completion:(void(^)(NSError *))completion;
{
    NIMChatroomQueueRemoveRequest *request = [[NIMChatroomQueueRemoveRequest alloc] init];
    request.roomId = roomId;
    request.key = [NIMSDK sharedSDK].loginManager.currentAccount;
    
    [[NIMSDK sharedSDK].chatroomManager removeChatroomQueueObject:request completion:^(NSError * _Nullable error, NSDictionary<NSString *,NSString *> * _Nullable element) {
        if (completion)
        {
            completion(error);
        }
    }];
}


- (void)sendCommand:(NTESControlCommand)command
               data:(NSString *)data
             clawId:(NSString *)clawId
{
    DDLogInfo(@"send command %zd \n data %@ \n claw id %@\n serial id %zd \n",command,data,clawId,self.serial);
    data = data?:@"";
    NSDictionary *dict = @{@"command":@(command),@"data":data,@"serial":@(self.serial)};
    self.serial++;
    
    NSString *content  = [dict toJson];
    
    NIMCustomSystemNotification *notifcation = [[NIMCustomSystemNotification alloc] initWithContent:content];
    //clawId 为娃娃机的 id
    NIMSession *session = [NIMSession session:clawId type:NIMSessionTypeP2P];
    [[NIMSDK sharedSDK].systemNotificationManager sendCustomNotification:notifcation toSession:session completion:nil];
}

- (void)onReceiveCustomSystemNotification:(NIMCustomSystemNotification *)notification
{
    DDLogInfo(@"on receive claw : %@  , info : %@", notification.sender, notification.content);
}


@end
