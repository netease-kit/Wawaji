//
//  NTESDragroomViewController.m
//  NIMDragonClaw
//
//  Created by William on 2017/11/19.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESDragroomViewController.h"
#import "NTESLivePlayerViewController.h"
#import "NTESDragroom.h"
#import <AVFoundation/AVFoundation.h>
#import "NTESService.h"
#import "NTESBottomBar.h"
#import "NTESTextInputView.h"
#import "NTESInfoManager.h"
#import "NTESCanvas.h"
#import "NTESChatView.h"
#import "NTESTextMessage.h"
#import "NTESTryResultView.h"

#define chatViewHeight UIScreenHeight - UIScreenWidth - (10 + 68) * UISreenWidthScale - kTopHeight

typedef NS_ENUM(NSInteger, NTESGameStatus) {
    NTESGameStatusTrywithCam1 = 1,
    NTESGameStatusTryWithCam2,
    NTESGameStatusWatch,
};

@interface NTESDragroomViewController () < NTESBottomBarDelegate, NTESTextInputViewDelegate, NIMNetCallManagerDelegate, NTESInfoManagerDelegate, NIMChatManagerDelegate, NTESTryResultViewDelegate>
{
    UInt64 _callID;
}

@property (nonatomic, strong) NTESLivePlayerViewController *firstPlayer;

@property (nonatomic, strong) NTESLivePlayerViewController *secondPlayer;

@property(nonatomic, strong) UIButton *cameraBtn;

@property(nonatomic, strong) UIButton *voiceBtn;

@property(nonatomic, strong) UIButton *leftBtn;

@property(nonatomic, strong) NSString *leftBtnTitle;

@property(nonatomic, strong) NTESCanvas *canvas;

@property(nonatomic, strong) AVAudioPlayer *audioPlayer;

@property(nonatomic, copy) NSString *pullURL1;

@property(nonatomic, copy) NSString *pullURL2;

@property(nonatomic, strong) NTESBottomBar *bottomBar;

@property(nonatomic, strong) NTESDragroom *room;

@property(nonatomic, strong) NTESTextInputView *textInputView;

@property(nonatomic, strong) NTESChatView *chatView;

@property(nonatomic, strong) UIView *bgView;

@property(nonatomic, assign) NTESGameStatus gameStatus;

@property(nonatomic, strong) UILabel *gamerLabel;

@property(nonatomic, strong) NTESTryResultView *resultView;

@property(nonatomic, strong) CADisplayLink *countDownTimer;

@end

@implementation NTESDragroomViewController

- (instancetype)initWithDragroom:(NTESDragroom *)room {
    if (self = [super init]) {
        _pullURL1 = room.rtmpPullUrl1;
        _pullURL2 = room.rtmpPullUrl2;
        _room = room;
        _gameStatus = NTESGameStatusWatch;
    }
    return self;
}


- (void)dealloc
{
    if (self.gameStatus == NTESGameStatusTryWithCam2 || self.gameStatus == NTESGameStatusTrywithCam1) {
        [[NTESService sharedService].controlService tryLuck:self.room.creator];
    }
    [self removeListener];
    [[NTESService sharedService].controlService leavePendingQueue:self.room.roomId completion:nil];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self setupNav];
    
    [self setupSubviews];
    
    [self addListener];
    
    #if TARGET_IPHONE_SIMULATOR
    #else
        [self setupPlayer];
    #endif
    
    [self enterChatroom];
    
    [self hideKeyboardGesture];
    
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
#if TARGET_IPHONE_SIMULATOR
#else
    [self playAudio];
#endif
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    
    [self.view endEditing:YES];
    [self releaseAudioPlayer];
    if (self.firstPlayer || self.secondPlayer) {
        [self.firstPlayer releasePlayer];
        [self.secondPlayer releasePlayer];
    }
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    NSString *queueStr = [NSString stringWithFormat:@"预约排队（%lu人）", (unsigned long)self.room.queueCount];
    NSAttributedString *attStr = [self getAttributedStr:queueStr withFontSize:16.];
    [self.bottomBar.queueBtn setAttributedTitle:attStr forState:UIControlStateNormal];
}

- (void)hideKeyboardGesture {
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(hideKeyboard)];
    [self.view addGestureRecognizer:tap];
}

