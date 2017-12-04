//
//  NTESUser.h
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NTESUser : NSObject

@property (nonatomic,strong) NSString *userId;

@property (nonatomic,strong) NSString *nick;

+ (instancetype)userWithInfo:(NSDictionary *)info;

@end
