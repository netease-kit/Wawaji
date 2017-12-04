//
//  NTESNetworkTask.h
//  NIMDragonClaw
//
//  Created by chris on 2017/11/17.
//  Copyright © 2017 Netease. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol NTESNetworkTask <NSObject>

@required
- (NSString *)requestMethod;

@optional
- (NSDictionary *)param;


@end
