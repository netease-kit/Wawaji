//
//  NTESNormalMessageCell.m
//  NEUIDemo
//
//  Created by Netease on 17/1/4.
//  Copyright © 2017年 Netease. All rights reserved.
//

#import "NTESNormalMessageCell.h"
#import "NTESTextMessage.h"

@interface NTESNormalMessageCell ()

@property (nonatomic, strong) UILabel *label;

@end

@implementation NTESNormalMessageCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    if (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier])
    {
        self.selectionStyle = UITableViewCellSelectionStyleNone;
        self.backgroundColor = [UIColor clearColor];
        [self addSubview:self.label];
    }
    return self;
}


- (void)refresh:(NTESTextMessage *)model
{
    [self.label setAttributedText:model.formatString];
    [self setNeedsLayout];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    self.label.frame = CGRectMake(self.contentView.left + 10,
                                            self.contentView.top + 3,
                                            self.contentView.width - 10,
                                            self.contentView.height - 3);
}

#pragma mark - Get
- (UILabel *)label
{
    if (!_label)
    {
        _label = [[UILabel alloc] init];
        _label.numberOfLines = 0;
        _label.font = [UIFont systemFontOfSize:14];
        _label.textColor = [UIColor whiteColor];
        _label.backgroundColor = [UIColor clearColor];
        _label.lineBreakMode = NSLineBreakByCharWrapping;
    }
    return _label;
}

@end
