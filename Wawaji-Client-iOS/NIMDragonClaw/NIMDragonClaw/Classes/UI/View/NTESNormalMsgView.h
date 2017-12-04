//
//  NTESNormalMsgView.h
//  NEUIDemo
//
//  Created by Netease on 17/1/3.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <UIKit/UIKit.h>

@class NTESTextMessage;

@interface NTESNormalMsgView : UIView

- (void)addMessages:(NSArray <NTESTextMessage *> *)messages;

@end
