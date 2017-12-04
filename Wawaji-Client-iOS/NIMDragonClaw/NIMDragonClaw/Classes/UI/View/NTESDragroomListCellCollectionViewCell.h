//
//  NTESDragroomListCellCollectionViewCell.h
//  NIMDragonClaw
//
//  Created by emily on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import <UIKit/UIKit.h>

@class NTESDragroom;

@interface NTESDragroomListCellCollectionViewCell : UICollectionViewCell

@property(nonatomic, strong) UIImageView *bgImgView;

- (void)configCellWithRoom:(NTESDragroom *)room;

@end
