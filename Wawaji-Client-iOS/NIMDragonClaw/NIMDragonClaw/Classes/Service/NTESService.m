//
//  NTESService.m
//  NIMDragonClaw
//
//  Created by chris on 2017/11/22.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESService.h"

@implementation NTESService

+ (instancetype)sharedService
{
    static NTESService *instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[NTESService alloc] init];
    });
    return instance;
}

- (instancetype)init
{
    self = [super init];
    if (self)
    {
        _loginService   = [[NTESLoginService alloc] init];
        _controlService = [[NTESControlService alloc] init];
        _infoService    = [[NTESInfoService alloc] init];
    }
    return self;
}

@end
