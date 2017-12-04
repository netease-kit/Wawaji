#pragma once

#include "gui/rts/ui_board_control.h"
#include <map>

namespace ui
{
enum MultiBoardOpType
{
	kMultiBoardOpUnKnow		= -1,
	kMultiBoardOpStart		= 1,
	kMultiBoardOpMove		= 2,
	kMultiBoardOpEnd		= 3,
	kMultiBoardOpUndo		= 4,
	kMultiBoardOpPktId		= 5,
	kMultiBoardOpClear		= 6,
	kMultiBoardOpClearCb	= 7,
	kMultiBoardOpSyncQuery	= 8,
	kMultiBoardOpSync		= 9,
	kMultiBoardOpSyncPrep	= 10,
	kMultiBoardOpSyncPrepCb = 11,
	kMultiBoardOpSign		= 12,
	kMultiBoardOpSignEnd	= 13,
	kMultiBoardOpDocInfo	= 14, //"14:id（文档id）,page_num(当前页数，1开始计算),page_count（总页数）,type(状态通知：0，翻页操作：1);" "14:8c17c252-1276-4817-92ce-688576b8df4c,2,4,1;"
};
enum MultiBoardPenType
{
	kMultiBoardPenSingle	= 0,
	kMultiBoardPenSign		= 1,
};

struct MultiBoardOpInfo
{
	int64_t time_;
	MultiBoardOpType draw_op_type_;
	float x_;
	float y_;
	DWORD clr_;
	bool sync_end_;
	std::string uid_;

	//doc
	std::string doc_id_;
	int32_t doc_cur_page_;
	int32_t doc_page_;
	bool doc_opt_;
	MultiBoardOpInfo()
	{
		draw_op_type_ = kMultiBoardOpUnKnow;
		x_ = 0;
		y_ = 0;
		clr_ = 0xff000000;
		sync_end_ = false;
		time_ = 0;

		doc_cur_page_ = 0;
		doc_page_ = 0;
		doc_opt_ = false;
	}
};

typedef enum BoardSizeMode
{
	kBoardSizeModeStretch = 0,	//画面根据控件拉伸
	kBoardSizeModeCenter,		//画面根据画布大小等比例填充后居中
	kBoardSizeModeAuto,			//画面根据画布大小等比例填充容器后重置大小
};

typedef std::function<void(MultiBoardOpInfo info)> MultiBoardOpCallback;

class DrawSign;
/** @class BoardLayerControl
* @brief 白板的图层空间，为多人白板而实现，与点对点白板不同，多人白板的图层需要带透明。一个图层只显示一个成员的数据
* @copyright (c) 2016, NetEase Inc. All rights reserved
* @Author gq
* @date 2016/10/25
*/
class BoardLayerControl : public ui::Box
{
public:
	BoardLayerControl(void);
	~BoardLayerControl(void);
	/**
	* 设置控件id
	* @param[in] id 上层为控件设置的id
	* @return void	无返回值
	*/
	void SetId(const std::string& id) { id_ = id; }
	/**
	* 获取控件id
	* @return std::string	控件id
	*/
	std::string GetId() { return id_; }

	/**
	* 获取绘制的hbitmap
	* @param[out] width 画布宽
	* @param[out] height 画布高
	* @return HBITMAP	白板画板数据
	*/
	HBITMAP GetHBitmap(int32_t &width, int32_t &height);

	/**
	* 重写父控件虚函数
	* @param[in] hDC 目标DC
	* @param[in] rcPaint 目标绘制区域
	* @return void	无返回值
	*/
	void Paint(HDC hDC, const UiRect& rcPaint) override;

	/**
	* 重写父控件虚函数
	* @param[in] szAvailable 可用大小
	* @return CSize	返回控件大小
	*/
	CSize EstimateSize(CSize szAvailable) override;

	/**
	* 设置绘制白板时的回调函数
	* @param[in] cb 回调函数
	* @return void	无返回值
	*/
	void SetDrawCb(MultiBoardOpCallback cb) { draw_op_cb_ = cb; }

	/**
	* 响应鼠标按下消息
	* @param[in] point 鼠标坐标
	* @return bool true 在本控件范围内，false 不在本控件范围内
	*/
	BOOL OnLButtonDown(POINT point);

