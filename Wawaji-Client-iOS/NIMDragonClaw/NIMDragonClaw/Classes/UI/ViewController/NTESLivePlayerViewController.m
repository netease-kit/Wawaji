//
//  NTESLivePlayerViewController.m
//  NIMDragonClaw
//
//  Created by emily on 2017/11/17.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESLivePlayerViewController.h"
#import "NELivePlayerController.h"
#import "NELivePlayer.h"

@interface NTESLivePlayerViewController ()

@property(nonatomic, strong) dispatch_source_t timer;

@property(nonatomic, assign) NSTimeInterval duration;

@property(nonatomic, assign) BOOL isPaused;

@property(nonatomic, assign) BOOL needRecover;

@property(nonatomic, strong) NSString *first_url;

@property(nonatomic, strong) id<NELivePlayer> livePlayer;

@property(nonatomic, strong) UIView *containerView;

@end

@implementation NTESLivePlayerViewController

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    DDLogVerbose(@"NTESLivePlayer VC release");
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self setupSubviews];
    
    [self setupNotification];
    
}

- (void)viewWillDisappear:(BOOL)animated {
    [SVProgressHUD dismiss];
}

- (void)setupSubviews {
    self.view.backgroundColor = [UIColor blackColor];
}

- (void)setupNotification {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(NELivePlayerDidPreparedToPlay:)
                                                 name:NELivePlayerDidPreparedToPlayNotification
                                               object:nil];
    
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(NELivePlayerloadStateChanged:)
                                                 name:NELivePlayerLoadStateChangedNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(NELivePlayerPlayBackFinished:)
                                                 name:NELivePlayerPlaybackFinishedNotification
                                               object:nil];
    
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(NELivePlayerNetworkChanged:)
                                                 name:kRealReachabilityChangedNotification
                                               object:nil];
    
   
}

#pragma mark - Public
- (void)playWithURL:(NSString *)streamUrl {
    _first_url = streamUrl;
    NSURL *pullURL = [NSURL URLWithString:streamUrl];
    [self.livePlayer.view removeFromSuperview];
    self.livePlayer = [self setupPlayerWithURL:pullURL];
    
    if (self.livePlayer == nil) {
        [SVProgressHUD showWithStatus:@"缓冲中..."];
        NSError *error = [NSError errorWithDomain:@"PlayerDomain" code:-1000 userInfo:@{NTES_ERROR_MSG_KEY: @"播放出错"}];
        [self performSelector:@selector(doPlayComplete:) withObject:error afterDelay:1];
    }
    else {
        [self.view addSubview:self.livePlayer.view];
        self.livePlayer.view.frame = self.view.bounds;
        if (![self.livePlayer isPreparedToPlay]) {
            [SVProgressHUD showWithStatus:@"缓冲中..."];
            NSError *error = [NSError errorWithDomain:@"PlayerDomain" code:-1000 userInfo:@{NTES_ERROR_MSG_KEY: @"播放出错"}];
            [self performSelector:@selector(doPlayComplete:) withObject:error afterDelay:30];
            //准备播放
            [self.livePlayer prepareToPlay];
        }
    }
}

#pragma mark - Player Notification
- (void)NELivePlayerDidPreparedToPlay:(NSNotification *)notification {
    if (notification.object != self.livePlayer) return ;
    [NSObject cancelPreviousPerformRequestsWithTarget:self];
    [SVProgressHUD dismiss];
    [self.livePlayer play];
}

- (void)NELivePlayerPlayBackFinished:(NSNotification *)notification {
    [SVProgressHUD dismiss];
    [NSObject cancelPreviousPerformRequestsWithTarget:self];
    NSInteger status = [[[notification userInfo] valueForKey:NELivePlayerPlaybackDidFinishReasonUserInfoKey] integerValue];
    switch (status) {
        case NELPMovieFinishReasonPlaybackEnded:
        {
            DDLogInfo(@"NELPMovieFinishReasonPlaybackEnded");
            [self doPlayComplete:nil];
        }
            break;
        case NELPMovieFinishReasonPlaybackError:
        {
            DDLogInfo(@"NELPMovieFinishReasonPlaybackError");
            NSError *error = [NSError errorWithDomain:@"PlayerDomain" code:-1000 userInfo:@{NTES_ERROR_MSG_KEY: @"播放出错"}];
            [self doPlayComplete:error];
        }
            break;
        case NELPMovieFinishReasonUserExited:
        default:
            DDLogInfo(@"NELPMovieFinishReasonUserExited");
            break;
    }
}

