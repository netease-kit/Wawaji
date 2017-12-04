//
//  NTESAppDelegate.m
//  NIMDragonClaw
//
//  Created by chris on 2017/11/17.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESAppDelegate.h"
#import "NTESDragroomListViewController.h"

@interface NTESAppDelegate ()

@end

@implementation NTESAppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{    
    [self setupNIMSDK];
    [self setupMainVC];
    [self setupAppearance];
    [self setupLogger];
    return YES;
}



- (void)setupNIMSDK
{
    NSString *appkey = NTES_APP_KEY;
    [[NIMSDK sharedSDK] registerWithAppID:appkey cerName:nil];
}

- (void)setupMainVC
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    NTESDragroomListViewController *vc = [NTESDragroomListViewController new];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:vc];
    self.window.rootViewController = nav;
    [self.window makeKeyAndVisible];
}

- (void)setupAppearance
{
    [[UINavigationBar appearance] setBarTintColor:UIColorFromRGB(0x00CDBC)];
    [[UINavigationBar appearance] setTitleTextAttributes:@{NSForegroundColorAttributeName:[UIColor whiteColor]}];
}

- (void)setupLogger
{
    [DDLog addLogger:[DDTTYLogger sharedInstance]];
    [[DDTTYLogger sharedInstance] setColorsEnabled:YES];
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor greenColor] backgroundColor:nil forFlag:DDLogFlagDebug];
    
    DDFileLogger *fileLogger = [[DDFileLogger alloc] init];
    fileLogger.rollingFrequency = 60 * 60 * 24; // 24 hour rolling
    fileLogger.logFileManager.maximumNumberOfLogFiles = 7;
    [DDLog addLogger:fileLogger];
}

@end
