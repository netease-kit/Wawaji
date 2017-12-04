#include "multi_rts_replay.h"
#include "shared/modal_wnd/file_dialog_ex.h"

using namespace ui;

namespace nim_comp
{
const LPCTSTR MultiRtsReplay::kClassName = L"MultiRtsReplay";

#define PLAY_TIME_STAMP  100

std::list<std::string> BoardStringTokenize(const char *input, const char *delimitor)
{
	std::list<std::string> ret_list;
	std::string data = input;
	int32_t pos = data.find(delimitor);
	while (pos != -1)
	{
		ret_list.push_back(data.substr(0, pos));
		data = data.substr(pos + 1);
		pos = data.find(delimitor);
	}
	ret_list.push_back(data);
	return ret_list;
}
MultiRtsReplay::MultiRtsReplay()
{
	cur_play_time_ = 0;
	max_play_time_ = 0;
	play_speed_ = 1;
}

MultiRtsReplay::~MultiRtsReplay()
{
}

std::wstring MultiRtsReplay::GetSkinFolder()
{
	return L"rts";
}

std::wstring MultiRtsReplay::GetSkinFile()
{
	return L"multi_rts_replay.xml";
}

std::wstring MultiRtsReplay::GetWindowId() const
{
	return kClassName;
}
ui::Control* MultiRtsReplay::CreateControl(const std::wstring& pstrClass)
{
	if (pstrClass == _T("BoardLayer"))
	{
		return new BoardLayerControl();
	}
	return NULL;
}

LRESULT MultiRtsReplay::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	return __super::HandleMessage(uMsg, wParam, lParam);
}

void MultiRtsReplay::InitWindow()
{
	std::wstring title_text = L"多人白板回放";
	SetTaskbarTitle(title_text);
	Label* title = (Label*)FindControl(L"title");
	title->SetText(title_text);

	m_pRoot->AttachBubbledEvent(ui::kEventAll, nbase::Bind(&MultiRtsReplay::Notify, this, std::placeholders::_1));
	m_pRoot->AttachBubbledEvent(ui::kEventClick, nbase::Bind(&MultiRtsReplay::OnClicked, this, std::placeholders::_1));
	m_pRoot->AttachBubbledEvent(ui::kEventSelect, nbase::Bind(&MultiRtsReplay::OnClicked, this, std::placeholders::_1));
	m_pRoot->AttachBubbledEvent(ui::kEventUnSelect, nbase::Bind(&MultiRtsReplay::OnClicked, this, std::placeholders::_1));

	board_box_ = (Box*)FindControl(L"board_box");
	btn_start_ = (Button*)FindControl(L"btn_start");
	btn_pause_ = (Button*)FindControl(L"btn_pause");
	btn_stop_ = (Button*)FindControl(L"btn_stop");
	time_pos_ = (Label*)FindControl(L"time_pos");

	speed_combo_ = (Combo*)FindControl(L"play_speed");
	for (int i = 0; i < 5; ++i)
	{
		ListContainerElement* label = new ListContainerElement;
		label->SetClass(L"listitem");
		label->SetFixedHeight(22);
		label->SetTextPadding(UiRect(10, 1, 30, 1));
		label->SetUTF8Text(nbase::StringPrintf("X%d", 1 << i));

		speed_combo_->Add(label);
	}
	speed_combo_->SelectItem(0);

	OnStop();
}

void MultiRtsReplay::OnFinalMessage(HWND hWnd)
{
	__super::OnFinalMessage(hWnd);
}

bool MultiRtsReplay::Notify(ui::EventArgs* msg)
{
	std::wstring name = msg->pSender->GetName();
	if (msg->Type == ui::kEventSelect)
	{
	}
	return true;
}

bool MultiRtsReplay::OnClicked(ui::EventArgs* arg)
{
	std::wstring name = arg->pSender->GetName();		
	if(name == L"btn_load")
	{
		OnBtnFile();
	}
	else if (name == L"btn_end")
	{
		cur_play_time_ = max_play_time_;
		OnPlayStepTimer();
	}
	else if (name == L"btn_start")
	{
		OnPlay();
	}
	else if (name == L"btn_pause")
	{
		OnPause();
	}
	else if (name == L"btn_stop")
	{
		OnStop();
	}
	else if (name == L"member_show")
	{
		bool show = ((CheckBox*)arg->pSender)->IsSelected();
		std::string name = arg->pSender->GetParent()->GetUTF8Name();
		Control* board = AddBoardLayerByUid(name);
		if (board)
		{
			board->SetVisible(show);
		}
	}
	else if (name == L"play_speed")
	{
		int k = ((ui::Combo*)arg->pSender)->GetCurSel();
		play_speed_ = 1 << k;
	}
	return true;
}

