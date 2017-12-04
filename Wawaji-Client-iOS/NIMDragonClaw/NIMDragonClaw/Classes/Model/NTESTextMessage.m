//
//  NTESTextMessage.m
//  NEUIDemo
//
//  Created by Netease on 17/1/3.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESTextMessage.h"
#import <CoreText/CoreText.h>

@interface NTESTextMessage ()

@property (nonatomic, copy) NSString *showMessage;
@property (nonatomic, assign) NSRange fromRange;
@property (nonatomic, assign) NSRange messageRange;

@end

@implementation NTESTextMessage

+ (NTESTextMessage *)textMessage:(NSString *)message sender:(NTESUser *)sender
{
    NTESTextMessage *msg = [[NTESTextMessage alloc] init];
    msg.type = NTESMessageTypeChat;
    msg.showName = sender.nick;
    msg.userId = sender.userId;
    msg.message = message;
    msg.fromRange = NSMakeRange(0, msg.showName.length);
    msg.messageRange = NSMakeRange(msg.showMessage.length - msg.message.length, msg.message.length);
    return msg;
}


- (void)caculate:(CGFloat)width
{
    CGSize textSize = [self.formatString boundingRectWithSize:CGSizeMake(width, MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin context:nil].size;
    self.height = textSize.height + 10;
}

- (NSMutableAttributedString *)formatString
{
    NSMutableAttributedString *formatString = [[NSMutableAttributedString alloc] initWithString:self.showMessage];

    switch (_type)
    {
        case NTESMessageTypeChat:
        {
            [formatString addAttribute:(NSString *)kCTForegroundColorAttributeName value:(id)[UIColor whiteColor].CGColor range:self.fromRange];
            [formatString addAttribute:(NSString *)kCTForegroundColorAttributeName value:(id)[UIColor whiteColor].CGColor range:self.messageRange];
            [formatString addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:13] range:NSMakeRange(0, self.showMessage.length)];
            break;
        }
        default:
            break;
    }

    return formatString;
}


- (NSString *)showMessage
{
    _showMessage = [NSString stringWithFormat:@"%@ : %@",_showName, _message];
    
    return _showMessage;
}


@end
