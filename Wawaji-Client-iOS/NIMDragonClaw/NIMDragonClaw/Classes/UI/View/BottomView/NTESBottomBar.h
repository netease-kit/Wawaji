//
//  NTESBottomBar.h
//  NIMDragonClaw
//
//  Created by emily on 2017/11/22.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UIButton+Captcha.h"

#define NTESStopGameNotification @"NTESStopGameNotification"

typedef NS_ENUM(NSInteger, NTESDragDirection) {
    NTESDragDirectionLeft = 1,
    NTESDragDirectionTop,
    NTESDragDirectionRight,
    NTESDragDirectionDown,
};

typedef NS_ENUM(NSInteger, NTESQueueBtnState) {
    NTESQueueBtnStateWaitForQueue = 1,
    NTESQueueBtnStateQueuing,
    NTESQueueBtnStateWaitForTry,
};

@class NTESBottomBar;

@protocol NTESBottomBarDelegate <NSObject>

@optional
//点击聊天按钮
- (void)bottomBarClickChat:(NTESBottomBar *)bar;
//点击排队
- (void)bottomBarClickQueue:(NTESBottomBar *)bar;
//点击取消排队
- (void)bottomBarClickQueueCancel:(NTESBottomBar *)bar;
//下爪
- (void)bottomBarTryAction:(NTESBottomBar *)bar;
//方向
- (void)bottomBar:(NTESBottomBar *)bar direction:(NTESDragDirection)direction;

@end

@interface NTESBottomBar : UIView

@property(nonatomic, weak) id<NTESBottomBarDelegate> delegate;

@property(nonatomic, strong) UIButton *chatBtn;

@property(nonatomic, strong) UIButton *queueBtn;

@property(nonatomic, strong) UIButton *cancelQBtn;

@property(nonatomic, strong) UIButton *goBtn;

@property(nonatomic, strong) UIButton *goBtnBackground;

@property(nonatomic, assign) NTESQueueBtnState queueBtnState;

- (void)switchUI:(BOOL)isPrepareShow;

- (void)refreshQueueState:(NTESQueueBtnState)state;

@end
