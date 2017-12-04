//
//  NTESLoginService.m
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESLoginService.h"
#import "NTESInfoManager.h"
#import "NTESLoginTask.h"
#import "NTESNetwork.h"
#import "NSDictionary+NTESJson.h"

@interface NTESInfoManager(User)

- (void)addUserInfo:(NTESUser *)user;

@end

@implementation NTESLoginService

- (void)login:(void(^)(NSError *error))completion;
{
    NTESLoginTask *task = [[NTESLoginTask alloc] init];
    task.sid = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    DDLogInfo(@"start login...");
    [[NTESNetwork sharedNetwork] postNetworkTask:task completion:^(NSError *error, id jsonObject) {
        DDLogInfo(@"app login complete %zd",error.code);
        if (!error && [jsonObject isKindOfClass:[NSDictionary class]])
        {
            NSDictionary *data = [jsonObject jsonDict:@"data"];
            NSString *accid = [data jsonString:@"accid"];
            NSString *nick  = [data jsonString:@"nickname"];
            NSString *token = [data jsonString:@"imToken"];
            //开始登录云信
            [self loginNIM:accid token:token nick:nick completion:completion];
        }
        else if (completion)
        {
            completion(error);
        }
    }];
}


- (void)loginNIM:(NSString *)userId
           token:(NSString *)token
            nick:(NSString *)nick
      completion:(void(^)(NSError *error))completion
{
    [[NIMSDK sharedSDK].loginManager login:userId token:token completion:^(NSError * _Nullable error) {
        if (!error)
        {
            [[NSUserDefaults standardUserDefaults] setObject:userId forKey:@"userId"];
            NTESUser *user = [NTESUser userWithInfo:@{@"userId":userId,@"nick":nick}];
            [[NTESInfoManager sharedManager] addUserInfo:user];
        }
        if (completion)
        {
            completion(error);
        }
            
    }];
}

@end
