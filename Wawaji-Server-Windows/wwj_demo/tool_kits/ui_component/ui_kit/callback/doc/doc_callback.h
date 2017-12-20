#pragma once

namespace nim_comp
{
/** @class DocTransCallback
  * @brief 文档传输回调类
  * @copyright (c) 2016, NetEase Inc. All rights reserved
  * @author redrain
  * @date 2016/12/15
  */
class DocTransCallback
{
public:

	/**
	* 文档转换结果通知的回调函数
	* @param[in] code 错误码
	* @param[in] doc_info 文档信息
	* @return void	无返回值
	*/
	static void DocTransNotifyCallback(int32_t code, const nim::DocTransInfo& doc_info);

	/**
	* 接收文档信息的回调函数
	* @param[in] code 错误码
	* @param[in] count 服务器总条数
	* @param[in] doc_infos 文档信息
	* @return void	无返回值
	*/
	static void DocInfosCallback(int32_t code, int32_t count, const std::list<nim::DocTransInfo>& doc_infos);

};

}