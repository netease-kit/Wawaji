//
//  NTESBottomBar.m
//  NIMDragonClaw
//
//  Created by emily on 2017/11/22.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESBottomBar.h"

typedef NS_ENUM(NSInteger, NTESBottomBarActionType) {
    NTESBottomBarActionTypeChat = 100,
    NTESBottomBarActionTypeQueue,
    NTESBottomBarActionTypeCancel,
};

@interface NTESBottomBar ()

@property(nonatomic, strong) UIButton *topBtn;

@property(nonatomic, strong) UIButton *leftBtn;

@property(nonatomic, strong) UIButton *bottomBtn;

@property(nonatomic, strong) UIButton *rightBtn;

@property(nonatomic, assign) BOOL isPrepareShow;

@property(nonatomic, strong) CADisplayLink *countDownTimer;

@property(nonatomic, assign) NSInteger countDown;

@end

@implementation NTESBottomBar

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        _isPrepareShow = YES;
        [self setupSubviews];
        [self switchUI:self.isPrepareShow];
        [self setupNotify];
        _countDown = 11;
        _queueBtnState = NTESQueueBtnStateWaitForQueue;
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    if (self = [super initWithCoder:aDecoder]) {
        [self setupSubviews];
    }
    return self;
}

- (void)setupSubviews {
    [@[self.chatBtn,
       self.queueBtn,
       self.cancelQBtn] enumerateObjectsUsingBlock:^(UIView *view, NSUInteger idx, BOOL * _Nonnull stop) {
           [self addSubview:view];
       }];
    [@[self.topBtn,
       self.leftBtn,
       self.bottomBtn,
       self.rightBtn,
       self.goBtnBackground,
       self.goBtn] enumerateObjectsUsingBlock:^(UIView *view, NSUInteger idx, BOOL * _Nonnull stop) {
           [self addSubview:view];
       }];
    self.goBtn.frame = CGRectMake(0, 0, 40, 30);
    self.goBtn.centerX = self.goBtnBackground.centerX;
    self.goBtn.centerY = self.goBtnBackground.centerY + 10;
}

- (void)setupNotify {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(tryluckNowAction:) name:tryLuckNowNotification object:nil];
}

- (void)switchUI:(BOOL)isPrepareShow {
    [@[self.chatBtn,
       self.queueBtn,
       self.cancelQBtn] enumerateObjectsUsingBlock:^(UIView *view, NSUInteger idx, BOOL * _Nonnull stop) {
            view.hidden = !isPrepareShow;
        }];
    [@[self.topBtn,
       self.leftBtn,
       self.bottomBtn,
       self.rightBtn,
       self.goBtn,
       self.goBtnBackground] enumerateObjectsUsingBlock:^(UIView *view, NSUInteger idx, BOOL * _Nonnull stop) {
           view.hidden = isPrepareShow;
       }];
    if (!isPrepareShow) {
        [_goBtnBackground setBackgroundImage:[UIImage imageNamed:@"go"] forState:UIControlStateNormal];
        [_goBtnBackground setBackgroundImage:[UIImage imageNamed:@"goP"] forState:UIControlStateSelected];
        [self.goBtn startTimeAtCaptchaButton];
    }
}

#pragma mark - Actions

