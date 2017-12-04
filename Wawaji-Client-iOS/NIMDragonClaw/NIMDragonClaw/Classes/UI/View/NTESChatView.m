//
//  NTESChatView.m
//  LiveStream_IM_Demo
//
//  Created by Netease on 17/1/11.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESChatView.h"

@interface NTESChatView ()

@property (nonatomic, strong) NTESNormalMsgView *normalMsgView;

@end

@implementation NTESChatView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame])
    {
        [self customInit];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder
{
    if (self = [super initWithCoder:aDecoder])
    {
        [self customInit];
    }
    return self;
}

- (void)customInit
{
    [self addSubview:self.normalMsgView];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.normalMsgView.frame = CGRectMake(0, 0, self.width, self.height);
}

- (void)addNormalMessages:(NSArray <NTESTextMessage *> *)normalMessages
{
    [self.normalMsgView addMessages:normalMessages];
}


#pragma mark - Getter/Setter
- (NTESNormalMsgView *)normalMsgView
{
    if (!_normalMsgView) {
        _normalMsgView = [[NTESNormalMsgView alloc] init];
    }
    return _normalMsgView;
}

@end
