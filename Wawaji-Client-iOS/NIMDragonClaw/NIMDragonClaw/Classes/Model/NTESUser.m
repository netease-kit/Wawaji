//
//  NTESUser.m
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESUser.h"
#import "NSDictionary+NTESJson.h"
@implementation NTESUser

+ (instancetype)userWithInfo:(NSDictionary *)info
{
    NTESUser *user = [[NTESUser alloc] init];
    user.userId = [info jsonString:@"userId"];
    user.nick   = [info jsonString:@"nick"];
    return user;
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"user id : %@ , user nick : %@",self.userId,self.nick];
}

@end