- (void)refreshQueueState:(NTESQueueBtnState)state {
    switch (state) {
        case NTESQueueBtnStateQueuing://排队中
        {
            WEAK_SELF(weakSelf);
            DDLogInfo(@"queue status Queuing");
            self.queueBtnState = NTESQueueBtnStateQueuing;
            [self.queueBtn setBackgroundImage:[UIImage imageNamed:@"room_bottom_queue"] forState:UIControlStateNormal];
            [self.queueBtn setBackgroundImage:[UIImage imageNamed:@"room_bottom_queue_pressed"] forState:UIControlStateSelected];
            [UIView animateWithDuration:0.3 animations:^{
                weakSelf.queueBtn.frame = CGRectMake(weakSelf.chatBtn.right + 10 * UISreenWidthScale, self.height - 58 *UISreenWidthScale, UIScreenWidth - 156 * UISreenWidthScale, 48 * UISreenWidthScale);
                weakSelf.cancelQBtn.frame = CGRectMake(UIScreenWidth - 78 * UISreenWidthScale, self.height - 58 *UISreenWidthScale, 68 * UISreenWidthScale, 48 * UISreenWidthScale);
                weakSelf.cancelQBtn.alpha = 1;
            }];
        }
            break;
        case NTESQueueBtnStateWaitForTry:
        {
            DDLogInfo(@"queue status WaitForTry");
            self.queueBtnState = NTESQueueBtnStateWaitForTry;
            [self.queueBtn setBackgroundImage:[UIImage imageNamed:@"room_bottom_waitfortry"] forState:UIControlStateNormal];
            [self.queueBtn setBackgroundImage:[UIImage imageNamed:@"room_bottom_waitfortry_pressed"] forState:UIControlStateSelected];
            [self waitForGame];
        }
            break;
        case NTESQueueBtnStateWaitForQueue://显示排队人数 大小恢复初始大小
        {
            DDLogInfo(@"queue status WaitForQueue");
            self.queueBtnState = NTESQueueBtnStateWaitForQueue;
            [self.queueBtn setBackgroundImage:[UIImage imageNamed:@"room_bottom_queue"] forState:UIControlStateNormal];
            [self.queueBtn setBackgroundImage:[UIImage imageNamed:@"room_bottom_queue_pressed"] forState:UIControlStateSelected];
            WEAK_SELF(weakSelf);
            [UIView animateWithDuration:0.3 animations:^{
                weakSelf.queueBtn.frame = CGRectMake(weakSelf.chatBtn.right + 10 * UISreenWidthScale, self.height - 58 * UISreenWidthScale, UIScreenWidth - 78 * UISreenWidthScale, 48 * UISreenWidthScale);
                weakSelf.cancelQBtn.alpha = 0;
            }];
        }
            break;
        default:
            break;
    }
}

