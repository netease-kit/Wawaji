//
//  NTESLoginTask.h
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESNetworkTask.h"

@interface NTESLoginTask : NSObject<NTESNetworkTask>

@property (nonatomic, copy) NSString *sid;

@end