	/**
	* 响应鼠标移动消息
	* @param[in] point 鼠标坐标
	* @return void 无返回值
	*/
	void OnMouseMove(POINT point);

	/**
	* 响应鼠标离开消息
	* @param[in] point 鼠标坐标
	* @return void 无返回值
	*/
	void OnMouseLeave(POINT point);

	/**
	* 响应鼠标松开消息
	* @param[in] point 鼠标坐标
	* @return void 无返回值
	*/
	void OnLButtonUp(POINT point);

	/**
	* 控件重绘、保存截图时调用
	* @param[in] hdc 目标DC
	* @return void 无返回值
	*/
	void DrawExtraUnits(HDC hdc);

	/**
	* 撤销操作
	* @param[in] notify 是否通知上层
	* @return bool true 成功，false 失败
	*/
	bool Undo(bool notify = true);

	/**
	* 重做操作
	* @return void 无返回值
	*/
	void Redo();

	/**
	* 全部清除
	* @return void 无返回值
	*/
	void BoardClear();

	/**
	* 释放所有绘制单元
	* @return void 无返回值
	*/
	void ReleaseAllDrawUnits();

	/**
	* 触发控件的重绘操作
	* @return void	无返回值
	*/
	void PaintContent();

	/**
	* 接收到其他人的白板操作
	* @param[in] info_list 白板操作数据列表
	* @return void	无返回值
	*/
	void OnRecvDrawInfos(std::list<MultiBoardOpInfo> info_list);

	/**
	* 播放绘制操作
	* @param[in] info_lists 白板操作数据
	* @param[in] mine 是否为自己的白板操作数据
	* @return bool	 true 需要绘制，false 不需要绘制
	*/
	bool PlayDrawInfo(MultiBoardOpInfo info);

	/**
	* 重新显示白板操作
	* @param[in] info_lists 白板操作数据
	* @param[in] play_pos 显示的开始位置
	* @return void	无返回值
	*/
	void ReShow(const std::list<MultiBoardOpInfo>& info_lists, int play_pos);

	/**
	* 把白板操作数据添加到绘制队列里
	* @param[in] vec_units 被添加的绘制队列
	* @param[in] info_lists 白板操作数据
	* @param[in] play_pos 显示的开始位置
	* @param[in] mine 是否为自己的白板操作数据
	* @return void	无返回值
	*/
	void AddDrawInfo(std::vector<DrawBaseTool*>& vec_units, const std::list<MultiBoardOpInfo>& info_lists, int play_pos, bool mine);

	/**
	* 设置白板工具类型
	* @param[in] type 工具类型
	* @return void	无返回值
	*/
	void SetPenType(MultiBoardPenType type);

	/**
	* 设置白板画笔颜色
	* @param[in] red 红色值
	* @param[in] greed 绿色值
	* @param[in] blue 蓝色值
	* @return void	无返回值
	*/
	void SetPenColor(uint8_t red, uint8_t greed, uint8_t blue);

	/**
	* 设置白板背景颜色
	* @param[in] alpha 透明度，0为透明，255为不透明
	* @param[in] red 红色值
	* @param[in] greed 绿色值
	* @param[in] blue 蓝色值
	* @return void	无返回值
	*/
	void SetBoardBgColor(uint8_t alpha, uint8_t red, uint8_t greed, uint8_t blue);

	/**
	* 设置白板布局模式
	* @param[in] mode 模式类型
	* @return void	无返回值
	*/
	void SetBoardSizeMode(BoardSizeMode mode);

	/**
	* 获取当前所有笔迹信息
	* @return std::list<MultiBoardOpInfo> 笔迹信息
	*/
	std::list<MultiBoardOpInfo> GetDrawInfoList();
protected:

	/**
	* 校正为图层缓存中的坐标
	* @param[in] info 白板操作数据
	* @param[in] point 鼠标坐标
	* @return ui::CPoint	图层缓存中的坐标
	*/
	ui::CPoint CheckDrawPoint(MultiBoardOpInfo& info, const ui::CPoint &point);

	/**
	* 开始一个新的绘制操作
	* @param[in] point 鼠标坐标
	* @return void	无返回值
	*/
	void OnDrawUnitStart(const ui::CPoint &point);

