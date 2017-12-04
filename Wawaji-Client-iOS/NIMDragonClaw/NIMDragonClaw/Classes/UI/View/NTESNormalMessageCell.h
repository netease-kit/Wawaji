//
//  NTESNormalMessageCell.h
//  NEUIDemo
//
//  Created by Netease on 17/1/4.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <UIKit/UIKit.h>

@class NTESTextMessage;

@interface NTESNormalMessageCell : UITableViewCell

- (void)refresh:(NTESTextMessage *)model;

@end
