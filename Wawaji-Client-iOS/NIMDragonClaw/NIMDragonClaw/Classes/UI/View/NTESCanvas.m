//
//  NTESCanvas.m
//  NIMDragonClaw
//
//  Created by chris on 2017/11/23.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESCanvas.h"
#import "NTESGLView.h"

@interface NTESCanvas()<NIMNetCallManagerDelegate>

@property (nonatomic, strong) NSMutableArray *playerViews;

@property (nonatomic, strong) NTESGLView *glView;

@end

@implementation NTESCanvas

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self)
    {
        _playerViews = [[NSMutableArray alloc] init];
        [self addListener];
    }
    return self;
}

- (void)dealloc
{
    [self removeListener];
}

- (void)addListener
{
    [[NIMAVChatSDK sharedSDK].netCallManager addDelegate:self];
}

- (void)removeListener
{
    [[NIMAVChatSDK sharedSDK].netCallManager removeDelegate:self];
}

- (void)addPlayerView:(UIView *)view
{
    view.frame = self.bounds;
    view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self addSubview:view];
    if (self.playerViews.count)
    {
        //添加时保证只有第一个 view 是可见的
        view.hidden = YES;
    }
    [self.playerViews addObject:view];
}

- (void)switchPlayerView
{
    if (!self.glView.hidden)
    {
        //当前在点对点渲染状态下，不做任何事
        return;
    }
    if (!self.playerViews.count) {
        //没有播放器，直接退出
        return;
    }
    //否则切换播放器
    NSInteger index = 0;
    for (; index < self.playerViews.count; index++)
    {
        UIView *view = [self.playerViews objectAtIndex:index];
        if (!view.hidden) {
            view.hidden = YES;
            break;
        }
    }
    index = (index + 1) % self.playerViews.count;
    UIView *view = [self.playerViews objectAtIndex:index];
    view.hidden = NO;
}


#pragma mark - NIMNetCallManagerDelegate

- (void)onCallEstablished:(UInt64)callID
{
    self.glView.hidden = NO;
}

- (void)onCallDisconnected:(UInt64)callID
                 withError:(nullable NSError *)error
{
    self.glView.hidden = YES;
}

- (void)onRemoteYUVReady:(NSData *)yuvData
                   width:(NSUInteger)width
                  height:(NSUInteger)height
                    from:(NSString *)user
{
    if (([[UIApplication sharedApplication] applicationState] == UIApplicationStateActive)) {
        [self.glView render:yuvData width:width height:height];
    }
}



- (NTESGLView *)glView
{
    if (!_glView)
    {
        _glView = [[NTESGLView alloc] initWithFrame:self.bounds];
        [_glView setContentMode:UIViewContentModeScaleAspectFill];
        [_glView setBackgroundColor:[UIColor clearColor]];
        _glView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        _glView.hidden = YES;
        [self addSubview:_glView];
    }
    return _glView;
}
@end
