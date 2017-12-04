#include "doc_item.h"
#include "gui/doc/doc_form.h"
#include "module/doc/doc_manager.h"
using namespace ui;

namespace nim_chatroom
{

DocItem::DocItem()
{

}

DocItem::~DocItem()
{

}

void DocItem::InitControls()
{
	doc_image_ = (Control*) this->FindSubControl(L"doc_image");
	doc_title_ = (Label*) this->FindSubControl(L"doc_title");
	tab_switch_ = (TabBox*) this->FindSubControl(L"tab_switch");
	tab_download_controls_ = (TabBox*) this->FindSubControl(L"tab_download_controls");
	btn_download_ = (Button*) this->FindSubControl(L"btn_download");
	btn_download_use_ = (Button*) this->FindSubControl(L"btn_download_use");
	btn_downloading_ = (Button*) this->FindSubControl(L"btn_downloading");
	btn_download_retry_ = (Button*) this->FindSubControl(L"btn_download_retry");
	tab_upload_controls_ = (TabBox*) this->FindSubControl(L"tab_upload_controls");
	upload_prog_tip_ = (Label*) this->FindSubControl(L"upload_prog_tip");
	upload_error_tip_ = (Label*) this->FindSubControl(L"upload_error_tip");
	btn_upload_retry_ = (Button*) this->FindSubControl(L"btn_upload_retry");
	btn_upload_cancel_ = (Button*) this->FindSubControl(L"btn_upload_cancel");

	btn_delete_ = (Button*) this->FindSubControl(L"btn_delete");
	prog_upload_ = (Progress*) this->FindSubControl(L"prog_upload");
	prog_transcode_ = (Progress*) this->FindSubControl(L"prog_transcode");

	btn_download_->AttachClick(nbase::Bind(&DocItem::OnBtnDownloadClick, this, std::placeholders::_1));
	btn_download_use_->AttachClick(nbase::Bind(&DocItem::OnBtnDownloadUseClick, this, std::placeholders::_1));
	btn_download_retry_->AttachClick(nbase::Bind(&DocItem::OnBtnDownloadRetryClick, this, std::placeholders::_1));
	btn_delete_->AttachClick(nbase::Bind(&DocItem::OnBtnDeleteClick, this, std::placeholders::_1));

	btn_upload_retry_->AttachClick(nbase::Bind(&DocItem::OnBtnUploadRetryClick, this, std::placeholders::_1));
	btn_upload_cancel_->AttachClick(nbase::Bind(&DocItem::OnBtnUploadCancelClick, this, std::placeholders::_1));
}

void DocItem::Init(const nim::DocTransInfo& info, const std::string& upload_id)
{
	doc_info_ = info;
	SetUTF8Name(info.id_);

	// 初始化文档图标和标题
	InitDocImageAndTitle();

	if (doc_info_.state_ == nim::kNIMDocTranscodingStateCompleted)
	{
		SwitchToDownloadMode(true);
		ShowDownloadUI(DocItem::kDocItemDownloadStateInit);

		// 开始搜索相关的文档文件是否存在
		nim_comp::DocManager::GetInstance()->IsDownloadedDoc(info, nim::kNIMDocTranscodingQualityHigh, 0, nbase::Bind(&DocItem::OnCheckDocDownloadedCallback, this, std::placeholders::_1));

	}
	else if (doc_info_.state_ == nim::kNIMDocTranscodingStateOngoing)
	{
		// 如果打开窗口时，文档正在转码中，则只提示“转码中”，不显示进度(因为进度是模拟的，显示也没有意义)
		SwitchToDownloadMode(false);
		this->ShowUploadUI(DocItem::kDocItemUploadStateTranscoding);
		prog_upload_->SetVisible(false);
		prog_transcode_->SetVisible(false);
	}
	else if (doc_info_.state_ == nim::kNIMDocTranscodingStatePreparing)
	{
		if (nim_comp::DocManager::GetInstance()->RegUploadDocCallback(upload_id, 
			nbase::Bind(&DocItem::OnDocUploadCompeleteCallback, this, std::placeholders::_1, std::placeholders::_2),
			nbase::Bind(&DocItem::OnDocUploadProgressCallback, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)))
		{
			SwitchToDownloadMode(false);
			ShowUploadUI(DocItem::kDocItemUploadStatePrepare);
		}
		else
		{
			if (doc_info_.continue_upload_state_ == nim::kNIMDocContinueUploadCompleted)
			{
				// 如果打开窗口时，文档为准备状态，并且这个文档是刚才本地已经上传过的，则显示为转码中状态
				// 如果打开窗口时，文档正在转码中，则只提示“转码中”，不显示进度(因为进度是模拟的，显示也没有意义)
				SwitchToDownloadMode(false);
				this->ShowUploadUI(DocItem::kDocItemUploadStateTranscoding);
				prog_upload_->SetVisible(false);
				prog_transcode_->SetVisible(false);
			}
			else
			{
				SwitchToDownloadMode(false);
				this->ShowUploadUI(DocItem::kDocItemUploadStateFaild);
			}	
		}
	}
	else if (doc_info_.state_ == nim::kNIMDocTranscodingStateTimeout ||
			doc_info_.state_ == nim::kNIMDocTranscodingStateFailed)
	{
		SwitchToDownloadMode(false);
		this->ShowUploadUI(DocItem::kDocItemUploadStateTranscodeFaild);
	}
}

void DocItem::SwitchToDownloadMode(bool download_or_upload)
{
	if (download_or_upload)
	{
		tab_switch_->SelectItem(0);
		prog_upload_->SetVisible(false);
		prog_transcode_->SetVisible(false);
	}
	else
	{
		tab_switch_->SelectItem(1);
		prog_upload_->SetVisible(true);
		prog_transcode_->SetVisible(true);
	}
}

void DocItem::ShowUploadUI(DocItemUploadState state)
{
	switch (state)
	{
	case DocItem::kDocItemUploadStatePrepare:
	{
		tab_upload_controls_->SelectItem(0);
		upload_prog_tip_->SetText(L"准备上传中");
		prog_upload_->SetVisible(true);
		prog_transcode_->SetVisible(true);
	}
		break;
	case DocItem::kDocItemUploadStateUploading:
	{
		tab_upload_controls_->SelectItem(0);
		prog_upload_->SetVisible(true);
		prog_transcode_->SetVisible(true);
	}
		break;
	case DocItem::kDocItemUploadStateTranscoding:
	{
		tab_upload_controls_->SelectItem(0);	
		upload_prog_tip_->SetText(L"转码中...");
		prog_upload_->SetVisible(true);
		prog_transcode_->SetVisible(true);
	}
		break;
	case DocItem::kDocItemUploadStateFaild:
	{
		tab_upload_controls_->SelectItem(1);
		upload_error_tip_->SetText(L"上传失败!");
		prog_upload_->SetValue(0);
		prog_upload_->SetVisible(false);
		prog_transcode_->SetValue(0);
		prog_transcode_->SetVisible(true);
	}
		break;
	case DocItem::kDocItemUploadStateTranscodeFaild:
	{
		tab_upload_controls_->SelectItem(1);
		upload_error_tip_->SetText(L"转码失败!");
		prog_upload_->SetValue(0);
		prog_upload_->SetVisible(false);
		prog_transcode_->SetValue(0);
		prog_transcode_->SetVisible(true);
	}
		break;
	default:
		break;
	}
}

void DocItem::ShowDownloadUI(DocItemDownloadState state)
{
	switch (state)
	{
	case DocItem::kDocItemDownloadStateInit:
		tab_download_controls_->SelectItem(0);
		break;
	case DocItem::kDocItemDownloadStateDownload:
		tab_download_controls_->SelectItem(1);
		break;
	case DocItem::kDocItemDownloadStateDownloading:
		tab_download_controls_->SelectItem(2);
		break;
	case DocItem::kDocItemDownloadStateRetry:
		tab_download_controls_->SelectItem(3);
		break;
	case DocItem::kDocItemDownloadStateUse:
		tab_download_controls_->SelectItem(4);
		break;
	default:
		break;
	}
}

bool DocItem::OnBtnDownloadClick(ui::EventArgs* arg)
{
	for (int i = 1; i <= doc_info_.page_num_; i++)
	{
		nim::NOS::DownloadMediaCallback cb = nbase::Bind(&DocItem::OnDownlaodDocPageCallback, this, doc_info_.id_, i, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3, std::placeholders::_4);
		nim_comp::DocManager::GetInstance()->DownloadDocPage(doc_info_, i, nim::kNIMDocTranscodingQualityHigh, cb);
		ShowDownloadUI(kDocItemDownloadStateDownloading);
	}

	return true;
}

bool DocItem::OnBtnDownloadUseClick(ui::EventArgs* arg)
{
	nim_comp::DocManager::GetInstance()->InvokeUseDocCallback(doc_info_);
	this->GetWindow()->Close();
	return true;
}

bool DocItem::OnBtnDownloadRetryClick(ui::EventArgs* arg)
{
	OnBtnDownloadClick(arg);

	return true;
}

bool DocItem::OnBtnDeleteClick(ui::EventArgs* arg)
{
	MsgboxCallback cb = [=](MsgBoxRet ret)
	{
		if (ret == MB_YES)
		{
			nim::DocTrans::DeleteInfo(doc_info_.id_, "", nbase::Bind(&nim_comp::DocManager::OnDeleteDocInfoCallback, nim_comp::DocManager::GetInstance(),
				doc_info_.id_, "download_delete", std::placeholders::_1, std::placeholders::_2));

			nim_comp::DocManager::GetInstance()->DeleteDoc(doc_info_, nim::kNIMDocTranscodingQualityHigh);
			this->GetParent()->Remove(this);
		}
	};

	ShowMsgBox(this->GetWindow()->GetHWND(), L"确认删除这个文件吗？", ToWeakCallback(cb), L"删除确认", L"删除", L"取消");

	return true;
}

bool DocItem::OnBtnUploadRetryClick(ui::EventArgs* arg)
{
	std::string file_path;
	std::string file_name;
	nim::NIMDocTranscodingFileType file_type;
	if (!DocForm::GetUploadFileInfo(nbase::UTF8ToUTF16(doc_info_.upload_file_path), file_path, file_name, file_type))
	{
		ShowMsgBox(this->GetWindow()->GetHWND(), L"无法找到本地文档！", MsgboxCallback(), L"错误", L"确认", L"");
		this->GetParent()->Remove(this);

		nim::DocTrans::DeleteInfo(doc_info_.id_, "", nbase::Bind(&nim_comp::DocManager::OnDeleteDocInfoCallback, nim_comp::DocManager::GetInstance(),
			doc_info_.id_, "retry_cannot_find_file", std::placeholders::_1, std::placeholders::_2));
		return true;
	}

	// 如果上传完成了，则删除文档，重新上传；否则续传
	std::string upload_id;
	if (doc_info_.continue_upload_state_ == nim::kNIMDocContinueUploadCompleted || doc_info_.continue_upload_state_ == nim::kNIMDocContinueUploadNone)
	{
		nim::DocTrans::DeleteInfo(doc_info_.id_, "", nbase::Bind(&nim_comp::DocManager::OnDeleteDocInfoCallback, nim_comp::DocManager::GetInstance(),
			doc_info_.id_, "retry_transcode_faild", std::placeholders::_1, std::placeholders::_2));
		upload_id = nim_comp::DocManager::GetInstance()->UploadDoc("", file_path, file_name, file_type);
	}
	else
	{
		upload_id = nim_comp::DocManager::GetInstance()->UploadDoc(doc_info_.id_, file_path, file_name, file_type);
	}

	if (nim_comp::DocManager::GetInstance()->RegUploadDocCallback(upload_id,
		nbase::Bind(&DocItem::OnDocUploadCompeleteCallback, this, std::placeholders::_1, std::placeholders::_2),
		nbase::Bind(&DocItem::OnDocUploadProgressCallback, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3)))
	{
		SwitchToDownloadMode(false);
		ShowUploadUI(DocItem::kDocItemUploadStatePrepare);
	}

	return true;
}

bool DocItem::OnBtnUploadCancelClick(ui::EventArgs* arg)
{
	nim::NOS::StopUploadResourceEx(doc_info_.id_);
	nim::DocTrans::DeleteInfo(doc_info_.id_, "", nbase::Bind(&nim_comp::DocManager::OnDeleteDocInfoCallback, nim_comp::DocManager::GetInstance(),
		doc_info_.id_, "upload_cancel", std::placeholders::_1, std::placeholders::_2));

	this->GetParent()->Remove(this);
	return true;
}

void DocItem::SetTranscodeProg(int value)
{
	double now = (double)value / 100.0;
	prog_transcode_->SetValue(now);

	std::wstring tip;
	nbase::StringPrintf(tip, L"转码中%.1lf%%", now);
	upload_prog_tip_->SetText(tip.c_str());

	// 因为是模拟的动画，所以达到99%后就停止
	if (now > 99.0 && transcode_animation_.IsPlaying() && !transcode_animation_.IsTranscodeCompelete())
		transcode_animation_.Reset();
}

void DocItem::StartTranscodAnimation()
{
	transcode_animation_.Reset();
	
	transcode_animation_.SetStartValue(0);
	transcode_animation_.SetEndValue(TranscodeAnimationPlayer::kEndValue);

	transcode_animation_.SetTotalMillSeconds(1000 * 3600); // 设置最大时间为1小时
	std::function<void(int)> playCallback = nbase::Bind(&DocItem::SetTranscodeProg, this, std::placeholders::_1);
	transcode_animation_.SetCallback(playCallback);
	transcode_animation_.Start();
}

void DocItem::EndTranscodAnimation()
{
	int current_value = transcode_animation_.GetCurrentValue();
	transcode_animation_.Reset();

	transcode_animation_.SetTranscodeCompelete();
	transcode_animation_.SetStartValue(current_value);
	transcode_animation_.SetEndValue(TranscodeAnimationPlayer::kEndValue);

	transcode_animation_.SetTotalMillSeconds(1000 * 1); // 1秒执行完剩余的动画效果
	std::function<void(int)> playCallback = nbase::Bind(&DocItem::SetTranscodeProg, this, std::placeholders::_1);
	transcode_animation_.SetCallback(playCallback);
	transcode_animation_.Start();
}

void DocItem::OnDownlaodDocPageCallback(const std::string& doc_id, int32_t page_num, nim::NIMResCode res_code, const std::string& file_path, const std::string& call_id, const std::string& res_i)
{
	if (doc_id != doc_info_.id_)
		return;

	if (res_code == nim::kNIMResSuccess)
	{
		// 开始搜索相关的文档文件是否存在
		auto cb = [this](bool is_downloaded)
		{
			if (is_downloaded)
			{
				ShowDownloadUI(kDocItemDownloadStateUse);
				InitDocImageAndTitle();
			}
		};
		nim_comp::DocManager::GetInstance()->IsDownloadedDoc(doc_info_, nim::kNIMDocTranscodingQualityHigh, 0, nbase::Bind(ToWeakCallback(cb), std::placeholders::_1));
	}
	else
	{
		ShowDownloadUI(kDocItemDownloadStateRetry);
	}
}

void DocItem::OnCheckDocDownloadedCallback(bool is_downloaded)
{
	if (is_downloaded)
	{
		ShowDownloadUI(kDocItemDownloadStateUse);
	}
	else
	{
		ShowDownloadUI(kDocItemDownloadStateDownload);
	}
}

void DocItem::OnDocUploadCompeleteCallback(nim::NIMResCode res_code, const nim::UploadMediaResult& result)
{
	if (res_code == 0)
	{
		// 获取token失败
		doc_info_.continue_upload_state_ = nim::kNIMDocContinueUploadNone;
		ShowUploadUI(kDocItemUploadStateFaild);
	}
	else if (res_code == nim::kNIMResSuccess)
	{
		doc_info_.continue_upload_state_ = nim::kNIMDocContinueUploadCompleted;
		if (result.res_id_.empty())
		{
			ShowUploadUI(kDocItemUploadStateFaild);
		}
		else
		{
			doc_info_.id_ = result.res_id_;
			ShowUploadUI(kDocItemUploadStateTranscoding);
			StartTranscodAnimation();	
		}
	}
	else
	{
		// 上传失败
		doc_info_.continue_upload_state_ = nim::kNIMDocContinueUploadFailed;
		ShowUploadUI(kDocItemUploadStateFaild);
	}
}

void DocItem::OnDocUploadProgressCallback(int64_t completed_size, int64_t file_size, const nim::ProgressData& data)
{
	if (file_size == 0)
		return;

	if (completed_size == 0)
	{
		// 有上传进度，且file_size为0则标识获取token成功，并且正在上传
		ShowUploadUI(kDocItemUploadStateUploading);
		upload_prog_tip_->SetText(L"上传中0%");

		if (!data.res_id_.empty())
			doc_info_.id_ = data.res_id_;
	}
	else
	{
		double progress_value = (double)completed_size * 100 / (double)file_size;
		std::wstring tip;
		nbase::StringPrintf(tip, L"上传中%.1lf%%", progress_value);
		upload_prog_tip_->SetText(tip.c_str());
		prog_upload_->SetValue(int(progress_value));
	}
}

void DocItem::OnDocInfoNotifyCallback(int32_t code, const nim::DocTransInfo& doc_info)
{
	if (code == nim::kNIMResSuccess)
	{
		doc_info_.state_ = doc_info.state_;

		if (doc_info.state_ == nim::kNIMDocTranscodingStateCompleted)
		{
			// 转码完成则初始化控件信息
			EndTranscodAnimation();
			nbase::ThreadManager::PostDelayedTask(kThreadUI, nbase::Bind(&DocItem::Init, this, doc_info, ""), nbase::TimeDelta::FromSeconds(2));
		}
		else if (doc_info.state_ == nim::kNIMDocTranscodingStateOngoing ||
			doc_info.state_ == nim::kNIMDocTranscodingStatePreparing)
		{		
			this->ShowUploadUI(DocItem::kDocItemUploadStateTranscoding);
		}
		else if (doc_info.state_ == nim::kNIMDocTranscodingStateTimeout ||
			doc_info.state_ == nim::kNIMDocTranscodingStateFailed)
		{
			transcode_animation_.Reset();
			this->ShowUploadUI(DocItem::kDocItemUploadStateTranscodeFaild);
		}
	}
	else
	{
		transcode_animation_.Reset();
		this->ShowUploadUI(DocItem::kDocItemUploadStateTranscodeFaild);
	}
}

void DocItem::InitDocImageAndTitle()
{
	doc_title_->SetUTF8Text(doc_info_.name_);
	if (doc_info_.page_num_ > 0)
	{
		nim::NOS::DownloadMediaCallback cb = nbase::Bind(&DocItem::OnDownlaodDocImageCallback, this, doc_info_.id_, 1, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3, std::placeholders::_4);
		nim_comp::DocManager::GetInstance()->DownloadDocPage(doc_info_, 1, nim::kNIMDocTranscodingQualityLow, cb);
	}
}

void DocItem::OnDownlaodDocImageCallback(const std::string& doc_id, int32_t page_num, nim::NIMResCode res_code, const std::string& file_path, const std::string& call_id, const std::string& res_i)
{
	auto cb = [this](bool is_downloaded)
	{
		if (is_downloaded)
		{
			std::wstring path = nim_comp::DocManager::GetInstance()->GetDocPagePath(doc_info_, 1, nim::kNIMDocTranscodingQualityLow);
			doc_image_->SetBkImage(path);
		}
	};
	nim_comp::DocManager::GetInstance()->IsDownloadedDoc(doc_info_, nim::kNIMDocTranscodingQualityLow, 1, nbase::Bind(ToWeakCallback(cb), std::placeholders::_1));
}

}