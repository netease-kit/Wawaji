#include "ui_board_layer.h"

namespace ui
{
#define kdwDefaultColor		0						// 默认颜色
#define kdwRedColor			RGB(0xe6,0x00,0x13)		// 默认颜色
#define kdwGreenColor		RGB(0x06,0xe6,0x13)		// 默认颜色
#define kdwDefaultBgColor	0xffffff				// 默认背景颜色
#define	knDefaultLineWidth	2						// 默认线粗
#define	knDefaultSignWidth	8						// 标记点直径

#define BitmapW		664//652//800
#define BitmapH		498//489//600

BoardLayerControl::BoardLayerControl(void)
{
	current_draw_unit_ = nullptr;
	current_draw_sign_ = nullptr;
	extra_bitmap_ = nullptr;
	draw_op_cb_ = nullptr;
	is_begin_draw_ = FALSE;
	cur_pen_color_ = kdwDefaultColor;
	cur_bg_color_ = kdwDefaultBgColor;
	board_size_mode_ = kBoardSizeModeAuto;
	smoothing_mode_ = TRUE;
	cur_pen_type_ = kMultiBoardPenSingle;
}

BoardLayerControl::~BoardLayerControl(void)
{
	ReleaseAllDrawUnits();
}

void BoardLayerControl::Paint(HDC hDC, const UiRect& rcPaint)
{
	try
	{
		if( !::IntersectRect( &m_rcPaint, &rcPaint, &m_rcItem ) ) 
			return;
		Control::Paint(hDC, rcPaint);
		//paint custom
		DrawExtraUnits(hDC);

		//绘制子控件
		for (auto it = m_items.begin(); it != m_items.end(); it++)
		{
			Control* pControl = *it;
			if (!pControl->IsVisible()) continue;
			UiRect controlPos = pControl->GetPos();
			if (!::IntersectRect(&m_rcPaint, &rcPaint, &controlPos)) continue;
			pControl->AlphaPaint(hDC, rcPaint);
		}
	}
	catch (...)
	{
		throw "BoardLayerControl::DoPaint";
	}
}
HBITMAP BoardLayerControl::GetHBitmap(int32_t &width, int32_t &height)
{
	width = BitmapW;
	height = BitmapH;
	return extra_bitmap_;
}
CSize BoardLayerControl::EstimateSize(CSize szAvailable)
{
	switch (board_size_mode_)
	{
	case kBoardSizeModeStretch:
		break;
	case kBoardSizeModeCenter:
		break;
	case kBoardSizeModeAuto:
	{
		int32_t w = szAvailable.cx;
		int32_t h = szAvailable.cy;
		if (h * BitmapW > w * BitmapH)
		{
			h = w * BitmapH / BitmapW;
		}
		else
		{
			w = h * BitmapW / BitmapH;
		}
		SetFixedWidth(w, false);
		SetFixedHeight(h);
	}
		break;
	default:
		break;
	}
	return __super::EstimateSize(szAvailable);
}
BOOL BoardLayerControl::OnLButtonDown(POINT point)
{
	if (::PtInRect(&m_rcItem, point))
	{
		point.x -= m_rcItem.left;
		point.y -= m_rcItem.top;
		OnDrawUnitStart(point);
		return TRUE;
	}
	return FALSE;
}

void BoardLayerControl::OnMouseMove(POINT point)
{
	if (current_draw_unit_ || cur_pen_type_ == kMultiBoardPenSign)
	{
		point.x -= m_rcItem.left;
		point.y -= m_rcItem.top;
		OnDrawUnitProcess(point);
	}
	else if (is_begin_draw_)
	{
		OnLButtonDown(point);
	}
}

void BoardLayerControl::OnMouseLeave(POINT point)
{
	if (cur_pen_type_ == kMultiBoardPenSign)
	{
		if (draw_op_cb_)
		{
			MultiBoardOpInfo info;
			ui::CPoint pt = CheckDrawPoint(info, point);
			info.clr_ = cur_pen_color_;
			info.draw_op_type_ = kMultiBoardOpSignEnd;
			draw_op_cb_(info);
		}
	}
}

void BoardLayerControl::OnLButtonUp(POINT point)
{
	if (current_draw_unit_)
	{
		point.x -= m_rcItem.left;
		point.y -= m_rcItem.top;
		OnDrawUnitEnd(point);
	}
}

void BoardLayerControl::DrawExtraUnits(HDC hdc)
{
	bool redraw = false;
	if (!extra_bitmap_)
	{
		redraw = true;
		CreateHBitmap(hdc, extra_bitmap_);
	}
	HDC hMemDC = CreateCompatibleDC(hdc);
	HBITMAP hOldBitmap = (HBITMAP)SelectObject(hMemDC, extra_bitmap_);
	if (redraw)
	{
		//ui::UiRect rc(0, 0, BitmapW, BitmapH);
		//HBRUSH current_brush = CreateSolidBrush(cur_bg_color_);
		//::FillRect(hMemDC, &rc, current_brush);
		//DeleteObject(current_brush);
		Gdiplus::Graphics graphics(hMemDC);
		Gdiplus::Color gdiPlusColor(cur_bg_color_);
		Gdiplus::SolidBrush brush(gdiPlusColor);
		graphics.FillRectangle(&brush, 0, 0, BitmapW, BitmapH);

		for (size_t i = 0; i < vec_draw_units_.size(); i++)
		{
			vec_draw_units_[i]->Render(hMemDC);
		}
	}
	for (auto it : vec_waiting_draw_units_)
	{
		it->Render(hMemDC, nullptr, true);
		vec_draw_units_.push_back(it);
	}
	vec_waiting_draw_units_.clear();
	if (current_draw_unit_)
	{
		current_draw_unit_->Render(hMemDC, nullptr, true);
	}
	// 把屏幕设备描述表拷贝到内存设备描述表中
	int draw_left = m_rcItem.left;
	int draw_top = m_rcItem.top;
	int draw_width = m_rcItem.GetWidth();
	int draw_height = m_rcItem.GetHeight();
	switch (board_size_mode_)
	{
	case kBoardSizeModeStretch:
		break;
	case kBoardSizeModeCenter:
		if (draw_height * BitmapW > draw_width * BitmapH)
		{
			draw_height = draw_width * BitmapH / BitmapW;
			draw_top += (m_rcItem.GetHeight() - draw_height) / 2;
		}
		else
		{
			draw_width = draw_height * BitmapW / BitmapH;
			draw_left += (m_rcItem.GetWidth() - draw_width) / 2;
		}
		break;
	case kBoardSizeModeAuto:
		break;
	default:
		break;
	}

	BLENDFUNCTION bf = { AC_SRC_OVER, 0, 255, AC_SRC_ALPHA };
	::AlphaBlend(hdc, draw_left, draw_top, draw_width, draw_height, hMemDC, 0, 0, BitmapW, BitmapH, bf);
	//::StretchBlt(hdc, draw_left, draw_top, draw_width, draw_height, hMemDC, 0, 0, BitmapW, BitmapH, SRCCOPY);
	SelectObject(hMemDC, hOldBitmap);
	DeleteDC(hMemDC);
	if (current_draw_sign_)
	{
		current_draw_sign_->DrawSignImage(hdc, draw_left, draw_top, draw_width, draw_height);
	}
}

bool BoardLayerControl::Undo(bool notify)
{
	if (!vec_draw_units_.empty() || !vec_waiting_draw_units_.empty() || current_draw_unit_)
	{
		ReleaseHBitmap(extra_bitmap_);
		// 弹出队尾
		DrawBaseTool* unit = nullptr;
		if (current_draw_unit_)
		{
			unit = current_draw_unit_;
			current_draw_unit_ = nullptr;
		}
		else if (!vec_waiting_draw_units_.empty())
		{
			unit = vec_waiting_draw_units_.back();
			vec_waiting_draw_units_.pop_back();
		} 
		else
		{
			unit = vec_draw_units_.back();
			vec_draw_units_.pop_back();
		}
		// 重绘
		PaintContent();
		// 加入到历史中
		vec_history_draw_units_.push_back(unit);

		if (notify && draw_op_cb_)
		{
			MultiBoardOpInfo info;
			info.draw_op_type_ = kMultiBoardOpUndo;
			draw_op_cb_(info);
		}
		return true;
	}
	return false;
}

void BoardLayerControl::Redo()
{
	if (!vec_history_draw_units_.empty())
	{
		if (current_draw_unit_)
		{
			vec_waiting_draw_units_.push_back(current_draw_unit_);
			current_draw_unit_ = nullptr;
		}
		// 弹出历史队尾
		auto it = vec_history_draw_units_.back();
		vec_history_draw_units_.pop_back();
		// 还原到原队尾
		vec_waiting_draw_units_.push_back(it);
		// 重绘
		PaintContent();
	}
}
void BoardLayerControl::BoardClear()
{
	if (draw_op_cb_)
	{
		MultiBoardOpInfo info;
		info.draw_op_type_ = kMultiBoardOpClear;
		draw_op_cb_(info);
	}
	ReleaseAllDrawUnits();
	PaintContent();
}

void BoardLayerControl::ReleaseAllDrawUnits()
{
	for (size_t i = 0; i < vec_draw_units_.size(); i++)
	{
		delete vec_draw_units_[i];
	}
	vec_draw_units_.clear();

	for (size_t i = 0; i < vec_waiting_draw_units_.size(); i++)
	{
		delete vec_waiting_draw_units_[i];
	}
	vec_waiting_draw_units_.clear();

	for (size_t i = 0; i < vec_history_draw_units_.size(); i++)
	{
		delete vec_history_draw_units_[i];
	}
	vec_history_draw_units_.clear();

	if (current_draw_unit_)
	{
		delete current_draw_unit_;
		current_draw_unit_ = nullptr;
	}
	if (current_draw_sign_)
	{
		delete current_draw_sign_;
		current_draw_sign_ = nullptr;
	}
	ReleaseHBitmap(extra_bitmap_);
}
void BoardLayerControl::OnRecvDrawInfos(std::list<MultiBoardOpInfo> info_list)
{
	bool redraw = false;
	for (auto& it : info_list)
	{
		redraw |= PlayDrawInfo(it);
	}
	if (redraw)
	{
		PaintContent();
	}
}
bool BoardLayerControl::PlayDrawInfo(MultiBoardOpInfo info)
{
	bool redraw = false;
	POINT pt;
	pt.x = (LONG)(info.x_ * BitmapW);
	pt.y = (LONG)(info.y_ * BitmapH);
	switch (info.draw_op_type_)
	{
	case kMultiBoardOpStart:
		if (current_draw_unit_)
		{
			vec_waiting_draw_units_.push_back(current_draw_unit_);
			current_draw_unit_ = nullptr;
		}
		CreateDrawUnit(pt);
		current_draw_unit_->SetColor(info.clr_);
		redraw = true;
		break;
	case kMultiBoardOpMove:
		if (current_draw_unit_)
		{
			if (current_draw_unit_->SetEndPoint(pt.x, pt.y))
			{
				redraw = true;
			}
		} 
		else
		{
			CreateDrawUnit(pt);
			current_draw_unit_->SetColor(info.clr_);
			redraw = true;
		}
		break;
	case kMultiBoardOpEnd:
		if (current_draw_unit_)
		{
			current_draw_unit_->SetEndPoint(pt.x, pt.y);
			vec_waiting_draw_units_.push_back(current_draw_unit_);
			current_draw_unit_ = nullptr;
			redraw = true;
		}
		break;
	case kMultiBoardOpUndo:
		Undo(false);
		redraw = true;
		break;
	case kMultiBoardOpClear:
		ReleaseAllDrawUnits();
		//if (draw_op_cb_)
		//{
		//	MultiBoardOpInfo info;
		//	info.draw_op_type_ = kMultiBoardOpClearCb;
		//	draw_op_cb_(info);
		//}
		redraw = true;
		break;
	case kMultiBoardOpClearCb:
		ReleaseAllDrawUnits();
		redraw = true;
		break;
	case kMultiBoardOpSign:
	case kMultiBoardOpSignEnd:
		CheckDrawSign(pt, info);
		redraw = true;
		break;
	default:
		break;
	}
	return redraw;
}
void BoardLayerControl::ReShow(const std::list<MultiBoardOpInfo>& info_lists, int play_pos)
{
	ReleaseAllDrawUnits();
	AddDrawInfo(vec_draw_units_, info_lists, play_pos, true);
	PaintContent();
}
void BoardLayerControl::AddDrawInfo(std::vector<DrawBaseTool*>& vec_units, const std::list<MultiBoardOpInfo>& info_lists, int play_pos, bool mine)
{
	DrawBaseTool* draw_tool_temp = nullptr;
	int num = 0;
	for (auto& info : info_lists)
	{
		num++;
		if (num > play_pos && play_pos)
		{
			break;
		}
		POINT pt;
		pt.x = (LONG)(info.x_ * BitmapW);
		pt.y = (LONG)(info.y_ * BitmapH);
		switch (info.draw_op_type_)
		{
		case kMultiBoardOpStart:
		{
			if (draw_tool_temp)
			{
				vec_units.push_back(draw_tool_temp);
				draw_tool_temp = nullptr;
			}
			ui::UiRect rc(0, 0, BitmapW, BitmapH);
			draw_tool_temp = new DrawSinglePen(pt.x, pt.y, rc);
			draw_tool_temp->SetColor(info.clr_);
			InitPenMode(draw_tool_temp);
			//redraw = true;
		}
		break;
		case kMultiBoardOpMove:
			if (draw_tool_temp)
			{
				if (draw_tool_temp->SetEndPoint(pt.x, pt.y))
				{
					//redraw = true;
				}
			} 
			else
			{
				ui::UiRect rc(0, 0, BitmapW, BitmapH);
				draw_tool_temp = new DrawSinglePen(pt.x, pt.y, rc);
				draw_tool_temp->SetColor(info.clr_);
				InitPenMode(draw_tool_temp);
			}
			break;
		case kMultiBoardOpEnd:
			if (draw_tool_temp)
			{
				draw_tool_temp->SetColor(info.clr_);
				draw_tool_temp->SetEndPoint(pt.x, pt.y);
				vec_units.push_back(draw_tool_temp);
				draw_tool_temp = nullptr;
				//redraw = true;
			}
			break;
		case kMultiBoardOpUndo:
			if (vec_units.size() > 0)
			{
				DrawBaseTool* tool = vec_units.back();
				vec_units.pop_back();
				if (tool)
				{
					delete tool;
				}
			}
			//redraw = true;
			break;
		case kMultiBoardOpClear:
		case kMultiBoardOpClearCb:
			if (draw_tool_temp)
			{
				delete draw_tool_temp;
				draw_tool_temp = nullptr;
			}
			while (vec_units.size() > 0)
			{
				DrawBaseTool* tool = vec_units.back();
				vec_units.pop_back();
				if (tool)
				{
					delete tool;
				}
			}
			break;
		default:
			break;
		}
	}
	if (draw_tool_temp)
	{
		vec_units.push_back(draw_tool_temp);
		draw_tool_temp = nullptr;
		//redraw = true;
	}
}
void BoardLayerControl::SetPenType(MultiBoardPenType type)
{
	is_begin_draw_ = false;
	cur_pen_type_ = type;
}
void BoardLayerControl::SetPenColor(uint8_t red, uint8_t greed, uint8_t blue)
{
	cur_pen_color_ = CMYK(0x0, red, greed, blue);
}
void BoardLayerControl::SetBoardBgColor(uint8_t alpha, uint8_t red, uint8_t greed, uint8_t blue)
{
	cur_bg_color_ = CMYK(alpha, red, greed, blue);
	ReleaseHBitmap(extra_bitmap_);
}

void BoardLayerControl::SetBoardSizeMode(BoardSizeMode mode)
{
	board_size_mode_ = mode;
	ReleaseHBitmap(extra_bitmap_);
}
ui::CPoint BoardLayerControl::CheckDrawPoint(MultiBoardOpInfo& info, const ui::CPoint &point)
{
	int draw_left = point.x;
	int draw_top = point.y;
	int draw_width = m_rcItem.GetWidth();
	int draw_height = m_rcItem.GetHeight();
	switch (board_size_mode_)
	{
	case kBoardSizeModeStretch:
		break;
	case kBoardSizeModeCenter:
		if (draw_height * BitmapW > draw_width * BitmapH)
		{
			draw_height = draw_width * BitmapH / BitmapW;
			draw_top -= (m_rcItem.GetHeight() - draw_height) / 2;
		}
		else
		{
			draw_width = draw_height * BitmapW / BitmapH;
			draw_left -= (m_rcItem.GetWidth() - draw_width) / 2;
		}
		break;
	case kBoardSizeModeAuto:
		break;
	default:
		break;
	}
	info.x_ = (float)(draw_left * 1.0 / draw_width);
	info.y_ = (float)(draw_top * 1.0 / draw_height);
	ui::CPoint pt;
	pt.x = info.x_ * BitmapW;
	pt.y = info.y_ * BitmapH;
	return pt;
}

void BoardLayerControl::OnDrawUnitStart(const ui::CPoint &point)
{
	MultiBoardOpInfo info;
	ui::CPoint pt = CheckDrawPoint(info, point);
	info.clr_ = cur_pen_color_;
	switch (cur_pen_type_)
	{
	case kMultiBoardPenSingle:
		{
			info.draw_op_type_ = kMultiBoardOpStart;
			CreateDrawUnit(pt);
			current_draw_unit_->SetColor(info.clr_);
		}
		break;
	case kMultiBoardPenSign:
		{
			info.draw_op_type_ = kMultiBoardOpSign;
		}
		break;
	}
	is_begin_draw_ = true;
	if (draw_op_cb_)
	{
		draw_op_cb_(info);
	}
}

void BoardLayerControl::OnDrawUnitProcess(const ui::CPoint &point)
{
	MultiBoardOpInfo info;
	ui::CPoint pt = CheckDrawPoint(info, point);
	info.clr_ = cur_pen_color_;
	switch (cur_pen_type_)
	{
	case kMultiBoardPenSingle:
		{
			info.draw_op_type_ = kMultiBoardOpMove;
			if (current_draw_unit_ && current_draw_unit_->SetEndPoint(pt.x, pt.y))
			{
				PaintContent(); // 鼠标移动过程中，需要立即重绘
				if (draw_op_cb_)
				{
					draw_op_cb_(info);
				}
			}
		}
		break;
	case kMultiBoardPenSign:
		{
			info.draw_op_type_ = kMultiBoardOpSign;
			if (draw_op_cb_)
			{
				draw_op_cb_(info);
			}
		}
		break;
	}
}

void BoardLayerControl::OnDrawUnitEnd(const ui::CPoint &point)
{
	if (!current_draw_unit_)
	{
		return;
	}
	MultiBoardOpInfo info;
	info.draw_op_type_ = kMultiBoardOpEnd;
	info.clr_ = cur_pen_color_;
	ui::CPoint pt = CheckDrawPoint(info, point);
	current_draw_unit_->SetEndPoint(pt.x, pt.y);

	SubmitDrawUnit();
	if (draw_op_cb_)
	{
		draw_op_cb_(info);
	}
}

void BoardLayerControl::CreateDrawUnit(const ui::CPoint& point)
{
	ClearHistoryVector();
	delete current_draw_unit_;
	ui::UiRect rc(0, 0, BitmapW, BitmapH);

	current_draw_unit_ = new DrawSinglePen(point.x, point.y, rc);
	InitPenMode(current_draw_unit_);
}
void BoardLayerControl::SubmitDrawUnit()
{
	vec_waiting_draw_units_.push_back(current_draw_unit_);
	current_draw_unit_ = nullptr; //置空,vector自己管理内存
	is_begin_draw_ = false;
	PaintContent();
}
void BoardLayerControl::CheckDrawSign(const ui::CPoint& point, const MultiBoardOpInfo& info)
{
	if (info.draw_op_type_ == kMultiBoardOpSignEnd)
	{
		if (current_draw_sign_)
		{
			delete current_draw_sign_;
			current_draw_sign_ = nullptr;
		}
	}
	else if (info.draw_op_type_ == kMultiBoardOpSign)
	{
		if (current_draw_sign_ == nullptr)
		{
			ui::UiRect rc(0, 0, BitmapW, BitmapH);
			current_draw_sign_ = new DrawSign(point.x, point.y, rc);
			std::wstring theme_dir = QPath::GetAppPath();
			std::wstring sign_path = theme_dir + L"res\\icons\\sign.png";
			current_draw_sign_->SetSignImage(sign_path);
			//current_draw_sign_->SetColor(info.clr_);
			//current_draw_sign_->SetLineWidth(knDefaultSignWidth);
		}
		else
		{
			current_draw_sign_->SetEndPoint(point.x, point.y);
			//current_draw_sign_->SetColor(info.clr_);
		}
	}
}

void BoardLayerControl::ClearHistoryVector()
{
	if (vec_history_draw_units_.empty())
	{
		return;
	}
	for (size_t i = 0; i < vec_history_draw_units_.size(); i++)
	{
		delete vec_history_draw_units_[i];
	}
	vec_history_draw_units_.clear();
}

void BoardLayerControl::PaintContent()
{
	this->Invalidate();
}
void BoardLayerControl::CreateHBitmap(HDC hdc, HBITMAP& bitmap)
{
	ReleaseHBitmap(bitmap);

	int width = BitmapW;
	int height = BitmapH;
	UINT data_size = width * height * 4;
	BITMAPINFO bmi;
	::ZeroMemory(&bmi, sizeof(BITMAPINFO));
	bmi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
	bmi.bmiHeader.biWidth = width;
	bmi.bmiHeader.biHeight = height;
	bmi.bmiHeader.biPlanes = 1;
	bmi.bmiHeader.biBitCount = 32;
	bmi.bmiHeader.biCompression = BI_RGB;
	bmi.bmiHeader.biSizeImage = data_size;
	long* pBitmapData;
	bitmap = ::CreateDIBSection(hdc, &bmi, DIB_RGB_COLORS,
		(void**)&pBitmapData, NULL, 0);
}
void BoardLayerControl::ReleaseHBitmap(HBITMAP& bitmap)
{
	if (bitmap)
	{
		DeleteObject(bitmap);
		bitmap = NULL;
	}
}
void BoardLayerControl::InitPenMode(DrawBaseTool* pen)
{
	((DrawSinglePen*)pen)->SetLayerMode(true);
	((DrawSinglePen*)pen)->SetSmoothingMode(smoothing_mode_);
	pen->SetLineWidth(knDefaultLineWidth);
}
std::list<MultiBoardOpInfo> BoardLayerControl::GetDrawInfoListByPen(DrawBaseTool* pen)
{
	std::list<MultiBoardOpInfo> ret_list;
	DrawSinglePen* single_pen = dynamic_cast<DrawSinglePen*>(pen);
	if (single_pen)
	{
		MultiBoardOpInfo info_end;
		for (auto it : single_pen->GetPtList())
		{
			MultiBoardOpInfo info;
			info.draw_op_type_ = ret_list.size() == 0 ? kMultiBoardOpStart : kMultiBoardOpMove;
			info.x_ = (float)(it.x * 1.0 / BitmapW);
			info.y_ = (float)(it.y * 1.0 / BitmapH);
			info.clr_ = single_pen->GetColor() & 0xffffff;

			ret_list.push_back(info);
			info_end = info;
		}
		if (ret_list.size() > 0)
		{
			info_end.draw_op_type_ = kMultiBoardOpEnd;
			ret_list.push_back(info_end);
		}
	}

	return ret_list;
}
std::list<MultiBoardOpInfo> BoardLayerControl::GetDrawInfoList()
{
	std::list<MultiBoardOpInfo> ret_list;
	for (auto it : vec_draw_units_)
	{
		std::list<MultiBoardOpInfo> info_temps = GetDrawInfoListByPen(it);
		if (info_temps.size() > 0)
		{
			ret_list.insert(ret_list.end(), info_temps.begin(), info_temps.end());
		}
	}
	for (auto it : vec_waiting_draw_units_)
	{
		std::list<MultiBoardOpInfo> info_temps = GetDrawInfoListByPen(it);
		if (info_temps.size() > 0)
		{
			ret_list.insert(ret_list.end(), info_temps.begin(), info_temps.end());
		}
	}
	std::list<MultiBoardOpInfo> cur_info_temps = GetDrawInfoListByPen(current_draw_unit_);
	if (cur_info_temps.size() > 0)
	{
		ret_list.insert(ret_list.end(), cur_info_temps.begin(), cur_info_temps.end());
	}
	return ret_list;
}


//-----------------------------DrawSign

DrawSign::DrawSign(int x, int y, const RECT& rc_valid)
:DrawBaseTool(x, y, rc_valid)
{
	img_sign_ = nullptr;
}
DrawSign::~DrawSign()
{
}
bool DrawSign::SetSignImage(const std::wstring &path)
{
	img_sign_.reset(new Gdiplus::Image(path.c_str()));

	Gdiplus::Status status = img_sign_.get()->GetLastStatus();
	ASSERT(status == Gdiplus::Ok);
	if (status != Gdiplus::Ok) {
		img_sign_ = nullptr;
		return false;
	}
}
void DrawSign::RenderSelf(HDC hdc, HBITMAP bitmap, bool is_continue)
{
	//Gdiplus::Graphics graphics(hdc);
	//Gdiplus::Color gdiPlusColor(color_ | 0xff000000);
	//Gdiplus::SolidBrush brush(gdiPlusColor);
	//graphics.FillEllipse(&brush, Gdiplus::RectF(right_ - line_width_ * 1.0 / 2, bottom_ - line_width_ * 1.0 / 2, line_width_, line_width_));
	DrawSignImage(hdc, rc_valid_.left, rc_valid_.right, rc_valid_.GetWidth(), rc_valid_.GetHeight());
}
bool DrawSign::DrawSignImage(HDC hdc, int32_t left, int32_t top, int32_t width, int32_t height)
{
	if (img_sign_ == nullptr)
	{
		return false;
	}
	if (right_ <= rc_valid_.left || right_ >= rc_valid_.right)
	{
		return false;
	}
	if (bottom_ <= rc_valid_.top || bottom_ >= rc_valid_.bottom)
	{
		return false;
	}
	float image_width = img_sign_->GetWidth();
	float image_height = img_sign_->GetHeight();
	if (width <= image_width || height < image_height)
	{
		return false;
	}
	float dst_left = left + right_ * 1.0 * width / rc_valid_.GetWidth() - image_width / 2;
	float dst_top = top + bottom_ * 1.0 * height / rc_valid_.GetHeight() - image_height / 2;

	Gdiplus::Graphics g(hdc);
	g.DrawImage(img_sign_.get(), Gdiplus::RectF(dst_left, dst_top, image_width, image_height), 0, 0, image_width, image_height, Gdiplus::UnitPixel);
	//Gdiplus::Graphics graphics(hdc);
	//Gdiplus::Color gdiPlusColor(color_ | 0xff000000);
	//Gdiplus::SolidBrush brush(gdiPlusColor);
	//graphics.FillEllipse(&brush, Gdiplus::RectF(dst_left, dst_top, image_width, image_height));
}

}


