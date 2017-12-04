//
//  NTESLoginService.h
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NTESLoginService : NSObject

- (void)login:(void(^)(NSError *error))completion;

@end