- (void)waitForGame {
    self.countDown = NTES_QUEUE_RESPONSE_TIMEOUT+1;
    self.countDownTimer = [CADisplayLink displayLinkWithTarget:self selector:@selector(updateQuueBtn)];
    _countDownTimer.paused = NO;
    _countDownTimer.frameInterval = 60;
    [_countDownTimer addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)updateQuueBtn {
    _countDown --;
    if (_countDown == 0) {
        [[NSNotificationCenter defaultCenter] postNotificationName:NTESStopGameNotification object:nil];
        [self stopCountdown];
        return;
    }
    NSString *title = [NSString stringWithFormat:@"开始游戏（%luS)", (unsigned long)_countDown];
    NSAttributedString *attriTitle = [self getAttributedStr:title withFontSize:16.];
    [self.queueBtn setAttributedTitle:attriTitle forState:UIControlStateNormal];
}

- (void)stopCountdown {
    if (self.countDownTimer) {
        self.countDownTimer.paused = YES;
        [self.countDownTimer invalidate];
        self.countDownTimer = nil;
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

- (void)btnAction:(UIButton *)sender {
    sender.selected = !sender.selected;
    switch (sender.tag) {
        case NTESBottomBarActionTypeChat:
        {
            if (self.delegate && [self.delegate respondsToSelector:@selector(bottomBarClickChat:)]) {
                [self.delegate bottomBarClickChat:self];
            }
        }
            break;
        case NTESBottomBarActionTypeQueue:
        {
            if (self.queueBtnState == NTESQueueBtnStateWaitForQueue) {
                [self stopCountdown];
                if (self.delegate && [self.delegate respondsToSelector:@selector(bottomBarClickQueue:)]) {
                    [self.delegate bottomBarClickQueue:self];
                }
            }
            if (self.queueBtnState == NTESQueueBtnStateWaitForTry) {
                [self stopCountdown];
                if (self.delegate && [self.delegate respondsToSelector:@selector(bottomBarClickQueue:)]) {
                    [self.delegate bottomBarClickQueue:self];
                }
            }
        }
            break;
        case NTESBottomBarActionTypeCancel:
        {
            [self stopCountdown];
            if (self.delegate && [self.delegate respondsToSelector:@selector(bottomBarClickQueueCancel:)]) {
                [self.delegate bottomBarClickQueueCancel:self];
            }
        }
            break;
        default:
            break;
    }
}


- (void)startCountdownAction:(NSNotification *)noti {
    //进入该页面即开始倒计时
    [self.goBtn startTimeAtCaptchaButton];
}

- (void)tryluckNowAction:(NSNotification *)noti {
    [self.goBtn releaseTimeAtCaptchaButton];
    [self.goBtnBackground setBackgroundImage:[UIImage imageNamed:@"wait"] forState:UIControlStateNormal];
    self.goBtnBackground.userInteractionEnabled = NO;
    self.goBtn.userInteractionEnabled = NO;
    if (self.delegate && [self.delegate respondsToSelector:@selector(bottomBarTryAction:)]) {
        [self.delegate bottomBarTryAction:self];
    }
}

- (void)topBtnAction:(UIButton *)sender {
    if (self.delegate && [self.delegate respondsToSelector:@selector(bottomBar:direction:)]) {
        [self.delegate bottomBar:self direction:NTESDragDirectionTop];
    }
}

- (void)leftBtnAction:(UIButton *)sender {
    if (self.delegate && [self.delegate respondsToSelector:@selector(bottomBar:direction:)]) {
        [self.delegate bottomBar:self direction:NTESDragDirectionLeft];
    }
}

- (void)bottomBtnAction:(UIButton *)sender {
    if (self.delegate && [self.delegate respondsToSelector:@selector(bottomBar:direction:)]) {
        [self.delegate bottomBar:self direction:NTESDragDirectionDown];
    }
}

- (void)rightBtnAction:(UIButton *)sender {
    if (self.delegate && [self.delegate respondsToSelector:@selector(bottomBar:direction:)]) {
        [self.delegate bottomBar:self direction:NTESDragDirectionRight];
    }
}

- (void)goBtnAction:(UIButton *)sender {
    DDLogInfo(@"手动下爪");
    [self.goBtnBackground setBackgroundImage:[UIImage imageNamed:@"wait"] forState:UIControlStateNormal];
    [self.goBtn releaseTimeAtCaptchaButton];
    if (self.delegate && [self.delegate respondsToSelector:@selector(bottomBarTryAction:)]) {
        [self.delegate bottomBarTryAction:self];
    }
}

#pragma mark - Getter

- (UIButton *)chatBtn {
    if (!_chatBtn) {
        _chatBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _chatBtn.frame = CGRectMake(10 * UISreenWidthScale, self.height - 58 * UISreenWidthScale, 48 * UISreenWidthScale, 48 * UISreenWidthScale);
        _chatBtn.tag = NTESBottomBarActionTypeChat;
        [_chatBtn setBackgroundImage:[UIImage imageNamed:@"chat"] forState:UIControlStateNormal];
        [_chatBtn setBackgroundImage:[UIImage imageNamed:@"chatP"] forState:UIControlStateSelected];
        [_chatBtn addTarget:self action:@selector(btnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _chatBtn;
}

- (UIButton *)queueBtn {
    if (!_queueBtn) {
        _queueBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _queueBtn.frame = CGRectMake(self.chatBtn.right + 10 * UISreenWidthScale, self.height - 58 *UISreenWidthScale, UIScreenWidth - 78 * UISreenWidthScale, 48 * UISreenWidthScale);
        _queueBtn.tag = NTESBottomBarActionTypeQueue;
        [_queueBtn setBackgroundImage:[UIImage imageNamed:@"room_bottom_queue"] forState:UIControlStateNormal];
        [_queueBtn setBackgroundImage:[UIImage imageNamed:@"room_bottom_queue_pressed"] forState:UIControlStateSelected];
        _queueBtn.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;
        _queueBtn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentCenter;
        [_queueBtn addTarget:self action:@selector(btnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _queueBtn;
}

- (UIButton *)cancelQBtn {
    if (!_cancelQBtn) {
        _cancelQBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _cancelQBtn.frame = CGRectMake(UIScreenWidth - 58 * UISreenWidthScale, self.height - 60 *UISreenWidthScale, 68 * UISreenWidthScale, 48 * UISreenWidthScale);
        _cancelQBtn.tag = NTESBottomBarActionTypeCancel;
        [_cancelQBtn setBackgroundImage:[UIImage imageNamed:@"room_cancel_queue"] forState:UIControlStateNormal];
        [_cancelQBtn setBackgroundImage:[UIImage imageNamed:@"room_cancel_queue_pressed"] forState:UIControlStateSelected];
        NSString *str = @"取消";
        NSAttributedString *attStr = [self getAttributedStr:str withFontSize:16];
        [_cancelQBtn setAttributedTitle:attStr forState:UIControlStateNormal];
        _cancelQBtn.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;
        _cancelQBtn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentCenter;
        [_cancelQBtn addTarget:self action:@selector(btnAction:) forControlEvents:UIControlEventTouchUpInside];
        _cancelQBtn.alpha = 0.f;
    }
    return _cancelQBtn;
}

- (UIButton *)topBtn {
    if (!_topBtn) {
        _topBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _topBtn.frame = CGRectMake(70 * UISreenWidthScale, self.height / 2 - 19 * UISreenWidthScale - 68 * UISreenWidthScale, 64 * UISreenWidthScale, 68 * UISreenWidthScale);
        [_topBtn setBackgroundImage:[UIImage imageNamed:@"up"] forState:UIControlStateNormal];
        [_topBtn setBackgroundImage:[UIImage imageNamed:@"upP"] forState:UIControlStateSelected];
        [_topBtn addTarget:self action:@selector(topBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _topBtn;
}

- (UIButton *)leftBtn {
    if (!_leftBtn) {
        _leftBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _leftBtn.frame = CGRectMake(20 * UISreenWidthScale, self.height / 2 - 34 * UISreenWidthScale, 64 * UISreenWidthScale, 68 * UISreenWidthScale);
        [_leftBtn setBackgroundImage:[UIImage imageNamed:@"left"] forState:UIControlStateNormal];
        [_leftBtn setBackgroundImage:[UIImage imageNamed:@"leftP"] forState:UIControlStateSelected];
        [_leftBtn addTarget:self action:@selector(leftBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _leftBtn;
}

- (UIButton *)bottomBtn {
    if (!_bottomBtn) {
        _bottomBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _bottomBtn.frame = CGRectMake(70 * UISreenWidthScale, self.topBtn.bottom + 38 * UISreenWidthScale, 64 * UISreenWidthScale, 68 * UISreenWidthScale);
        [_bottomBtn setBackgroundImage:[UIImage imageNamed:@"down"] forState:UIControlStateNormal];
        [_bottomBtn setBackgroundImage:[UIImage imageNamed:@"downP"] forState:UIControlStateSelected];
        [_bottomBtn addTarget:self action:@selector(bottomBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _bottomBtn;
}

- (UIButton *)rightBtn {
    if (!_rightBtn) {
        _rightBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _rightBtn.frame = CGRectMake(self.leftBtn.right + 38 * UISreenWidthScale, self.height / 2 - 34 * UISreenWidthScale, 64 * UISreenWidthScale, 68 * UISreenWidthScale);
        [_rightBtn setBackgroundImage:[UIImage imageNamed:@"right"] forState:UIControlStateNormal];
        [_rightBtn setBackgroundImage:[UIImage imageNamed:@"rightP"] forState:UIControlStateSelected];
        [_rightBtn addTarget:self action:@selector(rightBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _rightBtn;
}

- (UIButton *)goBtn {
    if (!_goBtn) {
        _goBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        NSAttributedString *str = [self getAttributedStr:@"30S" withFontSize:11];
        [_goBtn setAttributedTitle:str forState:UIControlStateNormal];
        _goBtn.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;
        [_goBtn addTarget:self action:@selector(goBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _goBtn;
}

- (UIButton *)goBtnBackground {
    if (!_goBtnBackground) {
        _goBtnBackground = [UIButton buttonWithType:UIButtonTypeCustom];
        _goBtnBackground.frame = CGRectMake(self.width - 106 * UISreenWidthScale, self.height / 2 - 50.5 * UISreenWidthScale, 97 * UISreenWidthScale, 101 * UISreenWidthScale);
        [_goBtnBackground setBackgroundImage:[UIImage imageNamed:@"go"] forState:UIControlStateNormal];
        [_goBtnBackground setBackgroundImage:[UIImage imageNamed:@"goP"] forState:UIControlStateSelected];
        [_goBtnBackground addTarget:self action:@selector(goBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _goBtnBackground;
}


@end
