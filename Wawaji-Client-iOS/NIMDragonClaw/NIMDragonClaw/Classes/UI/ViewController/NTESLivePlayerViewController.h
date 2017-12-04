//
//  NTESLivePlayerViewController.h
//  NIMDragonClaw
//
//  Created by emily on 2017/11/17.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "NELivePlayerController.h"
#import "NELivePlayer.h"

@interface NTESLivePlayerViewController : UIViewController

- (void)playWithURL:(NSString *)streamUrl;

- (void)releasePlayer;

@end