- (void)hideKeyboard {
    [self.textInputView myResignFirstResponder];
}

- (void)enterChatroom
{
    NIMChatroomEnterRequest *request = [[NIMChatroomEnterRequest alloc] init];
    request.roomId = _room.roomId;
    WEAK_SELF(weakSelf);
    [[NIMSDK sharedSDK].chatroomManager enterChatroom:request completion:^(NSError * _Nullable error, NIMChatroom * _Nullable chatroom, NIMChatroomMember * _Nullable me) {
        if (!error)
        {
            NSString *leftBtnTitle = [NSString stringWithFormat:@"房间1-观众%li人", (long)chatroom.onlineUserCount];
            [weakSelf.leftBtn setTitle:leftBtnTitle forState:UIControlStateNormal];
            if (weakSelf.room.queueCount == 0) {
                weakSelf.gamerLabel.text = @"空闲中";
            }
        }
    }];
}

#pragma mark - NTESInfoManagerDelegate
- (void)onPendingUsersChanged:(NSArray *)pendingUsers roomId:(NSString *)roomId
{
    DDLogInfo(@"pending users changed %@",pendingUsers);
    BOOL flag = NO;
    NSString *queueStr = nil;
    if (pendingUsers.count > 0) {
        if (self.bottomBar.queueBtnState != NTESQueueBtnStateWaitForTry) {
            for (int i = 0; i < pendingUsers.count; ++i) {
                NTESUser *user = pendingUsers[i];
                if ([user.userId isEqualToString:[NIMSDK sharedSDK].loginManager.currentAccount]) flag = YES;
            }
            if (flag == NO) {
                //若当前排队中没有玩家本人，且可能移除队列操作未正常进行，需要这里判断
                [self.bottomBar refreshQueueState:NTESQueueBtnStateWaitForQueue];
                [self refreshQueueNumer];
            }
        }
        if (self.bottomBar.queueBtnState == NTESQueueBtnStateWaitForQueue) {
            queueStr = [NSString stringWithFormat:@"预约排队（%lu人）", (unsigned long)pendingUsers.count];
            NSAttributedString *attStr = [self getAttributedStr:queueStr withFontSize:16.];
            [self.bottomBar.queueBtn setAttributedTitle:attStr forState:UIControlStateNormal];
        }
        if (self.bottomBar.queueBtnState == NTESQueueBtnStateQueuing) {
            NSInteger myIndex = [self getMyQueueIndex:pendingUsers];
            
            queueStr = [NSString stringWithFormat:@"排队中（前面%lu人）", (unsigned long)myIndex];
            NSAttributedString *attStr = [self getAttributedStr:queueStr withFontSize:16];
            [self.bottomBar.queueBtn setAttributedTitle:attStr forState:UIControlStateNormal];

        }
        
        NTESUser *user = pendingUsers.firstObject;
        self.gamerLabel.text = [NSString stringWithFormat:@"游戏中：%@", user.nick];
        if (![user.userId isEqualToString:[NIMSDK sharedSDK].loginManager.currentAccount]) {
            self.gameStatus = NTESGameStatusWatch;
            [self.bottomBar switchUI:YES];
            self.chatView.hidden = NO;
        }
    }
    else {
        self.gamerLabel.text = [NSString stringWithFormat:@"空闲中"];
        self.gameStatus = NTESGameStatusWatch;
        [self.bottomBar switchUI:YES];
        self.chatView.hidden = NO;
        queueStr = [NSString stringWithFormat:@"预约排队（0人）"];
        NSAttributedString *attStr = [self getAttributedStr:queueStr withFontSize:16.];
        [self.bottomBar.queueBtn setAttributedTitle:attStr forState:UIControlStateNormal];
    }
}

- (void)onReceiveTryLuckResult:(BOOL)success creatorId:(NSString *)creatorId {
        NTESTryResult result = success ? NTESTryResultLuck : NTESTryResultMiss;
    [self.resultView setupTryState:result];
    if ([self.navigationController.viewControllers.lastObject isKindOfClass:[NTESDragroomViewController class]]) {
        self.resultView.hidden = NO;
    }
}

