//
//  NTESDragroom.h
//  NIMDragonClaw
//
//  Created by William on 2017/11/19.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, NTESDragroomLiveStatus) {
    NTESDragroomLiveStatusFree, //空闲
    NTESDragroomLiveStatusLiving, //直播中
    NTESDragroomLiveStatusForbidden, //禁用
    NTESDragroomLiveStatusLivingAndRecording, //直播录制中
    
};

@interface NTESDragroom : NSObject

@property (nonatomic, copy) NSString *roomId;

@property (nonatomic, copy) NSString *name;

@property (nonatomic, copy) NSString *creator;

@property (nonatomic, copy) NSString *rtmpPullUrl1;

@property (nonatomic, copy) NSString *rtmpPullUrl2;

@property (nonatomic, assign) BOOL roomStatus;

@property (nonatomic, assign) NTESDragroomLiveStatus liveStatus;

@property (nonatomic, assign) NSInteger onlineUserCount;

@property(nonatomic, assign) NSInteger queueCount;

@end