- (void)NELivePlayerloadStateChanged:(NSNotification *)notification {
    NELPMovieLoadState nelpState = self.livePlayer.loadState;
    switch (nelpState) {
        case NELPMovieLoadStatePlaythroughOK:
            {
                [NSObject cancelPreviousPerformRequestsWithTarget:self];
                [SVProgressHUD dismiss];
            }
            break;
        case NELPMovieLoadStateStalled:
        {
            [SVProgressHUD showWithStatus:@"缓冲中..."];
            //incase 推流端异常结束，播放端收不到结束通知
            NSError *error = [[NSError alloc] initWithDomain:@"palyer" code:-1001 userInfo:nil];
            [self performSelector:@selector(doPlayComplete:) withObject:error afterDelay:30];
        }
            break;
        default:
            break;
    }
    
}

- (void)NELivePlayerNetworkChanged:(NSNotification *)notification {
    RealReachability *reachability = [RealReachability sharedInstance];
    ReachabilityStatus status = [reachability currentReachabilityStatus];
    
    [SVProgressHUD dismiss];
    
    if (status == RealStatusNotReachable) {
        [self.livePlayer shutdown];
        
        _needRecover = YES;
        
        [SVProgressHUD showWithStatus:@"重连中..."];
        //10s
        [self performSelector:@selector(retryWhenNetchanged) withObject:nil afterDelay:10];
    }
    else if (status == RealStatusViaWiFi || status == RealStatusViaWWAN) {
        if ([reachability previousReachabilityStatus] == RealStatusNotReachable) { //none->wifi.4G
            [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(retryWhenNetchanged) object:nil];
            if (_needRecover) {
                [self retry];
            }
        }
    }
}

#pragma mark - 网络切换
- (void)retryWhenNetchanged {
    [SVProgressHUD dismiss];
    _needRecover = NO;
    NSString *toast = [NSString stringWithFormat:@"重连失败"];
    [self.view makeToast:toast duration:2.0 position:CSToastPositionCenter];
    
    NSError *error = [NSError errorWithDomain:@"ntesdemo.play.error"
                                         code:0x1000
                                     userInfo:@{NTES_ERROR_MSG_KEY : @"网络重连失败"}];
    [self doPlayComplete:error];
}

- (void)retry {
    RealReachability *reachability = [RealReachability sharedInstance];
    ReachabilityStatus status = [reachability currentReachabilityStatus];
    if (status == RealStatusViaWWAN || status == RealStatusViaWiFi) {
        //重连先销毁
        [self releasePlayer];
        //再开始
        [self playWithURL:_first_url];
        _needRecover = NO;
    }
    else {
        NSString *toast = [NSString stringWithFormat:@"重连失败"];
        [self.view makeToast:toast duration:2 position:CSToastPositionCenter];
    }
}


#pragma mark - Private
- (void)doPlayComplete:(NSError *)error {
    WEAK_SELF(weakSelf);
    dispatch_async(dispatch_get_main_queue(), ^{
        [SVProgressHUD dismiss];
        NSString *msg = (error ? @"播放出错" : @"直播已完成");
        [weakSelf.view makeToast:msg duration:2 position:CSToastPositionCenter];
    });
    [self releasePlayer];
}

- (void)releasePlayer {
    DDLogInfo(@"releasePlayer");
    [_livePlayer.view removeFromSuperview];
    [_livePlayer shutdown];
    _livePlayer = nil;
    [UIApplication sharedApplication].idleTimerDisabled  = NO;
}

#pragma mark - Getter

- (NELivePlayerController *)setupPlayerWithURL:(NSURL *)url {
    DDLogVerbose(@"player version [%@]", [NELivePlayerController getSDKVersion]);
    NSError *error = nil;
    NELivePlayerController *player = [[NELivePlayerController alloc] initWithContentURL:url error:&error];
    [NELivePlayerController setLogLevel:NELP_LOG_SILENT];
    if (player == nil) {
        NSString *toast = [NSString stringWithFormat:@"播放器初始化失败，error : [%zi]", error.code];
        DDLogError(@"live player init failed");
        [self.view makeToast:toast duration:2 position:CSToastPositionCenter];
        return nil;
    }
    
    [player setBufferStrategy:NELPLowDelay];//低延时模式
    [player setScalingMode:NELPMovieScalingModeAspectFill];
    [player setShouldAutoplay:YES];
    [player setAutoSwitchDefinition:YES];
    [player setHardwareDecoder:NO];
    [player setPauseInBackground:NO];
    [player setPlaybackTimeout:10 * 1000];
    [player setMute:YES];
    [UIApplication sharedApplication].idleTimerDisabled = YES;
    return player;
}


@end
