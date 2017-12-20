/** @file nim_sdk_util.cpp
* @brief SDK库辅助方法
* @copyright (c) 2015-2017, NetEase Inc. All rights reserved
* @author towik, Oleg, Harrison
* @date 2015/09/08
*/

#include "nls_sdk_util.h"
#include "base/util/string_util.h"
#include "base/win32/path_util.h"

namespace nim_livestream
{
	HINSTANCE NLSSDKInstance::instance_nls_ = NULL;
	std::map<std::string, void*> NLSSDKInstance::function_map;

	bool NLSSDKInstance::LoadSdkDll()
	{
		if (instance_nls_)
			return true;
		std::wstring dir = nbase::win32::GetCurrentModuleDirectory() + L"live_stream\\";
#if defined (WIN32)
		instance_nls_ = ::LoadLibraryEx((dir + L"LSMediaCapture.dll").c_str(), NULL, LOAD_WITH_ALTERED_SEARCH_PATH);
		if (instance_nls_ == NULL)
		{
			assert(0);
			return false;
		}
		//主动加载要用到的基础库，解决中文目录下sdk找不到这个库的路径的问题
		::LoadLibraryEx((dir + L"libgcc_s_dw2-1.dll").c_str(), NULL, LOAD_WITH_ALTERED_SEARCH_PATH);
#else
		//int flag = RTLD_GLOBAL | RTLD_LAZY;  //如果是RTLD_GLOBAL，则静态库中定义的全局变量在共享库中名同地址也同
		//int flag = RTLD_LOCAL | RTLD_LAZY;  //如果是RTLD_LOCAL，则静态库中定义的全局变量在共享库中名同地址不同
		std::string dir_utf8 = nbase::UTF16ToUTF8(dir);
		instance_nls_ = dlopen((dir_utf8 + "LSMediaCapture.dll").c_str(), RTLD_LAZY);//so必须是绝对路径，如Android系统下是“/data/data/{程序包名}/lib/{so文件名}”
		dlopen((dir_utf8 + "libgcc_s_dw2-1.dll").c_str(), RTLD_LAZY); //主动加载要用到的基础库，解决中文目录下sdk找不到这个库的路径的问题
#endif
		return true;
	}

	void NLSSDKInstance::UnLoadSdkDll()
	{
		if (instance_nls_)
		{
#if defined (WIN32)
			::FreeLibrary(instance_nls_);
#else
			dlclose(instance_nls_);
#endif
			instance_nls_ = NULL;
		}
		function_map.clear();
	}
}