//
//  NTESDragroomListViewController.m
//  NIMDragonClaw
//
//  Created by emily on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESDragroomListViewController.h"
#import "NTESDragroomListCellCollectionViewCell.h"
#import "NTESService.h"
#import "NTESDragroomViewController.h"
#import "NTESInfoManager.h"
#import "NTESAppDelegate.h"
#import "UIAlertView+NTESBlock.h"

static NSString *DragroomListReuseIdentity = @"dragroomListReuseIdentity";

@interface NTESDragroomListViewController () <UICollectionViewDelegate, UICollectionViewDataSource>

@property(nonatomic, strong) UIRefreshControl *refreshControl;

@property(nonatomic, strong) NSArray *roomList;

@end

@implementation NTESDragroomListViewController

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title = @"网易通信与视频";
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onNetworkStatusChanged:)
                                                 name:kRealReachabilityChangedNotification
                                               object:nil];
    
    [self doLogin];
    
    [self setupSubviews];
    
}

- (void)doLogin {
    WEAK_SELF(weakSelf);
    [[NTESService sharedService].loginService login:^(NSError *error) {
        if (error) {
            //登录失败，杀掉进程
            NSString *msg = [NSString stringWithFormat:@"登录失败 ： %zi，关闭应用", error.code];
            
            UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:msg message:nil delegate:self cancelButtonTitle:nil otherButtonTitles:@"确定", nil];
            
            WEAK_SELF(weakSelf);
            [alertView showAlertWithCompletionHandler:^(NSInteger index) {
                [weakSelf exitApp];
            }];
            
        }
        [weakSelf refresh];
    }];
}

- (void)exitApp {
    id<UIApplicationDelegate> app = [UIApplication sharedApplication].delegate;
    UIWindow *window = app.window;
    [UIView animateWithDuration:0.3 animations:^{
        window.alpha = 0;
        window.frame = CGRectMake(0, window.bounds.size.width, 0, 0);
        exit(0);
    }];
}

- (void)setupSubviews {
    self.view.backgroundColor = [UIColor whiteColor];
    [self.view addSubview:self.collectionView];
    [self.collectionView addSubview:self.refreshControl];
}

- (void)refresh {
    [self.refreshControl beginRefreshing];
    WEAK_SELF(weakSelf);
    //获取房间list
    [[NTESService sharedService].infoService fetchRoomsFromServer:^(NSError *error, NSArray<NTESDragroom *> *rooms) {
        if (!error) {
            weakSelf.roomList = rooms;
            [weakSelf.collectionView reloadData];
        }
        else {
            NSString *toast = [NSString stringWithFormat:@"请求房间失败 ： %zd", error.code];
            [weakSelf.view makeToast:toast duration:2 position:CSToastPositionCenter];
        }
        [weakSelf.refreshControl endRefreshing];
    }];
}

- (void)onPullRefresh {
    [self refresh];
}

- (void)onNetworkStatusChanged:(NSNotification *)noti {
    RealReachability *reachability = [RealReachability sharedInstance];
    ReachabilityStatus currentStatus = [reachability currentReachabilityStatus];
    ReachabilityStatus preStatus = [reachability previousReachabilityStatus];
    if (currentStatus == RealStatusViaWWAN || currentStatus == RealStatusViaWiFi ) {
        if (preStatus == RealStatusUnknown || preStatus == RealStatusNotReachable) {
            [self refresh];
        }
    }
}

#pragma mark - COllectionView Delegate

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    [collectionView deselectItemAtIndexPath:indexPath animated:NO];
    NTESDragroom *room = [self roomAtIndex:indexPath];
    if (room.roomStatus)
    {
        NTESDragroomViewController *vc = [[NTESDragroomViewController alloc] initWithDragroom:room];
        [self.navigationController pushViewController:vc animated:YES];        
    }
    else
    {
        DDLogInfo(@"room status invalid, can not enter");
    }
    
}

# pragma mark - CollectionView Datasource

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(nonnull NSIndexPath *)indexPath {
    NTESDragroomListCellCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:DragroomListReuseIdentity forIndexPath:indexPath];
    NTESDragroom *room = [self roomAtIndex:indexPath];
    [cell configCellWithRoom:room];
    //封面 在 demo 为写死的资源
    NSInteger index = indexPath.section * self.numberofItems + indexPath.row;
    NSString *image = [NSString stringWithFormat:@"bkg_room_cover_%zd",index];
    cell.bgImgView.image = [UIImage imageNamed:image];
    return cell;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    NSInteger remain = self.roomList.count - self.numberofItems * section;
    NSInteger numberOfItems = remain > self.numberofItems ? self.numberofItems : remain;
    return numberOfItems;
}

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    NSInteger sections = self.roomList.count / self.numberofItems;
    NSInteger numberOfSections = (self.roomList.count % self.numberofItems) ? sections + 1 : sections;
    return numberOfSections;
}


#pragma mark - Getter

- (NSInteger)numberofItems {
    return 2;
}

- (CGFloat)itemSpacing {
    return 10.f;
}

- (CGFloat)itemWidth {
    return (NSInteger)(self.view.width - (self.itemSpacing * (self.numberofItems + 1))) / self.numberofItems;
}

- (CGFloat)itemHeight {
    return self.itemWidth * 1.3;
}

- (UIRefreshControl *)refreshControl {
    if (!_refreshControl) {
        _refreshControl = [UIRefreshControl new];
        [_refreshControl addTarget:self action:@selector(onPullRefresh) forControlEvents:UIControlEventValueChanged];
    }
    return _refreshControl;
}

- (UICollectionView *)collectionView {
    if (!_collectionView) {
        UICollectionViewFlowLayout *layout = [UICollectionViewFlowLayout new];
        layout.minimumInteritemSpacing = self.itemSpacing;
        CGFloat padding = self.itemSpacing;
        layout.sectionInset = UIEdgeInsetsMake(padding * .5,padding,padding * .5,padding);
        layout.itemSize = CGSizeMake(self.itemWidth, self.itemHeight);
        _collectionView = [[UICollectionView alloc] initWithFrame:self.view.bounds collectionViewLayout:layout];
        _collectionView.backgroundColor  = [UIColor whiteColor];
        _collectionView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        _collectionView.contentInset = UIEdgeInsetsMake(padding * .5f, 0, padding * .5f, 0);
        _collectionView.alwaysBounceVertical = YES;
        [_collectionView registerClass:[NTESDragroomListCellCollectionViewCell class] forCellWithReuseIdentifier:DragroomListReuseIdentity];
        _collectionView.delegate   = self;
        _collectionView.dataSource = self;
    }
    return _collectionView;
}

- (NTESDragroom *)roomAtIndex:(NSIndexPath *)indexPath {
    NSInteger index = indexPath.section * self.numberofItems + indexPath.row;
    return [self.roomList objectAtIndex:index];
}

@end
