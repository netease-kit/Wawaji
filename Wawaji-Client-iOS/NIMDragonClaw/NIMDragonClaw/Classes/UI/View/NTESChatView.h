//
//  NTESChatView.h
//  LiveStream_IM_Demo
//
//  Created by Netease on 17/1/11.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "NTESNormalMsgView.h"
#import "NTESTextMessage.h"

@interface NTESChatView : UIView

- (void)addNormalMessages:(NSArray <NTESTextMessage *> *)normalMessages;

@end