	/**
	* 处理当前正在进行中的绘制操作
	* @param[in] point 鼠标坐标
	* @return void	无返回值
	*/
	void OnDrawUnitProcess(const ui::CPoint &point);

	/**
	* 结束当前正在进行中的绘制操作
	* @param[in] point 鼠标坐标
	* @return void	无返回值
	*/
	void OnDrawUnitEnd(const ui::CPoint &point);

	/**
	* 创建绘制单元
	* @param[in] point 鼠标坐标
	* @return void	无返回值
	*/
	void CreateDrawUnit(const ui::CPoint& point);

	/**
	* 更新标记
	* @param[in] point 鼠标坐标
	* @param[in] info 操作信息
	* @return void	无返回值
	*/
	void CheckDrawSign(const ui::CPoint& point, const MultiBoardOpInfo& info);

	/**
	* 保存当前的绘制操作
	* @return void	无返回值
	*/
	void SubmitDrawUnit();

	/**
	* 清理保存起来的操作历史
	* @return void	无返回值
	*/
	void ClearHistoryVector();

	/**
	* 创建一个位图对象
	* @param[in] hdc 目标DC
	* @param[out] bitmap 创建的位图对象
	* @return void	无返回值
	*/
	void CreateHBitmap(HDC hdc, HBITMAP& bitmap);

	/**
	* 释放一个位图对象
	* @param[in] bitmap 被释放的位图对象
	* @return void	无返回值
	*/
	void ReleaseHBitmap(HBITMAP& bitmap);

	/**
	* 对画笔的属性统一设置
	* @param[in] bitmap 被释放的位图对象
	* @return void	无返回值
	*/
	void InitPenMode(DrawBaseTool* pen);

	/**
	* 获取指定比划的笔迹信息
	* @return std::list<MultiBoardOpInfo> 笔迹信息
	*/
	std::list<MultiBoardOpInfo> GetDrawInfoListByPen(DrawBaseTool* pen);

private:
	std::string							id_;
	MultiBoardOpCallback				draw_op_cb_;
	std::vector<DrawBaseTool*>			vec_draw_units_;			// 当前绘制单元列表
	std::vector<DrawBaseTool*>			vec_waiting_draw_units_;	// 当前对方绘制单元列表等待列表
	std::vector<DrawBaseTool*>			vec_history_draw_units_;	// 撤销/回滚绘制单元列表
	DrawBaseTool*						current_draw_unit_;         // 当前正在绘制的单元
	DrawSign*							current_draw_sign_;         // 当前标记
	MultiBoardPenType					cur_pen_type_;
	BOOL								is_begin_draw_;				// 是否开始绘制
	HBITMAP								extra_bitmap_;
	DWORD								cur_pen_color_;
	DWORD								cur_bg_color_;
	BoardSizeMode						board_size_mode_;
	BOOL								smoothing_mode_;
};

/** @class DrawSign
* @brief 标记（激光笔）
*/
class DrawSign : public DrawBaseTool
{
public:
	/**
	* 构造函数
	* @param[in] x 起始横坐标
	* @param[in] y 起始纵坐标
	* @param[in] rc_valid 可以绘制的范围
	*/
	DrawSign(int x, int y, const RECT& rc_valid);
	~DrawSign();

	/**
	* 设置标记图
	* @param[in] path 图片路径
	* @return bool	是否成功
	*/
	bool SetSignImage(const std::wstring &path);

	/**
	* 绘制标记图
	* @param[in] hdc 目标DC
	* @param[in] left 目标区域起始横坐标
	* @param[in] top 目标区域起始纵坐标
	* @param[in] width 目标区域宽度
	* @param[in] height 目标区域高度
	* @return bool	是否绘制
	*/
	bool DrawSign::DrawSignImage(HDC hdc, int32_t left, int32_t top, int32_t width, int32_t height);

protected:
	/**
	* 把本绘制单元的内容绘制到目标DC
	* @param[in] hdc 目标DC
	* @param[in] bitmap 暂时无用
	* @param[in] is_continue 是否在上次绘制的位置继续绘制
	* @return void	无返回值
	*/
	virtual	void RenderSelf(HDC hdc, HBITMAP bitmap, bool is_continue);

private:
	std::shared_ptr<Gdiplus::Image> img_sign_;
};

}