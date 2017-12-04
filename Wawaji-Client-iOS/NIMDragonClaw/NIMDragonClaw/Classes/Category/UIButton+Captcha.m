//
//  UIButton+Captcha.m
//  LiveStream_IM_Demo
//
//  Created by emily on 2017/6/29.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "UIButton+Captcha.h"
#import <objc/runtime.h>

static NSString *timerkey = @"timerKey";

@implementation UIButton (Captcha)

- (void)setTimer:(dispatch_source_t)timer {
    objc_setAssociatedObject(self, &timerkey, timer, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (dispatch_source_t)timer {
    return objc_getAssociatedObject(self, &timerkey);
}

- (void)startTimeAtCaptchaButton {
    __block int timeout = NTES_TRY_LUCK_TIMEOUT; //倒计时时间
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    self.timer = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0,queue);
    dispatch_source_set_timer(self.timer,dispatch_walltime(NULL, 0),1.0*NSEC_PER_SEC, 0); //每秒执行
    WEAK_SELF(weakSelf);
    dispatch_source_set_event_handler(self.timer, ^{
        if(timeout<=0){ //倒计时结束，关闭
            dispatch_source_cancel(weakSelf.timer);
            dispatch_async(dispatch_get_main_queue(), ^{
                STRONG_SELF(strongSelf);
                DDLogInfo(@"30S倒计时结束下爪");
                [[NSNotificationCenter defaultCenter] postNotificationName:tryLuckNowNotification object:nil];
                strongSelf.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;
                strongSelf.userInteractionEnabled = NO;
            });
        }else{
            int seconds = timeout % (timeout+1);
            NSString *strTime = [NSString stringWithFormat:@"%d", seconds];
            dispatch_async(dispatch_get_main_queue(), ^{
                STRONG_SELF(strongSelf);
                NSAttributedString *str = [self getAttributedStr:[NSString stringWithFormat:@"(%@S)",strTime] withFontSize:11];
                [strongSelf setAttributedTitle:str forState:UIControlStateNormal];
                strongSelf.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;
                strongSelf.userInteractionEnabled = YES;
            });
            timeout--;
        }
    });
    dispatch_resume(self.timer);
}

- (void)releaseTimeAtCaptchaButton {
    if (self.timer) {
        dispatch_source_cancel(self.timer);
        self.timer = nil;
        WEAK_SELF(weakSelf);
        dispatch_async(dispatch_get_main_queue(), ^{
            STRONG_SELF(strongSelf);
            [strongSelf setAttributedTitle:nil forState:UIControlStateNormal];
            strongSelf.userInteractionEnabled = NO;
        });
    }
}

- (NSMutableAttributedString *)getAttributedStr:(NSString *)str withFontSize:(CGFloat)size {
    NSMutableAttributedString *attStr = [[NSMutableAttributedString alloc] initWithString:str];
    //字体 字号
    if (ios9) {
         [attStr addAttribute:NSFontAttributeName value:[UIFont fontWithName:@"PingFangSC-Semibold" size:size] range:NSMakeRange(0, str.length)];
    }
    else {
         [attStr addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:size] range:NSMakeRange(0, str.length)];
    }
 
    //文字颜色
    [attStr addAttribute:NSForegroundColorAttributeName value:[UIColor whiteColor] range:NSMakeRange(0, str.length)];
    //文字描边
    [attStr addAttribute:NSStrokeColorAttributeName value:UIColorFromRGB(0x4D2711) range:NSMakeRange(0, str.length)];
    [attStr addAttribute:NSStrokeWidthAttributeName value:@(-4) range:NSMakeRange(0, str.length)];
    //文字阴影
    NSShadow *shadow = [[NSShadow alloc]init];
    shadow.shadowOffset = CGSizeMake(2, 2);
    shadow.shadowColor = UIColorFromRGB(0xEDB02E);
    shadow.shadowBlurRadius = 1;
    [attStr addAttribute:NSShadowAttributeName value:shadow range:NSMakeRange(0, str.length)];
    
    return attStr;
}


@end
