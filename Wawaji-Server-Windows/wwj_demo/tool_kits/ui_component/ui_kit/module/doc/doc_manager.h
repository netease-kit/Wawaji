#pragma once

namespace nim_comp
{

typedef std::function<void(nim::DocTransInfo info)> OnUseDoc;	//使用某个文档的回调函数
typedef std::function<void(int32_t count, const std::list<nim::DocTransInfo>& doc_infos)> OnGetDocInfos;	//获取文档信息的回调函数
typedef std::function<void(bool)> OnCheckDocDownloaded;			//检查文档是否下载成功的回调函数

/** @class DocManager
  * @brief 文档传输管理类
  * @copyright (c) 2016, NetEase Inc. All rights reserved
  * @author Redrain
  * @date 2016/12/15
  */
class DocManager : public nbase::SupportWeakCallback
{
public:
	SINGLETON_DEFINE(DocManager);
	DocManager();
	~DocManager();

	/**
	* 获取文档列表
	* @param[in] 查询的起始docId，若为空，表示从头开始查找，按照文档转码的发起时间降序排列
	* @return void	无返回值
	*/
	void GetDocInfoList(const std::string& doc_id);

	/**
	* 文档转换结果通知的回调函数
	* @param[in] code 错误码
	* @param[in] doc_info 文档信息
	* @return void	无返回值
	*/
	void OnDocInfoNotify(int32_t code, const nim::DocTransInfo& doc_info);

	/**
	* 获取文档信息的回调函数
	* @param[in] code 错误码
	* @param[in] count 服务器总条数
	* @param[in] doc_infos 文档信息
	* @return void	无返回值
	*/
	void OnGetDocInfosCallback(int32_t code, int32_t count, const std::list<nim::DocTransInfo>& doc_infos);

	/**
	* 删除文档的回调函数
	* @param[in] doc_id 文档id
	* @param[in] extern_info 附加删除信息
	* @param[in] code 错误码
	* @param[in] doc_infos 文档信息
	* @return void	无返回值
	*/
	void OnDeleteDocInfoCallback(const std::string& doc_id, const std::string& extern_info, int32_t code, const nim::DocTransInfo& doc_info);

	/**
	* 注册获取转码通知的回调
	* @param[in] callback 回调函数
	* @return UnregisterCallback 反注册对象
	*/
	UnregisterCallback RegDocInfoNotifyCallback(const nim::DocTrans::DocInfoCallback& callback);

	/**
	* 注册获取文档信息的回调
	* @param[in] callback 回调函数
	* @return UnregisterCallback 反注册对象
	*/
	UnregisterCallback RegGetDocInfosCallback(const OnGetDocInfos& callback);

	/**
	* 注册使用文档的回调
	* @param[in] callback 回调函数
	* @return UnregisterCallback 反注册对象
	*/
	UnregisterCallback RegUseDocCallback(const OnUseDoc& callback);

	/**
	* 触发使用文档回调函数
	* @param[in] doc_info 文档信息
	* @return void	无返回值
	*/
	void InvokeUseDocCallback(const nim::DocTransInfo &doc_info);

public:
	/**
	* 上传文档
	* @param[in] doc_id 文档id。如果是第一次上传，则为空；如果为续传，则填写需要续传的文档id
	* @param[in] file_path 需要上传的文档路径
	* @param[in] file_name 文档名称
	* @param[in] file_type 文档类型
	* @return std::string 上传id(在demo层用于标识一个上传任务)
	*/
	std::string UploadDoc(const std::string& doc_id, std::string& file_path, const std::string& file_name, nim::NIMDocTranscodingFileType file_type);

	/**
	* 根据文档id获取正在上传的文件的上传id
	* @param[in] doc_id 文档id
	* @return std::string 上传id，失败则返回空
	*/
	std::string GetUploadId(const std::string& doc_id);

	/**
	* 根据上传id注册某个文档上传任务的回调
	* @param[in] upload_id 上传id
	* @param[in] compelete_cb 上传完成的回调函数
	* @param[in] progress_cb 上传进度的回调函数
	* @return bool true 成功，false 失败
	*/
	bool RegUploadDocCallback(const std::string& upload_id, nim::NOS::UploadMediaExCallback compelete_cb, nim::NOS::ProgressExCallback progress_cb);

