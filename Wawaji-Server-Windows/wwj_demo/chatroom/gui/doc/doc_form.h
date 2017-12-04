#pragma once

namespace nim_chatroom
{

class DocItem;
/** @class DocForm
  * @brief 文档库窗口
  * @copyright (c) 2016, NetEase Inc. All rights reserved
  * @author Redrain
  * @date 2016/12/15
  */
class DocForm : public nim_comp::WindowEx
{
public:
	DocForm();
	~DocForm();

	//覆盖虚函数
	virtual std::wstring GetSkinFolder() override;
	virtual std::wstring GetSkinFile() override;
	virtual std::wstring GetWindowClassName() const override;
	virtual std::wstring GetWindowId() const override;
	virtual UINT GetClassStyle() const override;

	/**
	* 窗口初始化函数
	* @return void	无返回值
	*/
	virtual void InitWindow() override;

	/**
	* 处理所有控件单击消息
	* @param[in] msg 消息的相关信息
	* @return bool true 继续传递控件消息，false 停止传递控件消息
	*/
	virtual bool OnClicked(ui::EventArgs* msg);

	/**
	* 处理文档列表滚动条消息
	* @param[in] msg 消息的相关信息
	* @return bool true 继续传递控件消息，false 停止传递控件消息
	*/
	bool OnDocListScroll(ui::EventArgs* msg);

	/**
	* 根据文件路径获取文档上传信息
	* @param[in] file_path 文件路径
	* @param[out] out_file_path 文件路径
	* @param[out] out_file_name 文件名
	* @param[out] out_file_type 文件类型
	* @return bool true 上传信息有效，false 上传信息无效
	*/
	static bool GetUploadFileInfo(const std::wstring& file_path, std::string& out_file_path, std::string& out_file_name, nim::NIMDocTranscodingFileType& out_file_type);
	
	/**
	* 把文件扩展转换为文档类型
	* @param[in] file_ext 扩展名
	* @return int 文档类型，0代表无效
	*/
	static int GetFileType(std::wstring file_ext);
public:
	static const LPTSTR kClassName;

private:
	/**
	* 在弹出的文件选择窗口中选择了某个文件
	* @param[in] ret 是否选择了文件
	* @param[in] file_path 文件路径
	* @return void	无返回值
	*/
	void OnDocFileSelected(BOOL ret, std::wstring file_path);

	/**
	* 根据上传id和文档信息在文档列表中创建一个新的文档列表项控件
	* @param[in] upload_id 上传id
	* @param[in] file_path 文件路径
	* @param[in] file_name 文件名
	* @param[in] file_type 文件类型
	* @return DocItem* 文档列表项控件
	*/
	DocItem* CreateStartUploadDocItem(const std::string& upload_id, const std::string& file_path, const std::string& file_name, nim::NIMDocTranscodingFileType file_type);
private:

	/**
	* 获取文档信息的回调函数
	* @param[in] count 服务器总条数
	* @param[in] doc_infos 文档信息
	* @return void	无返回值
	*/
	void OnGetDocInfosCallback(int32_t count, const std::list<nim::DocTransInfo>& doc_infos);

	/**
	* 文档转换结果通知的回调函数
	* @param[in] code 错误码
	* @param[in] doc_info 文档信息
	* @return void	无返回值
	*/
	void OnDocInfoNotifyCallback(int32_t code, const nim::DocTransInfo& doc_info);

private:
	ui::ListBox		*doc_list_;
	int32_t			doc_count_;
	bool			is_getting_docs_info_;
	AutoUnregister	unregister_cb;
};

}