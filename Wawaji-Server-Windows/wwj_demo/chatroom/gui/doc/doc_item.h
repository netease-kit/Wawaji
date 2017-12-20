#pragma once
#include "transcode_player.h"

namespace nim_chatroom
{

/** @class DocItem
  * @brief 文档列表项的UI类
  * @copyright (c) 2016, NetEase Inc. All rights reserved
  * @author Redrain
  * @date 2016/12/15
  */
class DocItem : public ui::ListContainerElement
{
public:
	friend class DocForm;
	DocItem();
	virtual ~DocItem();

	/**
	* 控件内部初始化
	* @return void	无返回值
	*/
	virtual void InitControls();

	/**
	* 初始化控件信息
	* @param[in] info 文档信息
	* @param[in] upload_id 文档上传id
	* @return void	无返回值
	*/
	virtual void Init(const nim::DocTransInfo& info, const std::string& upload_id);

	/**
	* 获取文档id
	* @return string 文档id
	*/
	std::string GetDocId() { return doc_info_.id_; }

public:
	// 与上传相关的界面控件
	enum DocItemUploadState
	{
		kDocItemUploadStatePrepare = 0,
		kDocItemUploadStateUploading,
		kDocItemUploadStateTranscoding,
		kDocItemUploadStateFaild,
		kDocItemUploadStateTranscodeFaild
	};

	// 与下载相关的界面控件
	enum DocItemDownloadState
	{
		kDocItemDownloadStateInit = 0,
		kDocItemDownloadStateDownload,
		kDocItemDownloadStateDownloading,
		kDocItemDownloadStateRetry,
		kDocItemDownloadStateUse
	};

	/**
	* 切换到下载模式或上传模式
	* @param[in] download_or_upload 下载模式或上传模式
	* @return void 无返回值
	*/
	void SwitchToDownloadMode(bool download_or_upload);

	/**
	* 显示上传模式的某个按钮
	* @param[in] button 按钮类型
	* @return void 无返回值
	*/
	void ShowUploadUI(DocItemUploadState button);

	/**
	* 显示下载模式的某个按钮
	* @param[in] button 按钮类型
	* @return void 无返回值
	*/
	void ShowDownloadUI(DocItemDownloadState button);

private:
	/**
	* 处理下载按钮单击消息
	* @param[in] msg 消息的相关信息
	* @return bool true 继续传递控件消息，false 停止传递控件消息
	*/
	bool OnBtnDownloadClick(ui::EventArgs* arg);

	/**
	* 处理下载使用按钮单击消息
	* @param[in] msg 消息的相关信息
	* @return bool true 继续传递控件消息，false 停止传递控件消息
	*/
	bool OnBtnDownloadUseClick(ui::EventArgs* arg);

	/**
	* 处理下载重试按钮单击消息
	* @param[in] msg 消息的相关信息
	* @return bool true 继续传递控件消息，false 停止传递控件消息
	*/
	bool OnBtnDownloadRetryClick(ui::EventArgs* arg);

	/**
	* 处理删除按钮单击消息
	* @param[in] msg 消息的相关信息
	* @return bool true 继续传递控件消息，false 停止传递控件消息
	*/
	bool OnBtnDeleteClick(ui::EventArgs* arg);

	/**
	* 处理上传重试按钮单击消息
	* @param[in] msg 消息的相关信息
	* @return bool true 继续传递控件消息，false 停止传递控件消息
	*/
	bool OnBtnUploadRetryClick(ui::EventArgs* arg);

	/**
	* 处理上传取消按钮单击消息
	* @param[in] msg 消息的相关信息
	* @return bool true 继续传递控件消息，false 停止传递控件消息
	*/
	bool OnBtnUploadCancelClick(ui::EventArgs* arg);

private:
	/**
	* 设置界面中显示的转码进度
	* @param[in] value 进度值，最大值设置为10000，方便除以100后获取含有小数点的百分比
	* @return void	无返回值
	*/
	void SetTranscodeProg(int value);

	/**
	* 开始执行转码中的进度条动画
	* @return void	无返回值
	*/
	void StartTranscodAnimation();

	/**
	* 开始执行转码完成的进度条动画
	* @return void	无返回值
	*/
	void EndTranscodAnimation();

private:
	/**
	* 下载文档页的结果回调函数
	* @param[in] doc_id 文档id
	* @param[in] page_num 下载的页码
	* @param[in] res_code 错误码
	* @param[in] file_path 实际下载路径
	* @param[in] call_id 下载id
	* @param[in] res_id 资源id
	* @return void	无返回值
	*/
	void OnDownlaodDocPageCallback(const std::string& doc_id, int32_t page_num, nim::NIMResCode res_code, const std::string& file_path, const std::string& call_id, const std::string& res_i);

	/**
	* 检查文档是否下载完成的回调函数
	* @param[in] is_downloaded 是否下载完成
	* @return void	无返回值
	*/
	void OnCheckDocDownloadedCallback(bool is_downloaded);

	/**
	* 文档上传完毕的回调函数
	* @param[in] res_code 错误码
	* @param[in] result 上传完成的结果
	* @return void	无返回值
	*/
	void OnDocUploadCompeleteCallback(nim::NIMResCode res_code, const nim::UploadMediaResult& result);

	/**
	* 文档上传进度的回调函数
	* @param[in] completed_size 已经上传的大小
	* @param[in] file_size 上传文件的总大小
	* @param[in] result 传输过程的数据
	* @return void	无返回值
	*/
	void OnDocUploadProgressCallback(int64_t completed_size, int64_t file_size, const nim::ProgressData& data);

	/**
	* 文档转换结果通知的回调函数
	* @param[in] code 错误码
	* @param[in] doc_info 文档信息
	* @return void	无返回值
	*/
	void OnDocInfoNotifyCallback(int32_t code, const nim::DocTransInfo& doc_info);

	/**
	* 初始化文档图片和文档标题
	* @return void	无返回值
	*/
	void InitDocImageAndTitle();

	/**
	* 下载文档首页图片的结果回调函数
	* @param[in] doc_id 文档id
	* @param[in] page_num 下载的页码
	* @param[in] res_code 错误码
	* @param[in] file_path 实际下载路径
	* @param[in] call_id 下载id
	* @param[in] res_id 资源id
	* @return void	无返回值
	*/
	void OnDownlaodDocImageCallback(const std::string& doc_id, int32_t page_num, nim::NIMResCode res_code, const std::string& file_path, const std::string& call_id, const std::string& res_i);

private:
	nim::DocTransInfo doc_info_;

	ui::Control		*doc_image_;
	ui::Label		*doc_title_;

	ui::TabBox		*tab_switch_;
	ui::TabBox		*tab_download_controls_;
	ui::Button		*btn_download_;
	ui::Button		*btn_download_use_;
	ui::Button		*btn_downloading_;
	ui::Button		*btn_download_retry_;

	ui::TabBox		*tab_upload_controls_;
	ui::Label		*upload_prog_tip_;
	ui::Label		*upload_error_tip_;
	ui::Button		*btn_upload_retry_;
	ui::Button		*btn_upload_cancel_;

	ui::Button		*btn_delete_;

	ui::Progress	*prog_upload_;
	ui::Progress	*prog_transcode_;

	TranscodeAnimationPlayer transcode_animation_; // 模拟转码进度的动画

	AutoUnregister	unregister_cb;
};
}