- (NSInteger)getMyQueueIndex:(NSArray *)pendingUsers {
    NSInteger index = 0;
    for (NTESUser *user in pendingUsers) {
        if ([user.userId isEqualToString:[NIMSDK sharedSDK].loginManager.currentAccount]) break;
        index++;
    }
    return index;
}

#pragma mark - NTESTryViewDelegate

- (void)resultViewEndGameClicked:(NTESTryResultView *)view {
    self.resultView.hidden = YES;
    [self.bottomBar refreshQueueState:NTESQueueBtnStateWaitForQueue];
    [self refreshQueueNumer];
}

- (void)resultViewQueueClicked:(NTESTryResultView *)view {
    self.resultView.hidden = YES;
    [self addQueue];
}

#pragma mark - NIMNetCallManagerDelegate

- (void)onReceive:(UInt64)callID
             from:(NSString *)caller
             type:(NIMNetCallMediaType)type
          message:(nullable NSString *)extendMessage
{
    _callID = callID;
    //加倒计时 10 S
    [self.bottomBar refreshQueueState:NTESQueueBtnStateWaitForTry];
}

- (void)stopGameAction:(NSNotification *)noti {
    //10s结束并未点击进入游戏
    WEAK_SELF(weakSelf);
    [[NIMAVChatSDK sharedSDK].netCallManager response:_callID accept:NO option:nil completion:^(NSError * _Nullable error, UInt64 callID) {
        DDLogInfo(@"join result %@, %zd",error,callID);
        [weakSelf.bottomBar refreshQueueState:NTESQueueBtnStateWaitForQueue];
        [weakSelf refreshQueueNumer];
    }];
}

#pragma mark - enter game

- (void)startGame {
    //10S 内进入游戏
    NIMNetCallOption *option = [[NIMNetCallOption alloc] init];
    option.autoDeactivateAudioSession = NO;
    
    
    WEAK_SELF(weakSelf);
    [SVProgressHUD show];
    [[NIMAVChatSDK sharedSDK].netCallManager response:_callID accept:YES option:option completion:^(NSError * _Nullable error, UInt64 callID) {
        DDLogInfo(@"join result %@, %zd",error,callID);
        [SVProgressHUD dismiss];

        if (!error) {
            weakSelf.gameStatus = NTESGameStatusTrywithCam1;
            weakSelf.chatView.hidden = YES;
            [weakSelf.bottomBar switchUI:NO];
            [weakSelf.bottomBar refreshQueueState:NTESQueueBtnStateWaitForQueue];
            NTESUser *me = [NTESUser new];
            NSString *userId = [NIMSDK sharedSDK].loginManager.currentAccount;
            me = [[NTESInfoManager sharedManager] userById:userId];
            weakSelf.gamerLabel.text = [NSString stringWithFormat:@"游戏中：%@", me.nick];
        }
        else {
            NSString *toast = [NSString stringWithFormat:@"进入游戏失败 error : %ld", error.code];
            [weakSelf.view makeToast:toast duration:2.f position:CSToastPositionCenter];
            [weakSelf refreshQueueNumer];
            [weakSelf.bottomBar refreshQueueState:NTESQueueBtnStateWaitForQueue];
        }
    }];
}

- (void)setupNav {
    //left
    UIBarButtonItem *leftBtn = [[UIBarButtonItem alloc] initWithCustomView:self.leftBtn];
    //right
    UIBarButtonItem *voiceBtn = [[UIBarButtonItem alloc] initWithCustomView:self.voiceBtn];
    UIBarButtonItem *cameraBtn = [[UIBarButtonItem alloc] initWithCustomView:self.cameraBtn];
    
    [self.navigationItem setRightBarButtonItems:[NSArray arrayWithObjects: voiceBtn, cameraBtn, nil]];
    [self.navigationItem setLeftBarButtonItems:[NSArray arrayWithObjects:leftBtn, nil]];
    
}

- (void)setupSubviews {
    self.view.backgroundColor = UIColorFromRGB(0x00CDBC);
    [self.view addSubview:self.bottomBar];
    [self.view addSubview:self.bgView];
    [self.view addSubview:self.canvas];
    [self.view addSubview:self.gamerLabel];
    [self.view addSubview:self.chatView];
    [self.view addSubview:self.textInputView];
    [self.navigationController.view addSubview:self.resultView];
}

