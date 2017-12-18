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
/** @class NLSSDKInstance
  * @brief SDK库辅助类，提供加载/卸载SDK库以及获取接口的方法
  */
class NLSSDKInstance
{
public:
	/** 加载SDK库 */
	static bool LoadSdkDll();

	/** 卸载SDK库 */
	static void UnLoadSdkDll();

	/** 获得指定接口 */
	static void* GetFunction(const std::string& function_name)
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
	static HINSTANCE instance_nls_;
#else
	static void *instance_nls_;
#endif

	static std::map<std::string, void*> function_map;
};

static void nim_print_unfound_func_name(char* name)
{
	printf("function [ %s ] not found \n",name);
}

static void unfound_function_holder()
{

}

#define NIS_SDK_GET_FUNC(function_ptr)	\
	((function_ptr)NLSSDKInstance::GetFunction(#function_ptr) != NULL ? (function_ptr)NLSSDKInstance::GetFunction(#function_ptr) : (nim_print_unfound_func_name(#function_ptr),(function_ptr)unfound_function_holder))

}

#endif //_NLS_SDK_CPP_NIM_SDK_UTIL_H_