#include "doc_manager.h"
#include "callback/doc/doc_callback.h"

namespace nim_comp
{

DocManager::DocManager()
{

}

DocManager::~DocManager()
{

}

void DocManager::GetDocInfoList(const std::string& doc_id)
{
	nim::DocTrans::GetInfoList(doc_id, 30, "", nbase::Bind(DocTransCallback::DocInfosCallback, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3));
}

void DocManager::OnDocInfoNotify(int32_t code, const nim::DocTransInfo& doc_info)
{
	assert(nbase::MessageLoop::current()->ToUIMessageLoop());
	for (auto& it : doc_info_notify_cb_list_)
		(*(it.second))(code, doc_info);
}

void DocManager::OnGetDocInfosCallback(int32_t code, int32_t count, const std::list<nim::DocTransInfo>& doc_infos)
{
	if (code == nim::kNIMResSuccess)
	{
		assert(nbase::MessageLoop::current()->ToUIMessageLoop());
		for (auto& it : get_doc_infos_cb_list_)
			(*(it.second))(count, doc_infos);
	}
}

void DocManager::OnDeleteDocInfoCallback(const std::string& doc_id, const std::string& extern_info, int32_t code, const nim::DocTransInfo& doc_info)
{
	if (doc_id.empty())
	{
		QLOG_PRO(L"DocManager::OnDeleteDocInfoCallback operate={0}, code={1}, doc_id={2}") << extern_info << code << doc_info.id_;
	}
}

UnregisterCallback DocManager::RegDocInfoNotifyCallback(const nim::DocTrans::DocInfoCallback& callback)
{
	nim::DocTrans::DocInfoCallback* new_callback = new nim::DocTrans::DocInfoCallback(callback);
	int cb_id = (int)new_callback;
	assert(nbase::MessageLoop::current()->ToUIMessageLoop());
	doc_info_notify_cb_list_[cb_id].reset(new_callback);
	auto cb = ToWeakCallback([this, cb_id]() {
		doc_info_notify_cb_list_.erase(cb_id);
	});
	return cb;
}

UnregisterCallback DocManager::RegGetDocInfosCallback(const OnGetDocInfos& callback)
{
	OnGetDocInfos* new_callback = new OnGetDocInfos(callback);
	int cb_id = (int)new_callback;
	assert(nbase::MessageLoop::current()->ToUIMessageLoop());
	get_doc_infos_cb_list_[cb_id].reset(new_callback);
	auto cb = ToWeakCallback([this, cb_id]() {
		get_doc_infos_cb_list_.erase(cb_id);
	});
	return cb;
}

UnregisterCallback DocManager::RegUseDocCallback(const OnUseDoc& callback)
{
	OnUseDoc* new_callback = new OnUseDoc(callback);
	int cb_id = (int)new_callback;
	assert(nbase::MessageLoop::current()->ToUIMessageLoop());
	use_doc_cb_list_[cb_id].reset(new_callback);
	auto cb = ToWeakCallback([this, cb_id]() {
		use_doc_cb_list_.erase(cb_id);
	});
	return cb;
}

void DocManager::InvokeUseDocCallback(const nim::DocTransInfo &doc_info)
{
	assert(nbase::MessageLoop::current()->ToUIMessageLoop());
	for (auto& it : use_doc_cb_list_)
		(*(it.second))(doc_info);
}

// 上传文档功能
std::string DocManager::UploadDoc(const std::string& doc_id, std::string& file_path, const std::string& file_name, nim::NIMDocTranscodingFileType file_type)
{
	Json::Value value;
	value[nim::kNIMNosUploadType] = nim::kNIMNosUploadTypeDocTrans;
	value[nim::kNIMNosDocTransName] = file_name;
	value[nim::kNIMNosDocTransSourceType] = (nim::NIMDocTranscodingFileType)file_type;
	value[nim::kNIMNosDocTransPicType] = nim::kNIMDocTranscodingImageTypePNG;
	value[nim::kNIMNosDocTransExt] = "";
	// 开启文档续传功能
	value[nim::kNIMNosNeedContinueTrans] = true;
	// 执行任务id，如果是第一次上传，则为空，sdk在获取token后会自动填充任务id
	value[nim::kNIMNosTaskId] = doc_id; 
	Json::FastWriter writer;

	std::string upload_id = QString::GetGUID();
	doc_upload_ids_.insert(upload_id);
	// 如果是续传上传，则doc_id不为空，此时文档id与上传id绑定
	if (!doc_id.empty())
	{
		ASSERT(doc_id_upload_id_list_.find(doc_id) == doc_id_upload_id_list_.end());
		doc_id_upload_id_list_[doc_id] = upload_id;
	}

	nim::NOS::UploadResourceEx(file_path, writer.write(value),
		nbase::Bind(&DocManager::OnDocUploadCompeleteCallback, this, upload_id, std::placeholders::_1, std::placeholders::_2),
		nbase::Bind(&DocManager::OnDocUploadProgressCallback, this, upload_id, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3));

	return upload_id;
}

std::string DocManager::GetUploadId(const std::string& doc_id)
{
	auto it = doc_id_upload_id_list_.find(doc_id);
	if (it != doc_id_upload_id_list_.end())
	{
		return it->second;
	}

	return "";
}

bool DocManager::RegUploadDocCallback(const std::string& upload_id, nim::NOS::UploadMediaExCallback compelete_cb, nim::NOS::ProgressExCallback progress_cb)
{
	auto it = doc_upload_ids_.find(upload_id);
	if (it != doc_upload_ids_.end())
	{
		doc_upload_cb_list_[upload_id] = std::make_pair(compelete_cb, progress_cb);
		return true;
	}
	else
	{
		return false;
	}
}

void DocManager::OnDocUploadCompeleteCallback(const std::string& upload_id, nim::NIMResCode res_code, const nim::UploadMediaResult& result)
{
	auto it = doc_upload_cb_list_.find(upload_id);
	ASSERT(it != doc_upload_cb_list_.end());
	if (it != doc_upload_cb_list_.end())
	{
		auto callbacks = it->second;
		callbacks.first(res_code, result);
	}

	doc_upload_cb_list_.erase(upload_id);
	doc_upload_ids_.erase(upload_id);
	bool succeed = false;
	for (auto &iter:doc_id_upload_id_list_)
	{
		if (iter.second == upload_id)
		{
			succeed = true;
			doc_id_upload_id_list_.erase(iter.first);
			break;
		}
	}
	ASSERT(succeed);
}

void DocManager::OnDocUploadProgressCallback(const std::string& upload_id, int64_t completed_size, int64_t file_size, const nim::ProgressData& data)
{
	auto it = doc_upload_cb_list_.find(upload_id);
	ASSERT(it != doc_upload_cb_list_.end());
	if (it != doc_upload_cb_list_.end())
	{
		// 如果是第一次上传，则completed_size为0时获取文档id与上传id绑定
		if (completed_size == 0 && !data.res_id_.empty())
		{
			doc_id_upload_id_list_[data.res_id_] = upload_id;
		}

		auto callbacks = it->second;
		callbacks.second(completed_size, file_size, data);
	}
}

//下载相关
void DocManager::IsDownloadedDoc(const nim::DocTransInfo& doc_info, nim::NIMDocTranscodingQuality quality, int32_t page_num, const OnCheckDocDownloaded& cb)
{
	if (doc_info.id_.empty() || doc_info.page_num_ == 0)
	{
		Post2UI(nbase::Bind(cb, false));
		return;
	}

	StdClosure callback = [=]()
	{
		std::wstring doc_dir = QPath::GetUserAppDataDir(LoginManager::GetInstance()->GetAccount());
		doc_dir = doc_dir.append(L"doc_trans\\");
		doc_dir = doc_dir.append(nbase::UTF8ToUTF16(doc_info.id_));
		doc_dir = doc_dir.append(L"\\");
		if (!nbase::FilePathIsExist(doc_dir, true))
		{
			Post2UI(nbase::Bind(cb, false));
			return;
		}

		std::wstring ext;
		switch (doc_info.pic_type_)
		{
		case nim::kNIMDocTranscodingImageTypeJPG:
			ext = L".jpg";
			break;
		case nim::kNIMDocTranscodingImageTypePNG:
			ext = L".png";
			break;
		default:
		{
			Post2UI(nbase::Bind(cb, false));
			return;
		}
		}

		std::wstring path;
		if (page_num > 0)
		{
			path = nbase::StringPrintf(L"%s%d-%d%s", doc_dir.c_str(), quality, page_num, ext.c_str());
			if (!nbase::FilePathIsExist(path, false))
			{
				Post2UI(nbase::Bind(cb, false));
				return;
			}
		}
		else
		{
			for (int i = 1; i <= doc_info.page_num_; ++i)
			{
				path = nbase::StringPrintf(L"%s%d-%d%s", doc_dir.c_str(), quality, i, ext.c_str());
				if (!nbase::FilePathIsExist(path, false))
				{
					Post2UI(nbase::Bind(cb, false));
					return;
				}
			}
		}

		Post2UI(nbase::Bind(cb, true));
	};

	Post2GlobalMisc(callback);
}

void DocManager::DeleteDoc(const nim::DocTransInfo& doc_info, nim::NIMDocTranscodingQuality quality)
{
	StdClosure callback = [=]()
	{
		if (doc_info.id_.empty())
			return;

		std::wstring doc_dir = QPath::GetUserAppDataDir(LoginManager::GetInstance()->GetAccount());
		doc_dir = doc_dir.append(L"doc_trans\\");
		doc_dir = doc_dir.append(nbase::UTF8ToUTF16(doc_info.id_));
		doc_dir = doc_dir.append(L"\\");
		if (!nbase::FilePathIsExist(doc_dir, true))
			return;

		std::wstring ext;
		switch (doc_info.pic_type_)
		{
		case nim::kNIMDocTranscodingImageTypeJPG:
			ext = L".jpg";
			break;
		case nim::kNIMDocTranscodingImageTypePNG:
			ext = L".png";
			break;
		default:
			return;
		}

		std::wstring path;
		for (int i = 1; i <= doc_info.page_num_; ++i)
		{
			path = nbase::StringPrintf(L"%s%d-%d%s", doc_dir.c_str(), quality, i, ext.c_str());
			nbase::DeleteFileW(path);
		}

		::RemoveDirectory(doc_dir.c_str());
	};

	Post2GlobalMisc(callback);
}

std::wstring DocManager::GetDocPagePath(const nim::DocTransInfo& doc_info, int32_t page_num, nim::NIMDocTranscodingQuality quality/* = kNIMDocTranscodingQualityHigh*/)
{
	if (doc_info.id_.empty())
	{
		return L"";
	}
	std::wstring doc_dir = QPath::GetUserAppDataDir(LoginManager::GetInstance()->GetAccount());
	doc_dir = doc_dir.append(L"doc_trans\\");
	if (!nbase::FilePathIsExist(doc_dir, true))
	{
		nbase::win32::CreateDirectoryRecursively(doc_dir.c_str());
	}
	doc_dir = doc_dir.append(nbase::UTF8ToUTF16(doc_info.id_));
	doc_dir = doc_dir.append(L"\\");
	if (!nbase::FilePathIsExist(doc_dir, true))
	{
		nbase::win32::CreateDirectoryRecursively(doc_dir.c_str());
	}

	std::wstring ext;
	switch (doc_info.pic_type_)
	{
	case nim::kNIMDocTranscodingImageTypeJPG:
		ext = L".jpg";
		break;
	case nim::kNIMDocTranscodingImageTypePNG:
		ext = L".png";
		break;
	default:
		return L"";
	}
	std::wstring path = nbase::StringPrintf(L"%s%d-%d%s", doc_dir.c_str(), quality, page_num, ext.c_str());
	return path;
}

bool DocManager::DownloadDocPage(const nim::DocTransInfo& doc_info, int32_t page_num, nim::NIMDocTranscodingQuality quality, nim::NOS::DownloadMediaCallback cb)
{
	std::wstring path = GetDocPagePath(doc_info, page_num, quality);
	if (!path.empty() && nbase::FilePathIsExist(path, false))
	{
		if (cb)
		{
			nbase::ThreadManager::PostTask(nbase::Bind(cb, nim::kNIMResSuccess, nbase::UTF16ToUTF8(path), "", ""));
		}
		return true;
	}
	std::string download_id = nbase::StringPrintf("%d_%d_%s", page_num, quality, doc_info.id_.c_str());
	auto it = doc_page_download_cb_list_.find(download_id);
	if (it != doc_page_download_cb_list_.end())
	{
		it->second.push_back(cb);
		return true;
	}
	if (doc_info.id_.empty() || doc_info.url_prefix_.empty() || doc_info.state_ != nim::kNIMDocTranscodingStateCompleted  || page_num < 1 || page_num > doc_info.page_num_)
	{
		return false;
	}
	std::string url = nim::DocTrans::GetPageUrl(doc_info.url_prefix_, doc_info.pic_type_, nim::kNIMDocTranscodingQualityHigh, page_num);
	if (url.empty())
	{
		return false;
	}
	nim::NOS::DownloadMediaCallback dl_cb = nbase::Bind(&DocManager::DownloadDocPageCb, this, download_id, path, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3, std::placeholders::_4);
	std::vector<nim::NOS::DownloadMediaCallback> cb_list;
	cb_list.push_back(cb);
	doc_page_download_cb_list_[download_id] = cb_list;
	nim::NOS::DownloadResource(url, dl_cb);
	return true;
}

void DocManager::DownloadDocPageCb(const std::string& download_id, const std::wstring& save_path, nim::NIMResCode res_code, const std::string& file_path, const std::string& call_id, const std::string& res_id)
{
	if (res_code == nim::kNIMResSuccess)
	{
		bool ret = nbase::CopyFileW(nbase::UTF8ToUTF16(file_path), save_path);
		if (ret)
		{
			nbase::DeleteFileW(nbase::UTF8ToUTF16(file_path));
		}
	}
	auto it = doc_page_download_cb_list_.find(download_id);
	if (it != doc_page_download_cb_list_.end())
	{
		std::vector<nim::NOS::DownloadMediaCallback>& cb_list = it->second;
		for (auto cb : cb_list)
		{
			nbase::ThreadManager::PostTask(nbase::Bind(cb, res_code, file_path, call_id, res_id));
		}
		doc_page_download_cb_list_.erase(it);
	}
}

}