- (void)setupPlayer {
    self.firstPlayer = [[NTESLivePlayerViewController alloc] init];
    self.secondPlayer = [[NTESLivePlayerViewController alloc] init];
    [self addChildViewController:self.secondPlayer];
    [self addChildViewController:self.firstPlayer];

    [self.canvas addPlayerView:self.firstPlayer.view];
    [self.canvas addPlayerView:self.secondPlayer.view];
    [self.firstPlayer playWithURL:self.room.rtmpPullUrl1];
    [self.secondPlayer playWithURL:self.room.rtmpPullUrl2];
}

#pragma mark - Audio Player

- (void)playAudio {
    
    NSString *audioPath = [[NSBundle mainBundle] pathForResource:@"sound" ofType:@"mp3"];
    NSURL *audioURL = [NSURL fileURLWithPath:audioPath];
    NSError *error = nil;
    self.audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:audioURL error:&error];
    if (!error) {
        self.audioPlayer.numberOfLoops = -1;
        [self.audioPlayer play];
    }
    else {
        DDLogError(@"audio init fail");
    }
}

- (void)releaseAudioPlayer {
    if (self.audioPlayer) {
        [self.audioPlayer stop];
        self.audioPlayer = nil;
    }
}

#pragma mark - actions

- (void)leftBtnAction:(UIButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)voiceBtnAction:(UIButton *)sender {
    if (self.audioPlayer) {
        if ([self.audioPlayer isPlaying]) {
            [self.voiceBtn setBackgroundImage:[UIImage imageNamed:@"room_nav_voice_stop"] forState:UIControlStateNormal];
            [self.voiceBtn setBackgroundImage:[UIImage imageNamed:@"room_nav_voice_stop_pressed"] forState:UIControlStateSelected];
            [self.audioPlayer stop];
        }else {
            [self.voiceBtn setBackgroundImage:[UIImage imageNamed:@"room_nav_voice_open"] forState:UIControlStateNormal];
            [self.voiceBtn setBackgroundImage:[UIImage imageNamed:@"room_nav_voice_open_pressed"] forState:UIControlStateSelected];
            [self.audioPlayer play];
        }
    }
    else {
        [self playAudio];
    }
}

- (void)switchCameraBtn:(UIButton *)sender {
    switch (self.gameStatus) {
        case NTESGameStatusWatch:
        {
            [self.canvas switchPlayerView];
        }
            break;
        case NTESGameStatusTrywithCam1:
        {
           [[NTESService sharedService].controlService changeCamera:NTESCameraNumber2 clawId:self.room.creator];
            self.gameStatus = NTESGameStatusTryWithCam2;
        }
            break;
        case NTESGameStatusTryWithCam2:
        {
            [[NTESService sharedService].controlService changeCamera:NTESCameraNumber1 clawId:self.room.creator];
            self.gameStatus = NTESGameStatusTrywithCam1;
        }
            break;
        default:
            break;
    }
}

#pragma mark - NTESTextInputDelegate

- (void)inputView:(NTESTextInputView *)inputView didSendText:(NSString *)text {
    if (text.length == 0) {
        [self.view makeToast:@"不能发送空消息哦" duration:2. position:CSToastPositionCenter];
        return ;
    }
    else {
        NIMMessage *message = [[NIMMessage alloc] init];
        message.text        = text;
        NIMSession *session = [NIMSession session:self.room.roomId type:NIMSessionTypeChatroom];
        [[NIMSDK sharedSDK].chatManager sendMessage:message toSession:session error:nil];
    }
}

- (void)inputView:(NTESTextInputView *)inputView didChangeHeight:(CGFloat)height {
    if (height != self.textInputView.height)
    {
        CGFloat y = self.textInputView.bottom;
        CGFloat width = self.textInputView.width;
        WEAK_SELF(weakSelf);
        [UIView animateWithDuration:0.1 animations:^{
            weakSelf.textInputView.frame = CGRectMake(0, y - height, width, height);
        }];
    }
}

#pragma mark - NTESBottomBarDelegate

- (void)bottomBarClickChat:(NTESBottomBar *)bar {
    [self.textInputView myFirstResponder];
}