int MultiRtsReplay::OnParseData(std::string src_data, std::vector<MultiBoardOpInfo>& info_lists, int64_t &min_time, int64_t &max_time)
{
	int count = 0;
	min_time = -1;
	max_time = 0;
	info_lists.clear();
	while (src_data.size() > 0)
	{
		//录制存储的格式变为：
		//长度（uint32） + 时间戳（uint32） + 内容
		//	长度 = 4 + 4 + 内容长度
		int size = *(int*)src_data.c_str();
		int time = *(int*)(src_data.c_str() + 4);
		if (size > src_data.size())
		{
			break;
		}
		std::string data = src_data.substr(8, size - 8);
		src_data = src_data.substr(size);
		int pos = data.find(';');
		while (pos != -1)
		{
			bool break_flag = false;
			bool continue_flag = false;
			std::string cur_data = data.substr(0, pos);
			data = data.substr(pos + 1);
			pos = data.find(';');

			ui::MultiBoardOpInfo info;
			info.time_ = time;
			int pos_type = cur_data.find(":");
			if (pos_type > 0)
			{
				info.draw_op_type_ = (ui::MultiBoardOpType)atoi(cur_data.substr(0, pos_type).c_str());
				cur_data = cur_data.substr(pos_type + 1);
			}
			else
			{
				info.draw_op_type_ = (ui::MultiBoardOpType)atoi(cur_data.c_str());
			}
			std::list<std::string> param_list = BoardStringTokenize(cur_data.c_str(), ",");
			if (param_list.size() > 0)
			{
				auto it = param_list.begin();
				switch (info.draw_op_type_)
				{
				case kMultiBoardOpStart:
				case kMultiBoardOpMove:
				case kMultiBoardOpEnd:
					if (param_list.size() >= 3)
					{
						info.x_ = atof(it->c_str());
						++it;
						info.y_ = atof(it->c_str());
						++it;
						info.clr_ = atoi(it->c_str());
					}
					break;
				case kMultiBoardOpUndo:
				case kMultiBoardOpClear:
				case kMultiBoardOpClearCb:
					break;
				//case kMultiBoardOpSyncPrepCb:
				//	info.draw_op_type_ = kMultiBoardOpClear;
				//	break;
				case kMultiBoardOpSync:
					break_flag = true;
					break;
				default:
					continue_flag = true;
					break;
				}
			}
			if (break_flag)
			{
				break;
			} 
			else if (continue_flag)
			{
				continue;
			} 
			else
			{
				info_lists.push_back(info);
				max_play_time_ = max(max_play_time_, time);
				if (min_time < 0)
				{
					min_time = time;
				}
				max_time = time;
			}
		}
	}
	return count;
}
void MultiRtsReplay::OnBtnFile()
{
	OnStop();

	std::wstring file_type = L"文件格式(*.*)";
	LPCTSTR filter = L"*.*";
	std::map<LPCTSTR, LPCTSTR> filters;
	filters[file_type.c_str()] = filter;

	CFileDialogEx::FileDialogCallback2 cb = nbase::Bind(&MultiRtsReplay::OnFileSelected, this, std::placeholders::_1, std::placeholders::_2);

	CFileDialogEx* file_dlg = new CFileDialogEx();
	file_dlg->SetFilter(filters);
	file_dlg->SetParentWnd(m_hWnd);
	file_dlg->AyncShowOpenFileDlg(cb);
}
void MultiRtsReplay::OnFileSelected(BOOL ret, std::wstring file_path)
{
	if (ret)
	{
		std::string file_data;
		if (nbase::ReadFileToString(file_path, file_data))
		{
			std::wstring file_name;
			nbase::FilePathApartFileName(file_path, file_name);
			std::string file_name_temp = nbase::UTF16ToUTF8(file_name);
			MultiBoardRePlayInfo info;
			int64_t min_time, max_time;
			OnParseData(file_data, info.info_list_, min_time, max_time);
			map_uid_info_lists_[file_name_temp] = info;

			ListBox* members_list = (ListBox*)FindControl(L"members_list");
			if (members_list)
			{
				Box* member = (Box*)members_list->FindSubControl(file_name);
				if (member != nullptr)
				{
					CheckBox* member_show = (CheckBox*)member->FindSubControl(L"member_show");
					member_show->Selected(true, true);
				}
				else
				{
					member = ui::GlobalManager::CreateBoxWithCache(L"rts/multi_replay_member_item.xml");
					members_list->Add(member);
					member->SetName(file_name);
					Label* name_ctr = (Label*)member->FindSubControl(L"name");
					if (name_ctr)
					{
						name_ctr->SetText(file_name);
					}
					Label* time_ctr = (Label*)member->FindSubControl(L"time");
					if (time_ctr)
					{
						std::wstring time_tip = nbase::StringPrintf(L"%lld--%lld", min_time / 1000, max_time / 1000);
						time_ctr->SetText(time_tip);
					}
					AddBoardLayerByUid(file_name_temp);
				}
			}
			if (cur_play_time_ >= max_play_time_)
			{
				cur_play_time_ = max_play_time_;
			}
			time_pos_->SetText(nbase::StringPrintf(L"%lld/%lld", cur_play_time_ / 1000, max_play_time_ / 1000));
		}
	}
}
void MultiRtsReplay::OnPlay()
{
	auto_play_weakflag_.Cancel();
	if (cur_play_time_ == 0)
	{
		for (auto &it : map_uid_board_lists_)
		{
			it.second->BoardClear();
		}
	}
	StdClosure clouse = nbase::Bind(&MultiRtsReplay::OnPlayStepTimer, this);
	auto weak_cb = auto_play_weakflag_.ToWeakCallback(clouse);
	nbase::ThreadManager::PostRepeatedTask(weak_cb, nbase::TimeDelta::FromMilliseconds(PLAY_TIME_STAMP));
	btn_start_->SetEnabled(false);
	btn_pause_->SetEnabled(true);
	btn_stop_->SetEnabled(true);
}
void MultiRtsReplay::OnPause()
{
	auto_play_weakflag_.Cancel();
	btn_start_->SetEnabled(true);
	btn_pause_->SetEnabled(false);
	btn_stop_->SetEnabled(true);
}
void MultiRtsReplay::OnStop()
{
	auto_play_weakflag_.Cancel();
	cur_play_time_ = 0;
	for (auto &it : map_uid_info_lists_)
	{
		it.second.pos_ = 0;
	}
	btn_start_->SetEnabled(true);
	btn_pause_->SetEnabled(false);
	btn_stop_->SetEnabled(false);
}
void MultiRtsReplay::OnPlayStepTimer()
{
	if (play_speed_ < 1)
	{
		play_speed_ = 1;
	}

	cur_play_time_ += PLAY_TIME_STAMP * play_speed_;
	for (auto &it : map_uid_info_lists_)
	{
		MultiBoardRePlayInfo &info = it.second;
		ui::BoardLayerControl* board = AddBoardLayerByUid(it.first);
		if (board)
		{
			std::list<MultiBoardOpInfo> info_list;
			while (info.info_list_.size() > info.pos_ && info.info_list_[info.pos_].time_ < cur_play_time_)
			{
				info_list.push_back(info.info_list_[info.pos_]);
				info.pos_++;
			}
			board->OnRecvDrawInfos(info_list);
		}
	}
	bool flag_end = false;
	if (cur_play_time_ >= max_play_time_)
	{
		cur_play_time_ = max_play_time_;
		flag_end = true;
	}
	time_pos_->SetText(nbase::StringPrintf(L"%lld/%lld", cur_play_time_ / 1000, max_play_time_ / 1000));
	if (flag_end)
	{
		OnStop();
	}
}
ui::BoardLayerControl* MultiRtsReplay::AddBoardLayerByUid(const std::string& id, bool auto_add)
{
	auto it = map_uid_board_lists_.find(id);
	if (it != map_uid_board_lists_.end())
	{
		return it->second;
	}
	else if (auto_add)
	{
		ui::BoardLayerControl* board_layer = new ui::BoardLayerControl();
		board_box_->AddAt(board_layer, 0);
		board_layer->SetFixedWidth(DUI_LENGTH_STRETCH, false);
		board_layer->SetFixedHeight(DUI_LENGTH_STRETCH);
		map_uid_board_lists_[id] = board_layer;
		return board_layer;
	}
	return nullptr;
}


}