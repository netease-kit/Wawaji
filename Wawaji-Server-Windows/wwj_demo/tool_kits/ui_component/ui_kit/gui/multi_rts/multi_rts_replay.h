#pragma once

#include "util/window_ex.h"
#include "ui_board_layer.h"

namespace nim_comp
{

struct MultiBoardRePlayInfo
{
	std::vector<ui::MultiBoardOpInfo> info_list_;
	int32_t pos_;
	MultiBoardRePlayInfo()
	{
		pos_ = 0;
	}
};

std::list<std::string> BoardStringTokenize(const char *input, const char *delimitor);
/** @class MultiRtsReplay
  * @brief 多人白板操作内容重播窗口
  * @copyright (c) 2016, NetEase Inc. All rights reserved
  * @Author gq
  * @date 2016/11/16
  */
class MultiRtsReplay : public WindowEx
{
public:
	MultiRtsReplay();
	~MultiRtsReplay();
	
	//覆盖虚函数
	virtual std::wstring GetSkinFolder() override;
	virtual std::wstring GetSkinFile() override;	
	virtual std::wstring GetWindowClassName() const override { return kClassName; };
	virtual std::wstring GetWindowId() const override;
	virtual UINT GetClassStyle() const override { return UI_CLASSSTYLE_FRAME | CS_DBLCLKS; };

	/**
	* 窗口初始化函数
	* @return void	无返回值
	*/
	virtual void InitWindow() override;

	/**
	* 拦截并处理底层窗体消息
	* @param[in] uMsg 消息类型
	* @param[in] wParam 附加参数
	* @param[in] lParam 附加参数
	* @return LRESULT 处理结果
	*/
	virtual LRESULT HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam) override;

	/**
	* 处理窗口被销毁的消息
	* @param[in] hWnd 窗口句柄
	* @return void	无返回值
	*/
	virtual void OnFinalMessage(HWND hWnd) override;

	/**
	* 根据控件类名创建自定义控件
	* @param[in] pstrClass 控件类名
	* @return Control* 创建的控件的指针
	*/
	virtual ui::Control* CreateControl(const std::wstring& pstrClass) override;
private:
	/**
	* 处理所有控件的所有消息
	* @param[in] msg 消息的相关信息
	* @return bool true 继续传递控件消息，false 停止传递控件消息
	*/
	bool Notify(ui::EventArgs* msg);

	/**
	* 处理所有控件单击消息
	* @param[in] msg 消息的相关信息
	* @return bool true 继续传递控件消息，false 停止传递控件消息
	*/
	bool OnClicked(ui::EventArgs* msg);

	/**
	* 解析白板存档文件为白板操作数据
	* @param[in] src_data 白板存档文件内容
	* @param[out] info_lists 白板操作数据列表
	* @param[out] min_time 起始时间
	* @param[out] max_time 结束时间
	* @return int 白板操作数据总数
	*/
	int MultiRtsReplay::OnParseData(std::string src_data, std::vector<ui::MultiBoardOpInfo>& info_lists, int64_t &min_time, int64_t &max_time);

	/**
	* 选择白板存档文件
	* @return void	无返回值
	*/
	void OnBtnFile();

	/**
	* 响应选择白板存档文件的回调函数
	* @param[in] ret 是否选择了文件
	* @param[in] file_path 选择的文件的路径
	* @return void	无返回值
	*/
	void OnFileSelected(BOOL ret, std::wstring file_path);

	/**
	* 开始播放白板
	* @return void	无返回值
	*/
	void OnPlay();

	/**
	* 暂停播放白板
	* @return void	无返回值
	*/
	void OnPause();

	/**
	* 停止播放白板
	* @return void	无返回值
	*/
	void OnStop();

	/**
	* 播放白板定时器回调
	* @return void	无返回值
	*/
	void OnPlayStepTimer();

	/**
	* @param[in] id 白板控件id
	* @param[in] auto_add 是否自动添加
	* @return ui::BoardLayerControl*	白板空间指针
	*/
	ui::BoardLayerControl* AddBoardLayerByUid(const std::string& id, bool auto_add = true);

public:
	static const LPCTSTR kClassName; // 类名

private:
	int type_;
	ui::Box* board_box_;
	ui::Button* btn_start_;
	ui::Button* btn_pause_;
	ui::Button* btn_stop_;
	ui::Label* time_pos_;
	ui::Combo* speed_combo_;
	nbase::WeakCallbackFlag auto_play_weakflag_;
	int64_t cur_play_time_;
	int64_t max_play_time_;
	int32_t play_speed_;
	std::map<std::string, MultiBoardRePlayInfo> map_uid_info_lists_;
	std::map<std::string, ui::BoardLayerControl*> map_uid_board_lists_;
};
}