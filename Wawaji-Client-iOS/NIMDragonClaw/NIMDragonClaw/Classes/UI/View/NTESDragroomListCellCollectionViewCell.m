//
//  NTESDragroomListCellCollectionViewCell.m
//  NIMDragonClaw
//
//  Created by emily on 2017/11/20.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESDragroomListCellCollectionViewCell.h"
#import "NTESDragRoom.h"

@interface NTESDragroomListCellCollectionViewCell()

@property(nonatomic, strong) UILabel *roomTitleLabel;

@property(nonatomic, strong) UILabel *roomInfoLabel;

@property(nonatomic, strong) NTESDragroom *room;

@end

@implementation NTESDragroomListCellCollectionViewCell

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self addSubviews];
    }
    return self;
}

- (void)addSubviews {
    UIImage *image = [[UIImage imageNamed:@"bkg_room_list_normal"] resizableImageWithCapInsets:UIEdgeInsetsMake(25, 25, 25, 25) resizingMode:UIImageResizingModeStretch];
    UIImageView *imageView = [[UIImageView alloc] initWithFrame:self.bounds];
    imageView.image = image;
    imageView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self addSubview:imageView];

    [@[self.bgImgView,
       self.roomTitleLabel,
      self.roomInfoLabel] enumerateObjectsUsingBlock:^(UIView *view, NSUInteger idx, BOOL * _Nonnull stop) {
          [self addSubview:view];
      }];
}


- (void)layoutSubviews
{
    [super layoutSubviews];
    CGFloat padding = 6.f;
    self.bgImgView.top     = padding;
    self.bgImgView.width   = self.width - padding * 2;
    self.bgImgView.centerX = self.width * .5f;
    self.bgImgView.height  = self.height * 2 / 3;
    
    self.roomTitleLabel.left    = 15.f;
    self.roomTitleLabel.bottom  = self.height - 30.f;
    self.roomInfoLabel.left   = 15.f;
    self.roomInfoLabel.bottom = self.height - 14.f;
}


#pragma mark - Public

- (void)configCellWithRoom:(NTESDragroom *)room {
    self.room = room;
    self.roomTitleLabel.text = room.name;
    
    if (room.roomStatus)
    {
        if (room.queueCount == 0)
        {
            self.roomInfoLabel.textColor = UIColorFromRGB(0x00CDBC);
            self.roomInfoLabel.text = [NSString stringWithFormat:@"空闲"];
        }
        else
        {
            self.roomInfoLabel.text = [NSString stringWithFormat:@"%lu人排队", (unsigned long)room.queueCount];
        }
    }
    else
    {
        self.roomInfoLabel.text = @"敬请期待";
        self.roomInfoLabel.textColor = [UIColor lightGrayColor];
    }
    [self.roomTitleLabel sizeToFit];
    [self.roomInfoLabel sizeToFit];
}


#pragma mark - Getter

- (UIImageView *)bgImgView {
    if (!_bgImgView) {
        _bgImgView = [[UIImageView alloc] initWithFrame:CGRectZero];
        _bgImgView.contentMode = UIViewContentModeScaleAspectFill;
        _bgImgView.clipsToBounds = YES;
        _bgImgView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    }
    return _bgImgView;
}

- (UILabel *)roomTitleLabel {
    if (!_roomTitleLabel) {
        _roomTitleLabel = [[UILabel alloc] initWithFrame:CGRectZero];
        _roomTitleLabel.font = [UIFont systemFontOfSize:14.f];
        _roomTitleLabel.textColor = [UIColor blackColor];
    }
    return _roomTitleLabel;
}

- (UILabel *)roomInfoLabel {
    if (!_roomInfoLabel) {
        _roomInfoLabel = [[UILabel alloc] initWithFrame:CGRectZero];
        _roomInfoLabel.font = [UIFont systemFontOfSize:11.f];
        _roomInfoLabel.textColor = [UIColor orangeColor];
    }
    return _roomInfoLabel;
}


@end
