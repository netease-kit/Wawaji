//
//  NTESInfoManager.m
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESInfoManager.h"
#import "NTESService.h"
#import "NSDictionary+NTESJson.h"
#import "NTESControlCommandDefine.h"

@interface NTESInfoManager()<NIMChatManagerDelegate, NIMSystemNotificationManagerDelegate, NIMChatroomManagerDelegate>

@property (nonatomic, strong) NSMutableDictionary<NSString *, NTESUser *> *userInfo;

@property (nonatomic, strong) NSMutableDictionary<NSString *, NSMutableArray<NTESUser *> *> *pendingInfo;

@end

@implementation NTESInfoManager

+ (instancetype)sharedManager
{
    static NTESInfoManager *instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[NTESInfoManager alloc] init];
    });
    return instance;
}

- (instancetype)init
{
    self = [super init];
    if (self)
    {
        _userInfo    = [[NSMutableDictionary alloc] init];
        _pendingInfo = [[NSMutableDictionary alloc] init];
        [self addListener];
    }
    return self;
}

- (void)dealloc
{
    [self removeListener];
}


- (NTESUser *)userById:(NSString *)userId
{
    return [self.userInfo objectForKey:userId];
}

- (void)addUserInfo:(NTESUser *)user
{
    DDLogInfo(@"add user info  %@",user);
    [self.userInfo setObject:user forKey:user.userId];
}

- (void)fetchPendingUsers:(NSString *)roomId
               completion:(void(^)(NSArray<NTESUser *> *))completion
{
    NSArray<NTESUser *> *pendingUsers = [self.pendingInfo objectForKey:roomId];
    if (!pendingUsers)
    {
        [[NTESService sharedService].infoService fetchWaitQueueFromIM:roomId completion:^(NSError *error, NSArray<NTESUser *> *users) {
            if (!error)
            {
                DDLogInfo(@"fetch penging users complete %@",users);
                [self cleanPendingUsers:roomId];
                [self mergePendingUsers:[users mutableCopy] roomId:roomId];
                if (completion)
                {
                    completion(users);
                }
            }
        }];
    }
    else if(completion)
    {
        DDLogInfo(@"penging user exists ,return %@",pendingUsers);
        completion(pendingUsers);
    }
}


- (void)addListener
{
    [[NIMSDK sharedSDK].chatManager addDelegate:self];
    [[NIMSDK sharedSDK].chatroomManager addDelegate:self];
    [[NIMSDK sharedSDK].systemNotificationManager addDelegate:self];
}

- (void)removeListener
{
    [[NIMSDK sharedSDK].chatManager removeDelegate:self];
    [[NIMSDK sharedSDK].chatroomManager removeDelegate:self];
    [[NIMSDK sharedSDK].systemNotificationManager removeDelegate:self];
}


#pragma mark - NIMChatManagerDelegate

- (void)onRecvMessages:(NSArray<NIMMessage *> *)messages
{
    for (NIMMessage *message in messages)
    {
        if (message.messageType == NIMMessageTypeNotification)
        {
            [self dealWithChatroomNotification:(NIMNotificationObject *)message.messageObject];
        }
    }
}

- (void)dealWithChatroomNotification:(NIMNotificationObject *)object
{
    if (object.notificationType == NIMNotificationTypeChatroom)
    {
        NIMChatroomNotificationContent *content = (NIMChatroomNotificationContent *)object.content;
        NSString *sessionId = object.message.session.sessionId;
        [self checkPendingUsers:sessionId];
        if (content.eventType == NIMChatroomEventTypeQueueChange)
        {
            DDLogInfo(@"on pending users changed, room: %@ info:%@", sessionId, content.ext);
            [self onPendingUsersChanged:sessionId info:content.ext];
            [self callbackPendingUsersChanged:sessionId];
        }
        if (content.eventType == NIMChatroomEventTypeQueueBatchChange)
        {
            DDLogInfo(@"on pending users batch changed, room: %@ info: %@", sessionId, content.ext);
            [self onPendingUsersBatchChanged:sessionId info:content.ext];
            [self callbackPendingUsersChanged:sessionId];
        }
    }
}

- (void)onPendingUsersChanged:(NSString *)roomId
                         info:(NSDictionary *)info
{
    NIMChatroomQueueChangeType changeType = [info jsonInteger:NIMChatroomEventInfoQueueChangeTypeKey];
    NSString *item = [info jsonString:NIMChatroomEventInfoQueueChangeItemKey];
    NSString *value = [info jsonString:NIMChatroomEventInfoQueueChangeItemValueKey];
    
    NSString *userId = item;
    NSDictionary *dict = [NSDictionary dictByJsonString:value];
    NSString *nick = [dict jsonString:@"nick"];
    NTESUser *user = [NTESUser userWithInfo:@{@"userId":userId,@"nick":nick?:@""}];
    
    switch (changeType)
    {
        case NIMChatroomQueueChangeTypeOffer:
            [self mergePendingUsers:[@[user] mutableCopy] roomId:roomId];
            break;
        case NIMChatroomQueueChangeTypePoll:
            [self removePendingUsers:[@[user] mutableCopy] roomId:roomId];
            break;
        case NIMChatroomQueueChangeTypeDrop:
            [self cleanPendingUsers:roomId];
            break;
        default:
            break;
    }
}

