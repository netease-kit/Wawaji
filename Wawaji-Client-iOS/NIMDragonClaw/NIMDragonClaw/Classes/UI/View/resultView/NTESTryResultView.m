//
//  NTESTryResultView.m
//  NIMDragonClaw
//
//  Created by emily on 2017/11/27.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESTryResultView.h"

#define spacing UIScreenWidth - 50

@interface NTESTryResultView()

@property(nonatomic, strong) UIView *bgView;

@property(nonatomic, strong) UIImageView *avatarImg;

@property(nonatomic, strong) UIButton *endBtn;

@property(nonatomic, strong) UIButton *queueBtn;

@property(nonatomic, strong) UILabel *titleLabel;

@property(nonatomic, strong) UILabel *contentLabel;

@end

@implementation NTESTryResultView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self setupSubviews];
    }
    return self;
}

- (void)setupSubviews {
    [self addSubview:self.bgView];
    [@[
      self.avatarImg,
      self.endBtn,
      self.queueBtn,
      self.titleLabel,
      self.titleLabel,
      self.contentLabel] enumerateObjectsUsingBlock:^(UIView *view, NSUInteger idx, BOOL * _Nonnull stop) {
          [self.bgView addSubview:view];
      }];
    
    self.backgroundColor = [UIColor colorWithWhite:0 alpha:0.4];
}

- (void)setupTryState:(NTESTryResult)result {
    if (result == NTESTryResultLuck) {
        self.bgView.backgroundColor = UIColorFromRGB(0xFF7474);
        self.avatarImg.frame = CGRectMake(95 * UISreenWidthScale, 36 * UISreenWidthScale, 100 * UISreenWidthScale,  65 * UISreenWidthScale);
        self.avatarImg.image = [UIImage imageNamed:@"result_avatar_suc"];
        self.titleLabel.text = @"恭喜你！666";
        self.contentLabel.text = @"鉴于这只是个DEMO，所以抱歉奖品不能寄给你啦~";
        
    }
    else if (result == NTESTryResultMiss) {
        self.avatarImg.frame = CGRectMake(95 * UISreenWidthScale, 36 * UISreenWidthScale, 90 * UISreenWidthScale,  70 * UISreenWidthScale);
        self.bgView.backgroundColor = UIColorFromRGB(0x9359FE);
        self.avatarImg.image = [UIImage imageNamed:@"result_avatar_fail"];
        self.titleLabel.text = @"非常遗憾";
        self.contentLabel.text = @"与奖品擦肩而过哦~";
    }
}

#pragma mark - Action

- (void)endBtnAction:(UIButton *)sender {
    if (self.delegate && [self.delegate respondsToSelector:@selector(resultViewEndGameClicked:)]) {
        [self.delegate resultViewEndGameClicked:self];
    }
}

- (void)queueBtnAction:(UIButton *)sender {
    if (self.delegate && [self.delegate respondsToSelector:@selector(resultViewQueueClicked:)]) {
        [self.delegate resultViewQueueClicked:self];
    }
}


#pragma mark - Getter

- (UIView *)bgView {
    if (!_bgView) {
        _bgView = [[UIView alloc] initWithFrame:CGRectMake(25 * UISreenWidthScale, 163 * UISreenWidthScale, spacing, spacing)];
        _bgView.layer.cornerRadius = 10;
        _bgView.layer.borderColor = [UIColor whiteColor].CGColor;
        _bgView.layer.borderWidth = 5;
        _bgView.clipsToBounds = YES;
    }
    return _bgView;
}

- (UIImageView *)avatarImg {
    if (!_avatarImg) {
        _avatarImg = [[UIImageView alloc] initWithFrame:CGRectMake(100 * UISreenWidthScale, 36 * UISreenWidthScale, 100 * UISreenWidthScale,  67 * UISreenWidthScale)];
    }
    return _avatarImg;
}

- (UILabel *)titleLabel {
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(18 * UISreenWidthScale, 113 * UISreenWidthScale, spacing - 36, 20 * UISreenWidthScale)];
        _titleLabel.textColor = [UIColor whiteColor];
        _titleLabel.font = [UIFont boldSystemFontOfSize:18];
        _titleLabel.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLabel;
}

- (UILabel *)contentLabel {
    if (!_contentLabel) {
        _contentLabel = [[UILabel alloc] initWithFrame:CGRectMake(18 * UISreenWidthScale, 133 * UISreenWidthScale, spacing - 36, 40 * UISreenWidthScale)];
        _contentLabel.textColor = [UIColor whiteColor];
        _contentLabel.font = [UIFont boldSystemFontOfSize:16];
        _contentLabel.textAlignment = NSTextAlignmentCenter;
        _contentLabel.numberOfLines = 2;
    }
    return _contentLabel;
}

- (UIButton *)endBtn {
    if(!_endBtn) {
        _endBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _endBtn.frame = CGRectMake(23 * UISreenWidthScale, 200 * UISreenWidthScale, 100 * UISreenWidthScale, 50);
        [_endBtn setBackgroundImage:[UIImage imageNamed:@"room_bottom_queue"] forState:UIControlStateNormal];
        NSAttributedString *str = [self getAttributedStr:@"结束游戏" withFontSize:14];
        [_endBtn setAttributedTitle:str forState:UIControlStateNormal];
        [_endBtn addTarget:self action:@selector(endBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _endBtn;
}

- (UIButton *)queueBtn {
    if (!_queueBtn) {
        _queueBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _queueBtn.frame = CGRectMake(157 * UISreenWidthScale, 200 * UISreenWidthScale, 100 * UISreenWidthScale, 50);
        [_queueBtn setBackgroundImage:[UIImage imageNamed:@"room_bottom_queue"] forState:UIControlStateNormal];
        NSAttributedString *str = [self getAttributedStr:@"重新排队" withFontSize:14];
        [_queueBtn setAttributedTitle:str forState:UIControlStateNormal];
        [_queueBtn addTarget:self action:@selector(queueBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _queueBtn;
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
