//
//  UIButton+Captcha.h
//  LiveStream_IM_Demo
//
//  Created by emily on 2017/6/29.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <UIKit/UIKit.h>

#define tryLuckNowNotification @"tryLuckNowNotification"

@interface UIButton (Captcha)

@property (nonatomic, strong) dispatch_source_t timer;

- (void)startTimeAtCaptchaButton;

- (void)releaseTimeAtCaptchaButton;

@end