	/**
	* 文档上传完毕的回调函数
	* @param[in] upload_id 上传id
	* @param[in] res_code 错误码
	* @param[in] result 上传完成的结果
	* @return void	无返回值
	*/
	void OnDocUploadCompeleteCallback(const std::string& upload_id, nim::NIMResCode res_code, const nim::UploadMediaResult& result);

	/**
	* 文档上传进度的回调函数
	* @param[in] upload_id 上传id
	* @param[in] completed_size 已经上传的大小
	* @param[in] file_size 上传文件的总大小
	* @param[in] result 传输过程的数据
	* @return void	无返回值
	*/
	void OnDocUploadProgressCallback(const std::string& upload_id, int64_t completed_size, int64_t file_size, const nim::ProgressData& result);

public:
	/**
	* 检查文档是否下载完成
	* @param[in] doc_info 文档信息
	* @param[in] quality 文档质量
	* @param[in] page_num 要检查的页数(如果为0则代表检查全部)
	* @param[in] cb 检查结果回调函数
	* @return void	无返回值
	*/
	void IsDownloadedDoc(const nim::DocTransInfo& doc_info, nim::NIMDocTranscodingQuality quality, int32_t page_num, const OnCheckDocDownloaded& cb);

	/**
	* 删除本地已下载的文档
	* @param[in] doc_info 文档信息
	* @param[in] quality 文档质量
	* @return void	无返回值
	*/
	void DeleteDoc(const nim::DocTransInfo& doc_info, nim::NIMDocTranscodingQuality quality = nim::kNIMDocTranscodingQualityHigh);

	/**
	* 获取文档页的本地路径（不存在则需要下载）
	* @param[in] doc_info 文档信息
	* @param[in] page_num 页码
	* @param[in] quality 文档质量
	* @return std::string	文件路径
	*/
	std::wstring GetDocPagePath(const nim::DocTransInfo& doc_info, int32_t page_num, nim::NIMDocTranscodingQuality quality = nim::kNIMDocTranscodingQualityHigh);

	/**
	* 下载文档页
	* @param[in] doc_info 文档信息
	* @param[in] page_num 页码
	* @param[in] quality 文档质量
	* @param[in] cb 下载结果回调
	* @return bool	返回调用是否成功
	*/
	bool DownloadDocPage(const nim::DocTransInfo& doc_info, int32_t page_num, nim::NIMDocTranscodingQuality quality, nim::NOS::DownloadMediaCallback cb);
	
	/**
	* 下载文档页的结果回调
	* @param[in] download_id 下载的对象id
	* @param[in] save_path 保存路径
	* @param[in] res_code 错误码
	* @param[in] file_path 实际下载路径
	* @param[in] call_id 下载id
	* @param[in] res_id 资源id
	* @return void	无返回值
	*/
	void DownloadDocPageCb(const std::string& download_id, const std::wstring& save_path, nim::NIMResCode res_code, const std::string& file_path, const std::string& call_id, const std::string& res_id);

private:
	std::map<int, std::unique_ptr<nim::DocTrans::DocInfoCallback>> doc_info_notify_cb_list_; //文档转码通知的回调列表
	std::map<int, std::unique_ptr<OnGetDocInfos>> get_doc_infos_cb_list_;	//获取文档信息的回调列表
	std::map<int, std::unique_ptr<OnUseDoc>> use_doc_cb_list_;				//用户开始使用文档的回调列表

	std::map<std::string, std::pair<nim::NOS::UploadMediaExCallback, nim::NOS::ProgressExCallback>> doc_upload_cb_list_; //用户文档上传回调列表<upload_id, cbs>
	std::set<std::string> doc_upload_ids_; //用户文档上传id列表
	std::map<std::string, std::string> doc_id_upload_id_list_; //用户文档id与上传id映射<doc_id, upload_id>

	std::map<std::string, std::vector<nim::NOS::DownloadMediaCallback>> doc_page_download_cb_list_; //用户文档页下载回调列表 
};

}