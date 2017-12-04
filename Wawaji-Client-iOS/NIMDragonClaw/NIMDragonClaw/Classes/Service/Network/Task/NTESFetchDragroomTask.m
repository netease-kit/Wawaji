//
//  NTESFetchChatroomTask.m
//  NIM
//
//  Created by chris on 2017/11/20.
//  Copyright © 2016 Netease. All rights reserved.
//

#import "NTESFetchDragroomTask.h"
#import "NSDictionary+NTESJson.h"

@implementation NTESFetchDragroomTask

- (NSString *)requestMethod
{
    return @"dollsCatcher/room/list";  
}


- (NSDictionary *)param
{
    if ([NIMSDK sharedSDK].loginManager.currentAccount.length)
    {
        NSString *sid = [NIMSDK sharedSDK].loginManager.currentAccount;
        return @{@"sid":sid};
    }
    return @{};
}

@end