- (void)bottomBarClickQueue:(NTESBottomBar *)bar {
    if (self.bottomBar.queueBtnState == NTESQueueBtnStateWaitForQueue) {
        [self addQueue];
    }
    if (self.bottomBar.queueBtnState == NTESQueueBtnStateWaitForTry) {
        [self startGame];
    }
}

- (void)bottomBarClickQueueCancel:(NTESBottomBar *)bar {
    if (self.bottomBar.queueBtnState == NTESQueueBtnStateWaitForTry) {
        [self stopGameAction:nil];
    }
    else {
        [self removeQueue];
    }
}

- (void)bottomBarTryAction:(NTESBottomBar *)bar {
    [[NTESService sharedService].controlService tryLuck:self.room.creator];
    self.gameStatus = NTESGameStatusWatch;
}

- (void)bottomBar:(NTESBottomBar *)bar direction:(NTESDragDirection)direction {
    if (self.gameStatus == NTESGameStatusTrywithCam1) {
        switch (direction) {
            case NTESDragDirectionTop:
            {
                [[NTESService sharedService].controlService clawDirection:NTESControlDirectionUp clawId:self.room.creator];
            }
                break;
            case NTESDragDirectionLeft:
            {
                [[NTESService sharedService].controlService clawDirection:NTESControlDirectionLeft clawId:self.room.creator];
            }
                break;
            case NTESDragDirectionDown:
            {
                [[NTESService sharedService].controlService clawDirection:NTESControlDirectionDown clawId:self.room.creator];
            }
                break;
            case NTESDragDirectionRight:
            {
                [[NTESService sharedService].controlService clawDirection:NTESControlDirectionRight clawId:self.room.creator];
            }
                break;
            default:
                break;
        }
    }
    if (self.gameStatus == NTESGameStatusTryWithCam2) {
        switch (direction) {
            case NTESDragDirectionTop:
            {
                [[NTESService sharedService].controlService clawDirection:NTESControlDirectionLeft clawId:self.room.creator];
            }
                break;
            case NTESDragDirectionLeft:
            {
                [[NTESService sharedService].controlService clawDirection:NTESControlDirectionDown clawId:self.room.creator];
            }
                break;
            case NTESDragDirectionDown:
            {
                [[NTESService sharedService].controlService clawDirection:NTESControlDirectionRight clawId:self.room.creator];
            }
                break;
            case NTESDragDirectionRight:
            {
                [[NTESService sharedService].controlService clawDirection:NTESControlDirectionUp clawId:self.room.creator];
            }
                break;
            default:
                break;
        }
    }
    
}

#pragma mark - NIMChatManagerDelegate

- (void)willSendMessage:(NIMMessage *)message
{
    switch (message.messageType)
    {
        case NIMMessageTypeText: //普通消息
        {
            NTESUser *me = [NTESUser new];
            NSString *userId = [NIMSDK sharedSDK].loginManager.currentAccount;
            me = [[NTESInfoManager sharedManager] userById:userId];
            NTESTextMessage *msg = [NTESTextMessage textMessage:message.text sender:me];
            [self.chatView addNormalMessages:@[msg]];
            break;
        }
        default:
            break;
    }
}

- (void)onRecvMessages:(NSArray *)messages
{
    for (NIMMessage *message in messages)
    {
        if (![message.session.sessionId isEqualToString:self.room.roomId]
            && message.session.sessionType == NIMSessionTypeChatroom)
        {
            return; //不属于这个聊天室的消息
        }
        switch (message.messageType)
        {
            case NIMMessageTypeText: //普通消息
            {
                [self doReceiveTextMessage:message];
                break;
            }
            default:
                break;
        }
    }
}

- (void)doReceiveTextMessage:(NIMMessage *)message {
    NIMMessageChatroomExtension *ext = message.messageExt;
    NSString *nick = ext.roomNickname;
    NTESUser *user = [NTESUser new];
    user.nick = nick;
    user.userId = message.from;
    NTESTextMessage *msg = [NTESTextMessage textMessage:message.text sender:user];
    [self.chatView addNormalMessages:@[msg]];
}

#pragma mark - Listener

