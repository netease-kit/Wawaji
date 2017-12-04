//
//  NTESTryResultView.h
//  NIMDragonClaw
//
//  Created by emily on 2017/11/27.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, NTESTryResult) {
    NTESTryResultMiss = 0,
    NTESTryResultLuck,
};

@protocol NTESTryResultViewDelegate;

@interface NTESTryResultView : UIView

@property(nonatomic, weak) id<NTESTryResultViewDelegate> delegate;

- (void)setupTryState:(NTESTryResult)result;

@end


@protocol NTESTryResultViewDelegate <NSObject>

- (void)resultViewEndGameClicked:(NTESTryResultView *)view;

- (void)resultViewQueueClicked:(NTESTryResultView *)view;


@end
