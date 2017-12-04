/** @file nim_sdk_util.h
  * @brief SDK库辅助方法
  * @copyright (c) 2015-2017, NetEase Inc. All rights reserved
  * @author towik, Oleg, Harrison
  * @date 2015/09/08
  */

#ifndef _NLS_SDK_CPP_NIM_SDK_UTIL_H_
#define _NLS_SDK_CPP_NIM_SDK_UTIL_H_

#include <string>
#include <list>
#include <map>
#include <functional>
#include "assert.h"

#ifdef NIM_SDK_DLL_IMPORT
#ifdef WIN32
#include "wtypes.h"
#else
#	include <dlfcn.h>
#endif
#endif

/**
* @namespace nim_livestream
* @brief namespace nim_livestream
*/
namespace nim_livestream
{
/** @enum BoolStatus 自定义的布尔值类型数据的替代数据类型 */
enum BoolStatus
{
	BS_NOT_INIT = -1,	/**< 未初始化 */
	BS_FALSE	= 0,	/**< false */
	BS_TRUE		= 1		/**< true */
};

/** @class NLSSDKInstance
  * @brief SDK库辅助类，提供加载/卸载SDK库以及获取接口的方法
  */
class NLSSDKInstance
{
public:
	NLSSDKInstance();
	virtual ~NLSSDKInstance();

	/** 加载SDK库 */
	bool LoadSdkDll(const char *cur_module_dir, const char *sdk_dll_file_name);

	/** 卸载SDK库 */
	void UnLoadSdkDll();

	/** 获得指定接口 */

	void* GetFunction(const std::string& function_name)
	{
		auto it = function_map.find(function_name);
		if (it != function_map.end()) {
			return it->second;
		}

#ifdef WIN32
		void* function_ptr = ::GetProcAddress(instance_nls_, function_name.c_str());
#else
		void* function_ptr = dlsym(instance_nls_, function_name.c_str());
#endif

		assert(function_ptr);
		function_map[function_name] = function_ptr;
		return function_ptr;
	}

private:
#ifdef WIN32
	HINSTANCE instance_nls_;
#else
	void *instance_nls_;
#endif

	std::map<std::string, void*> function_map;
};

static void nim_print_unfound_func_name(char* name)
{
	printf("function [ %s ] not found \n",name);
}

static void unfound_function_holder()
{


}
#define NIS_SDK_GET_FUNC(nls_sdk_instance,function_ptr)	\
						((function_ptr)nls_sdk_instance->GetFunction(#function_ptr) != NULL ? ((function_ptr)nls_sdk_instance->GetFunction(#function_ptr)) : (nim_print_unfound_func_name(#function_ptr),(function_ptr)unfound_function_holder))

}

#endif //_NLS_SDK_CPP_NIM_SDK_UTIL_H_