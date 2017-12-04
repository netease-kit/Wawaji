//
//  NTESService.h
//  NIMDragonClaw
//
//  Created by chris on 2017/11/22.
//  Copyright © 2017年 Netease. All rights reserved.
//


#import "NTESLoginService.h"
#import "NTESControlService.h"
#import "NTESInfoService.h"

@interface NTESService : NSObject

+ (instancetype)sharedService;

@property (nonatomic,strong) NTESLoginService *loginService;

@property (nonatomic,strong) NTESInfoService *infoService;

@property (nonatomic,strong) NTESControlService *controlService;

@end
