//
//  NTESNormalMsgView.m
//  NEUIDemo
//
//  Created by Netease on 17/1/3.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESNormalMsgView.h"
#import "NTESTextMessage.h"
#import "NTESNormalMessageCell.h"

@interface NTESNormalMsgView ()<UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, strong) UITableView *tableView;

@property (nonatomic, strong) NSMutableArray<NTESTextMessage *> *messages;

@property (nonatomic, strong) NSMutableArray *pendingMessages; //缓存的插入消息,聊天室需要在另外个线程计算高度,减少UI刷新

@end

@implementation NTESNormalMsgView

- (void)dealloc
{
    NSLog(@"聊天视图释放");
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame])
    {
        _messages = [[NSMutableArray alloc] init];
        _pendingMessages = [[NSMutableArray alloc] init];
        [self addSubview:self.tableView];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder
{
    if (self = [super initWithCoder:aDecoder]) {
        _messages = [[NSMutableArray alloc] init];
        _pendingMessages = [[NSMutableArray alloc] init];
        [self addSubview:self.tableView];
    }
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    if (!CGRectEqualToRect(self.tableView.frame, self.bounds)) {
        self.tableView.frame = self.bounds;
        self.tableView.contentInset = UIEdgeInsetsMake(0, 0, 0, 0);
    }
}

- (void)addMessages:(NSArray<NTESTextMessage *> *)messages
{
    if (messages.count) {
        [self caculateHeight:messages];
    }
}

#pragma mark -- Private
- (void)caculateHeight:(NSArray <NTESTextMessage *> *)messages
{
    dispatch_async(NTESMsgDataPrepareQueue(), ^{
        //后台线程处理宽度计算，处理完之后同步抛到主线程插入
        BOOL noPendingMessage = self.pendingMessages.count == 0;
        [self.pendingMessages addObjectsFromArray:messages];
        if (noPendingMessage)
        {
            [self processPendingMessages];
        }
    });
}

- (void)processPendingMessages
{
    __weak typeof(self) weakSelf = self;
    NSUInteger pendingMessageCount = self.pendingMessages.count;
    if (!weakSelf || pendingMessageCount== 0) {
        return;
    }
    
    if (weakSelf.tableView.isDecelerating || weakSelf.tableView.isDragging)
    {
        //滑动的时候为保证流畅，暂停插入
        NSTimeInterval delay = 1;
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC)), NTESMsgDataPrepareQueue(), ^{
            [weakSelf processPendingMessages];
        });
        return;
    }
    
    //获取一定量的消息计算高度，并扔回到主线程
    static NSInteger NTESMaxInsert = 2;
    NSArray *insert = nil;
    NSRange range;
    if (pendingMessageCount > NTESMaxInsert)
    {
        range = NSMakeRange(0, NTESMaxInsert);
    }
    else
    {
        range = NSMakeRange(0, pendingMessageCount);
    }
    insert = [self.pendingMessages subarrayWithRange:range];
    [self.pendingMessages removeObjectsInRange:range];
    
    for (NTESTextMessage *model in insert)
    {
        [model caculate:self.width];
    }
    
    NSUInteger leftPendingMessageCount = self.pendingMessages.count;
    dispatch_sync(dispatch_get_main_queue(), ^{
        [weakSelf addModels:insert];
    });
    
    if (leftPendingMessageCount)
    {
        NSTimeInterval delay = 0.1;
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC)), NTESMsgDataPrepareQueue(), ^{
            [weakSelf processPendingMessages];
        });
    }
}

- (void)addModels:(NSArray<NTESTextMessage *> *)models
{
    NSInteger count = self.messages.count;
    [self.messages addObjectsFromArray:models];
    
    NSMutableArray *insert = [[NSMutableArray alloc] init];
    for (NSInteger index = count; index < count+models.count; index++) {
        NSIndexPath *indexPath = [NSIndexPath indexPathForRow:index inSection:0];
        [insert addObject:indexPath];
    }
    [self.tableView beginUpdates];
    [self.tableView insertRowsAtIndexPaths:insert withRowAnimation:UITableViewRowAnimationFade];
    [self.tableView endUpdates];
    
    [self.tableView layoutIfNeeded];
    
    [self changeInsets:models];
}

- (void)changeInsets:(NSArray<NTESTextMessage *> *)newModels
{
    CGFloat height = 0;
    CGFloat offsetY = self.tableView.contentInset.top;
    for (NTESTextMessage *model in newModels) {
        height += model.height;
    }
    
    if ((offsetY -= height) >= 0)
    {
        [UIView animateWithDuration:0.2 animations:^{
            self.tableView.contentInset = UIEdgeInsetsMake(offsetY, 0, 0, 0);
        } completion:^(BOOL finished) {
            [self scrollToBottom];
        }];
    }
    else
    {
        if (self.tableView.contentInset.top != 0) {
            [UIView animateWithDuration:0.2 animations:^{
                self.tableView.contentInset = UIEdgeInsetsMake(0, 0, 0, 0);
            }];
        }

        [self scrollToBottom];
    }
}

- (void)scrollToBottom
{
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        CGFloat offset = self.tableView.contentSize.height - self.tableView.height;
        [self.tableView scrollRectToVisible:CGRectMake(0, offset, self.tableView.width, self.tableView.height) animated:YES];
    });
}

#pragma mark -- Get
- (UITableView *)tableView
{
    if (!_tableView) {
        _tableView = [[UITableView alloc] initWithFrame:self.bounds style:UITableViewStylePlain];
        _tableView.delegate = self;
        _tableView.showsVerticalScrollIndicator = NO;
        _tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _tableView.dataSource = self;
        _tableView.backgroundColor = [UIColor clearColor];
        _tableView.backgroundView = nil;
        _tableView.backgroundView = [[UIView alloc] init];
        _tableView.backgroundView.backgroundColor = [UIColor clearColor];
        [_tableView registerClass:[NTESNormalMessageCell class] forCellReuseIdentifier:@"chat"];
    }
    return _tableView;
}

#pragma mark -- <UITableViewDelegate, UITableViewDataSource>
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.messages.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NTESNormalMessageCell *cell = [tableView dequeueReusableCellWithIdentifier:@"chat"];
    NTESTextMessage *model = self.messages[indexPath.row];
    [cell refresh:model];
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NTESTextMessage *model = self.messages[indexPath.row];
    return model.height;
}

static const void * const NTESDispatchMessageDataPrepareSpecificKey = &NTESDispatchMessageDataPrepareSpecificKey;
dispatch_queue_t NTESMsgDataPrepareQueue()
{
    static dispatch_queue_t queue;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        queue = dispatch_queue_create("nim.dragclaw.demo.message.queue", 0);
        dispatch_queue_set_specific(queue, NTESDispatchMessageDataPrepareSpecificKey, (void *)NTESDispatchMessageDataPrepareSpecificKey, NULL);
    });
    return queue;
}

@end
