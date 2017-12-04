#include "doc_form.h"
#include "gui/doc/doc_item.h"
#include "module/doc/doc_manager.h"
#include "shared/modal_wnd/file_dialog_ex.h"

namespace nim_chatroom
{

const LPTSTR DocForm::kClassName = L"DocForm";

DocForm::DocForm()
{
	doc_count_ = 0;
	is_getting_docs_info_ = false;
}

DocForm::~DocForm()
{
}

std::wstring DocForm::GetSkinFolder()
{
	return L"chatroom";
}

std::wstring DocForm::GetSkinFile()
{
	return L"doc_form.xml";
}

std::wstring DocForm::GetWindowClassName() const
{
	return kClassName;
}

std::wstring DocForm::GetWindowId() const
{
	return kClassName;
}

UINT DocForm::GetClassStyle() const
{
	return (UI_CLASSSTYLE_FRAME | CS_DBLCLKS);
}

void DocForm::InitWindow()
{
	m_pRoot->AttachBubbledEvent(ui::kEventClick, nbase::Bind(&DocForm::OnClicked, this, std::placeholders::_1));

	doc_list_ = (ui::ListBox*)FindControl(L"list_docs");
	doc_list_->AttachScrollChange(nbase::Bind(&DocForm::OnDocListScroll, this, std::placeholders::_1));

	unregister_cb.Add(nim_comp::DocManager::GetInstance()->RegDocInfoNotifyCallback(nbase::Bind(&DocForm::OnDocInfoNotifyCallback, this, std::placeholders::_1, std::placeholders::_2)));
	unregister_cb.Add(nim_comp::DocManager::GetInstance()->RegGetDocInfosCallback(nbase::Bind(&DocForm::OnGetDocInfosCallback, this, std::placeholders::_1, std::placeholders::_2)));

	nim_comp::DocManager::GetInstance()->GetDocInfoList("");
}

bool DocForm::OnClicked(ui::EventArgs * msg)
{
	std::wstring name = msg->pSender->GetName();
	if (name == L"btn_upload")
	{
		std::wstring file_type = ui::MutiLanSupport::GetInstance()->GetStringViaID(L"STRING_DOC_FILE");
		LPCTSTR filter = L"*.pdf;*.ppt;*.pptx";
		std::wstring text = nbase::StringPrintf(L"%s(%s)", file_type.c_str(), filter);
		std::map<LPCTSTR, LPCTSTR> filters;
		filters[text.c_str()] = filter;

		CFileDialogEx::FileDialogCallback2 cb = nbase::Bind(&DocForm::OnDocFileSelected, this, std::placeholders::_1, std::placeholders::_2);

		CFileDialogEx* file_dlg = new CFileDialogEx();
		file_dlg->SetFilter(filters);
		file_dlg->SetMultiSel(FALSE);
		file_dlg->SetParentWnd(this->GetHWND());
		file_dlg->AyncShowOpenFileDlg(cb);
	}

	return true;
}

bool DocForm::OnDocListScroll(ui::EventArgs* msg)
{
	if (msg->pSender == doc_list_)
	{	
		if (doc_list_->IsAtEnd() && doc_list_->GetCount() < doc_count_ && !is_getting_docs_info_)
		{
			DocItem *item = static_cast<DocItem*>(doc_list_->GetItemAt(doc_list_->GetCount()-1));
			if (item && !item->GetDocId().empty())
			{
				is_getting_docs_info_ = true;
				nim_comp::DocManager::GetInstance()->GetDocInfoList(item->GetDocId());
			}		
		}
	}

	return true;
}

void DocForm::OnDocFileSelected(BOOL ret, std::wstring wfile_path)
{
	if (ret)
	{
		std::string file_path;
		std::string file_name;
		nim::NIMDocTranscodingFileType file_type;
		if (GetUploadFileInfo(wfile_path, file_path, file_name, file_type))
		{
			std::string upload_id = nim_comp::DocManager::GetInstance()->UploadDoc("", file_path, file_name, file_type);
			CreateStartUploadDocItem(upload_id, file_path, file_name, file_type);
		}
	}
}

bool DocForm::GetUploadFileInfo(const std::wstring& file_path, std::string& out_file_path, std::string& out_file_name, nim::NIMDocTranscodingFileType& out_file_type)
{
	if (!nbase::FilePathIsExist(file_path, false) || 0 == nbase::GetFileSize(file_path))
		return false;

	std::wstring file_ext;
	nbase::FilePathExtension(file_path, file_ext);
	int file_type = (nim::NIMDocTranscodingFileType)GetFileType(file_ext);
	if (0 == file_type)
		return false;

	std::wstring file_name;
	nbase::FilePathApartFileName(file_path, file_name);
	if (file_name.empty())
		return false;

	out_file_path = nbase::UTF16ToUTF8(file_path);
	out_file_name = nbase::UTF16ToUTF8(file_name);
	out_file_type = (nim::NIMDocTranscodingFileType)file_type;
	return true;
}

int DocForm::GetFileType(std::wstring file_ext)
{
	nbase::LowerString(file_ext);
	if (file_ext == L".ppt")
		return nim::kNIMDocTranscodingFileTypePPT;
	else if (file_ext == L".pptx")
		return nim::kNIMDocTranscodingFileTypePPTX;
	else if (file_ext == L".pdf")
		return nim::kNIMDocTranscodingFileTypePDF;
	else
		return 0;
}

DocItem* DocForm::CreateStartUploadDocItem(const std::string& upload_id, const std::string& file_path, const std::string& file_name, nim::NIMDocTranscodingFileType file_type)
{
	DocItem *item = new DocItem;
	ui::GlobalManager::FillBoxWithCache(item, L"chatroom//doc_item.xml");
	if (item)
	{
		doc_list_->AddAt(item, 0);
		item->InitControls();

		nim::DocTransInfo info;
		info.state_ = nim::kNIMDocTranscodingStatePreparing;
		info.upload_file_path = file_path;
		info.name_ = file_name;
		info.source_type_ = file_type;
		item->Init(info, upload_id);

		doc_list_->SetScrollPosY(0);
	}

	return item;
}

void DocForm::OnGetDocInfosCallback(int32_t count, const std::list<nim::DocTransInfo>& doc_infos)
{
	doc_count_ = count;
	is_getting_docs_info_ = false;

	for (auto it = doc_infos.begin(); it != doc_infos.end(); ++it)
	{
		// 去重
		int count = doc_list_->GetCount();
		for (int i = 0; i < count; i++)
		{
			DocItem *item = static_cast<DocItem*>(doc_list_->GetItemAt(i));
			if (item && item->GetDocId() == it->id_)
			{
				continue;
			}
		}

		DocItem *item = new DocItem;
		ui::GlobalManager::FillBoxWithCache(item, L"chatroom//doc_item.xml");
		if (item)
		{
			doc_list_->Add(item);
			item->InitControls();
			item->Init(*it, nim_comp::DocManager::GetInstance()->GetUploadId(it->id_));
		}
	}
}

void DocForm::OnDocInfoNotifyCallback(int32_t code, const nim::DocTransInfo& doc_info)
{
	// 根据文档id找到对应的列表项控件
	int count = doc_list_->GetCount();
	for (int i = 0; i < count; i++)
	{
		DocItem *item = static_cast<DocItem*>(doc_list_->GetItemAt(i));
		if (item && item->GetDocId() == doc_info.id_)
		{
			item->OnDocInfoNotifyCallback(code, doc_info);
			return;
		}
	}
}

}