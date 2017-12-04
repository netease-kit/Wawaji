//
//  NTESNetwork.h
//  NIMDragonClaw
//
//  Created by chris on 2017/11/17.
//  Copyright © 2017 Netease. All rights reserved.
//

#import "NTESNetworkTask.h"

@interface NTESNetwork : NSObject

+ (instancetype)sharedNetwork;

- (void)postNetworkTask:(id<NTESNetworkTask>)task
             completion:(void(^)(NSError *error, id jsonObject))completion;

@end
