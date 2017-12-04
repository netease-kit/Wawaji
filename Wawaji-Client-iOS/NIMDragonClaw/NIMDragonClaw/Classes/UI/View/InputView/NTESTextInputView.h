//
//  NTESTextInputView.h
//  NIMLiveDemo
//
//  Created by chris on 16/3/28.
//  Copyright © 2016年 Netease. All rights reserved.
//

#import "NTESGrowingTextView.h"

@protocol NTESTextInputViewDelegate;

@interface NTESTextInputView : UIView

@property (nonatomic, weak) id<NTESTextInputViewDelegate> delegate;

- (void)myFirstResponder;

- (void)myResignFirstResponder;

@end

@protocol NTESTextInputViewDelegate <NSObject>
@optional
//发送信息
- (void)inputView:(NTESTextInputView *)inputView didSendText:(NSString *)text;
//高度改变
- (void)inputView:(NTESTextInputView *)inputView didChangeHeight:(CGFloat)height;

@end
