//
//  NTESInfoService.m
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESInfoService.h"
#import "NTESFetchDragroomTask.h"
#import "NTESNetwork.h"
#import "NSDictionary+NTESJson.h"

@implementation NTESInfoService

- (void)fetchRoomsFromServer:(void(^)(NSError *error, NSArray<NTESDragroom *> *rooms))completion
{
    DDLogInfo(@"fetch rooms from server ...");
    NTESFetchDragroomTask *task = [[NTESFetchDragroomTask alloc] init];
    __weak typeof(self) weakSelf = self;
    [[NTESNetwork sharedNetwork] postNetworkTask:task completion:^(NSError *error, id jsonObject) {
        NSArray<NTESDragroom *> *rooms = nil;
        if (!error && [jsonObject isKindOfClass:[NSDictionary class]])
        {
            rooms = [weakSelf makeDragrooms:jsonObject];
        }
        if (completion)
        {
            completion(error,rooms);
        }
    }];
}

- (NSArray *)makeDragrooms:(nonnull NSDictionary *)dict
{
    NSMutableArray *rooms = nil;
    NSDictionary *data = [dict jsonDict:@"data"];
    if (data)
    {
        NSArray *list = [data jsonArray:@"list"];
        for (NSDictionary *item in list)
        {
            if ([item isKindOfClass:[NSDictionary class]])
            {
                NTESDragroom *dragroom = [[NTESDragroom alloc] init];
                dragroom.roomId  = [item jsonString:@"roomId"];
                dragroom.name    = [item jsonString:@"name"];
                dragroom.creator = [item jsonString:@"creator"];
                dragroom.rtmpPullUrl1 = [item jsonString:@"rtmpPullUrl1"];
                dragroom.rtmpPullUrl2 = [item jsonString:@"rtmpPullUrl2"];
                dragroom.liveStatus     = [item jsonInteger:@"liveStatus"];
                dragroom.roomStatus     = [item jsonBool:@"roomStatus"];
                dragroom.onlineUserCount = [item jsonInteger:@"onlineUserCount"];
                dragroom.queueCount = [item jsonInteger:@"queueCount"];
                if (!rooms)
                {
                    rooms = [[NSMutableArray alloc] init];
                }
                [rooms addObject:dragroom];
            }
        }
    }
    return rooms;
}


- (void)fetchWaitQueueFromIM:(NSString *)roomId
                  completion:(void(^)(NSError *error, NSArray<NTESUser *> *users))completion
{
    DDLogInfo(@"fetch wait queue from IM ...");
    [[NIMSDK sharedSDK].chatroomManager fetchChatroomQueue:roomId completion:^(NSError * _Nullable error, NSArray<NSDictionary<NSString *,NSString *> *> * _Nullable info) {
        NSMutableArray<NTESUser *> *users = nil;
        if (!error)
        {
            users = [[NSMutableArray alloc] init];
            for (NSDictionary *item in info)
            {
                for (NSString *userId in item)
                {
                    NSDictionary *info = [NSDictionary dictByJsonString:[item jsonString:userId]];
                    NSString *nick = [info jsonString:@"nick"];
                    NTESUser *user = [NTESUser userWithInfo:@{@"userId":userId,@"nick":nick}];
                    [users addObject:user];
                }
            }
        }
        if (completion)
        {
            completion(error,users);
        }
    }];
}


@end
