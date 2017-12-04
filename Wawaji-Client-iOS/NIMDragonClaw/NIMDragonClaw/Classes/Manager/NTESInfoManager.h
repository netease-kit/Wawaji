//
//  NTESInfoManager.h
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESUser.h"

@protocol NTESInfoManagerDelegate<NSObject>

@optional

/*等待用户队列变动通知*/
- (void)onPendingUsersChanged:(NSArray *)pendingUsers roomId:(NSString *)roomId;

/*抓取结果通知*/
- (void)onReceiveTryLuckResult:(BOOL)success creatorId:(NSString *)creatorId;

@end

@interface NTESInfoManager : NSObject

+ (instancetype)sharedManager;

- (void)fetchPendingUsers:(NSString *)roomId
               completion:(void(^)(NSArray<NTESUser *> *))completion;

@property (nonatomic,weak) id<NTESInfoManagerDelegate> delegate;

/*根据 Accid 去取用户信息*/
- (NTESUser *)userById:(NSString *)userId;

@end
