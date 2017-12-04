//
//  NTESTextMessage.h
//  NEUIDemo
//
//  Created by Netease on 17/1/3.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NTESUser.h"

typedef NS_ENUM(NSInteger,NTESMessageType)
{
    NTESMessageTypeChat,          //对话信息
    NTESMessageTypeNotification,  //系统通知
};

@interface NTESTextMessage : NSObject

//数据模型
@property (nonatomic, assign) NTESMessageType type;
@property (nonatomic, copy) NSString *userId;
@property (nonatomic, copy) NSString *showName;
@property (nonatomic, copy) NSString *message;
@property (nonatomic, readonly, copy) NSMutableAttributedString *formatString;


//样式模型
@property (nonatomic, assign) CGFloat height;

- (void)caculate:(CGFloat)width;

+ (NTESTextMessage *)textMessage:(NSString *)message sender:(NTESUser *)sender;

@end
