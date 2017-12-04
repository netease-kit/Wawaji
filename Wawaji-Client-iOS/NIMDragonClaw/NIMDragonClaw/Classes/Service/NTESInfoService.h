//
//  NTESInfoService.h
//  NIMDragonClaw
//
//  Created by chris on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NTESDragroom.h"
#import "NTESUser.h"

@interface NTESInfoService : NSObject

- (void)fetchRoomsFromServer:(void(^)(NSError *error, NSArray<NTESDragroom *> *rooms))completion;

- (void)fetchWaitQueueFromIM:(NSString *)roomId
                  completion:(void(^)(NSError *error, NSArray<NTESUser *> *users))completion;

@end