- (void)addListener
{
    [[NIMAVChatSDK sharedSDK].netCallManager addDelegate:self];
    [[NIMSDK sharedSDK].chatManager addDelegate:self];
    [NTESInfoManager sharedManager].delegate = self;
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillChange:) name:UIKeyboardWillChangeFrameNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(stopGameAction:) name:NTESStopGameNotification object:nil];
}

- (void)removeListener
{
    [[NIMAVChatSDK sharedSDK].netCallManager removeDelegate:self];
    [[NIMSDK sharedSDK].chatManager removeDelegate:self];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)keyboardWillChange:(NSNotification *)notification {
    NSDictionary *userInfo = notification.userInfo;
    CGFloat textAdjustDistance = 0.0;
    CGFloat chatAdjustDistance = 0.0;
    CGRect endFrame   = [userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
    BOOL visible = endFrame.origin.y != [UIApplication sharedApplication].keyWindow.frame.size.height;
    
    if (visible)
    {
        textAdjustDistance = endFrame.size.height;
        chatAdjustDistance = textAdjustDistance + self.textInputView.height - 60 * UISreenWidthScale;
    
        WEAK_SELF(weakSelf);
        [UIView animateWithDuration:0.2 animations:^{
            weakSelf.textInputView.hidden = NO;
            weakSelf.textInputView.frame = CGRectMake(0, weakSelf.view.height - textAdjustDistance - 36, UIScreenWidth, 36);
            weakSelf.chatView.frame = CGRectMake(0, weakSelf.bgView.bottom + 10 - chatAdjustDistance , UIScreenWidth, chatViewHeight);
            [weakSelf.view layoutIfNeeded];
        }];
    }
    else {
        WEAK_SELF(weakSelf);
        [UIView animateWithDuration:0.2 animations:^{
            weakSelf.textInputView.hidden = YES;
            weakSelf.chatView.frame = CGRectMake(0, weakSelf.bgView.bottom + 10, UIScreenWidth, chatViewHeight);
        }];
    }
}

#pragma mark - Queue

- (void)addQueue {
    WEAK_SELF(weakSelf);
    [[NTESService sharedService].controlService joinPendingQueue:_room.roomId completion:^(NSError *error) {
        if (!error) {
            DDLogInfo(@"加入队列成功");
            [weakSelf.bottomBar refreshQueueState:NTESQueueBtnStateQueuing];
        }
    }];
}

- (void)removeQueue {
    WEAK_SELF(weakSelf);
    [[NTESService sharedService].controlService leavePendingQueue:self.room.roomId completion:^(NSError *error) {
        if (!error || error.code == NIMRemoteErrorCodeNotExist) {
            DDLogInfo(@"移除队列成功");
            //恢复初始 UI
            [weakSelf.bottomBar refreshQueueState:NTESQueueBtnStateWaitForQueue];
        }
    }];
}

- (void)refreshQueueNumer {
    [[NTESInfoManager sharedManager] fetchPendingUsers:self.room.roomId completion:^(NSArray<NTESUser *> *users) {
        NSString *queueStr = [NSString stringWithFormat:@"预约排队（%lu人）", (unsigned long)users.count];
        NSAttributedString *attStr = [self getAttributedStr:queueStr withFontSize:16.f];
        [self.bottomBar.queueBtn setAttributedTitle:attStr forState:UIControlStateNormal];
    }];
}

#pragma mark - Getter

- (UIButton *)leftBtn {
    if (!_leftBtn) {
        _leftBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _leftBtn.frame = CGRectMake(0, 0, 140, 30);
        _leftBtn.titleLabel.font = [UIFont systemFontOfSize:17.f];
        [_leftBtn setImage:[UIImage imageNamed:@"room_nav_back"] forState:UIControlStateNormal];
        [_leftBtn setImage:[UIImage imageNamed:@"room_nav_back_pressed"] forState:UIControlStateSelected];
        _leftBtn.imageEdgeInsets = UIEdgeInsetsMake(0, -10, 0, 0);
        NSString *leftBtnTitle = [NSString stringWithFormat:@"房间1-观众%li人", (long)self.room.onlineUserCount];
        [self.leftBtn setTitle:leftBtnTitle forState:UIControlStateNormal];
        [_leftBtn addTarget:self action:@selector(leftBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _leftBtn;
}

- (UIButton *)voiceBtn {
    if (!_voiceBtn) {
        _voiceBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _voiceBtn.frame = CGRectMake(0, 0, 35, 30);

        [_voiceBtn addTarget:self action:@selector(voiceBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [_voiceBtn setBackgroundImage:[UIImage imageNamed:@"room_nav_voice_open"] forState:UIControlStateNormal];
        [_voiceBtn setBackgroundImage:[UIImage imageNamed:@"room_nav_voice_open_pressed"] forState:UIControlStateSelected];
    }
    return _voiceBtn;
}

- (UIButton *)cameraBtn {
    if (!_cameraBtn) {
        _cameraBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _cameraBtn.frame = CGRectMake(0, 0, 35, 30);
        [_cameraBtn addTarget:self action:@selector(switchCameraBtn:) forControlEvents:UIControlEventTouchUpInside];
        [_cameraBtn setBackgroundImage:[UIImage imageNamed:@"room_nav_camera"] forState:UIControlStateNormal];
        [_cameraBtn setBackgroundImage:[UIImage imageNamed:@"room_nav_camera_pressed"] forState:UIControlStateSelected];
    }
    return _cameraBtn;
}

- (NTESBottomBar *)bottomBar {
    if (!_bottomBar) {
        _bottomBar = [[NTESBottomBar alloc] initWithFrame:CGRectMake(0, kTopHeight + UIScreenWidth, UIScreenWidth, UIScreenHeight - kTopHeight - UIScreenWidth - 5)];
        _bottomBar.delegate = self;
    }
    return _bottomBar;
}

- (NTESTextInputView *)textInputView {
    if (!_textInputView) {
        _textInputView = [[NTESTextInputView alloc] initWithFrame:CGRectMake(0, UIScreenHeight - 36, UIScreenWidth, 36)];
        _textInputView.hidden = YES;
        _textInputView.delegate = self;
    }
    return _textInputView;
}

- (NTESChatView *)chatView {
    if (!_chatView) {
        _chatView = [[NTESChatView alloc] initWithFrame:CGRectMake(0, self.bgView.bottom + 10, UIScreenWidth, chatViewHeight)];
    }
    return _chatView;
}

- (UIView *)bgView {
    if (!_bgView) {
        _bgView = [[UIView alloc] initWithFrame:CGRectMake(10, kTopHeight, UIScreenWidth - 20, UIScreenWidth - 5)];
        _bgView.contentMode = UIViewContentModeScaleAspectFill;
        _bgView.clipsToBounds = YES;
        _bgView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        _bgView.backgroundColor = [UIColor blackColor];
        _bgView.layer.cornerRadius = 15;
        _bgView.alpha = 0.4;
    }
    return _bgView;
}

- (UILabel *)gamerLabel {
    if (!_gamerLabel) {
        _gamerLabel = [[UILabel alloc] initWithFrame:CGRectMake(self.canvas.left + 5, 5 + kTopHeight, 110 * UISreenWidthScale, 30 * UISreenWidthScale)];
        _gamerLabel.layer.borderWidth = 1;
        _gamerLabel.layer.borderColor = UIColorFromRGB(0x00cdbc).CGColor;
        _gamerLabel.layer.cornerRadius = 15;
        _gamerLabel.font = [UIFont systemFontOfSize:12.];
        _gamerLabel.textColor = [UIColor blackColor];
        _gamerLabel.backgroundColor = [UIColor whiteColor];
        _gamerLabel.adjustsFontSizeToFitWidth = YES;
        _gamerLabel.text = @"空闲中";
        _gamerLabel.clipsToBounds = YES;
        _gamerLabel.textAlignment = NSTextAlignmentCenter;
    }
    return _gamerLabel;
}

- (NTESCanvas *)canvas {
    if (!_canvas) {
        _canvas = [[NTESCanvas alloc] initWithFrame:CGRectMake(7, kTopHeight, UIScreenWidth - 14 , UIScreenWidth - 20)];
        _canvas.layer.cornerRadius = 15;
        _canvas.clipsToBounds = YES;
    }
    return _canvas;
}

- (NTESTryResultView *)resultView {
    if (!_resultView) {
        _resultView = [[NTESTryResultView alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
        _resultView.hidden = YES;
        _resultView.delegate = self;
    }
    return _resultView;
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