- (void)onPendingUsersBatchChanged:(NSString *)roomId
                              info:(NSDictionary *)info
{
    NIMChatroomQueueBatchChangeType changeType = [info jsonInteger:NIMChatroomEventInfoQueueChangeTypeKey];
    NSDictionary *batch = [info jsonDict:NIMChatroomEventInfoQueueChangeItemsKey];
    NSMutableArray *users = [[NSMutableArray alloc] init];
    for (NSString *userId in batch)
    {
        NSDictionary *info = [NSDictionary dictByJsonString:[batch jsonString:userId]];
        NSString *nick = [info jsonString:@"nick"];
        NTESUser *user = [NTESUser userWithInfo:@{@"userId":userId,@"nick":nick?:@""}];
        [users addObject:user];
    }
    switch (changeType)
    {
        case NIMChatroomQueueBatchChangeTypePartClear:
            [self removePendingUsers:users roomId:roomId];
            break;
        default:
            break;
    }
}


- (void)removePendingUsers:(NSMutableArray *)users roomId:(NSString *)roomId
{
    [self checkPendingUsers:roomId];
    NSMutableArray *pendingUsers = [self.pendingInfo objectForKey:roomId];
    for (NTESUser *user in users)
    {
        for (NTESUser *pendingUser in [NSArray arrayWithArray:pendingUsers])
        {
            if ([user.userId isEqualToString:pendingUser.userId])
            {
                [pendingUsers removeObject:pendingUser];
            }
        }
    }
}

- (void)cleanPendingUsers:(NSString *)roomId
{
    [self checkPendingUsers:roomId];
    NSMutableArray *pendingUsers = [self.pendingInfo objectForKey:roomId];
    [pendingUsers removeAllObjects];
}

- (void)mergePendingUsers:(NSMutableArray *)users roomId:(NSString *)roomId
{
    [self checkPendingUsers:roomId];
    NSMutableArray *pendingUsers = [self.pendingInfo objectForKey:roomId];
    
    NSMutableSet *existUsers = [[NSMutableSet alloc] init];
    for (NTESUser *pendingUser in pendingUsers)
    {
        [existUsers addObject:pendingUser.userId];
    }
    
    for (NTESUser *user in [NSArray arrayWithArray:users])
    {
        if ([existUsers containsObject:user.userId])
        {
            [users removeObject:user];
        }
    }
    [pendingUsers addObjectsFromArray:users];    
}

- (void)checkPendingUsers:(NSString *)roomId
{
    NSMutableArray *users = [self.pendingInfo objectForKey:roomId];
    if (!users)
    {
        users = [[NSMutableArray alloc] init];
        [self.pendingInfo setObject:users forKey:roomId];
    }
}

- (void)callbackPendingUsersChanged:(NSString *)roomId
{
    NSArray *users = [self.pendingInfo objectForKey:roomId];
    if ([self.delegate respondsToSelector:@selector(onPendingUsersChanged:roomId:)])
    {
        [self.delegate onPendingUsersChanged:users roomId:roomId];
    }
}


#pragma mark - NIMChatroomManagerDelegate

- (void)chatroom:(NSString *)roomId connectionStateChanged:(NIMChatroomConnectionState)state
{
    DDLogInfo(@"room id %@ connect changed to state %zd ",roomId,state);
    if (state == NIMChatroomConnectionStateEnterOK)
    {
        [[NTESService sharedService].infoService fetchWaitQueueFromIM:roomId completion:^(NSError *error, NSArray<NTESUser *> *users) {
            if (!error)
            {
                NSArray<NTESUser *> *pendingUsers = [self.pendingInfo objectForKey:roomId];
                BOOL changed = (users.count != pendingUsers.count);
                if (!changed)
                {
                    for (NSInteger index = 0; index < users.count; index++)
                    {
                        if (![[pendingUsers objectAtIndex:index].userId isEqualToString:[users objectAtIndex:index].userId])
                        {
                            changed = YES;
                            break;
                        }
                    }
                }
                if (changed)
                {
                    [self cleanPendingUsers:roomId];
                    [self mergePendingUsers:[users mutableCopy] roomId:roomId];
                    [self callbackPendingUsersChanged:roomId];
                }
            }
        }];
    }
}


#pragma mark - NIMSystemNotificationManagerDelegate
- (void)onReceiveCustomSystemNotification:(NIMCustomSystemNotification *)notification
{
    NSString *content = notification.content;
    NSDictionary * info = [NSDictionary dictByJsonString:content];
    if (info)
    {
        NTESControlCommand command = [info jsonInteger:@"command"];
        if (command == NTESControlCommandResult)
        {
            BOOL result = [info jsonBool:@"data"];
            if ([self.delegate respondsToSelector:@selector(onReceiveTryLuckResult:creatorId:)])
            {
                [self.delegate onReceiveTryLuckResult:result creatorId:notification.sender];
            }
        }
    }
}

@end
