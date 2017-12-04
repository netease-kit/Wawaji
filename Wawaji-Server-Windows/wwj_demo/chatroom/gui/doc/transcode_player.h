#pragma once

namespace nim_chatroom
{

/** @class TranscodeAnimationPlayer
  * @brief 文档列表项转码进度条的动画控制类
  * @copyright (c) 2016, NetEase Inc. All rights reserved
  * @author Redrain
  * @date 2016/12/19
  */
class TranscodeAnimationPlayer : public ui::AnimationPlayerBase
{
public:
	static const int kEndValue = 10000; // 最大值设置为10000，方便除以100后获取含有小数点的百分比

	virtual void Init() override;
	virtual int GetCurrentValue() override;

	/**
	* 是否已经转码完成(转码完成后，剩余的进度会1秒内匀速执行完)
	* @return bool true 完成，false 未完成
	*/
	bool IsTranscodeCompelete() { return is_trans_compelete_; }

	/**
	* 设置已经转码完成
	* @return void	无返回值
	*/
	void SetTranscodeCompelete() { is_trans_compelete_ = true; }

private:
	bool is_trans_compelete_ = false;
};

}