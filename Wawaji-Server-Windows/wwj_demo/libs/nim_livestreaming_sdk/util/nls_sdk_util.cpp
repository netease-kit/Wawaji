/** @file nim_sdk_util.cpp
* @brief SDK库辅助方法
* @copyright (c) 2015-2017, NetEase Inc. All rights reserved
* @author towik, Oleg, Harrison
* @date 2015/09/08
*/

#include "nls_sdk_util.h"
#include "base/util/string_util.h"

namespace nim_livestream
{
	NLSSDKInstance::NLSSDKInstance()
	{
		instance_nls_ = NULL;
	}

	NLSSDKInstance::~NLSSDKInstance()
	{
		function_map.clear();
	}

	bool NLSSDKInstance::LoadSdkDll(const char *cur_module_dir, const char *sdk_dll_file_name)
	{
		std::string dir(cur_module_dir);
		dir.append(sdk_dll_file_name);

#if defined (WIN32)
		std::wstring utf16_dir;
		utf16_dir = nbase::UTF8ToUTF16(dir);
		instance_nls_ = ::LoadLibraryEx(utf16_dir.c_str(), NULL, LOAD_WITH_ALTERED_SEARCH_PATH);
#else
		//int flag = RTLD_GLOBAL | RTLD_LAZY;  //如果是RTLD_GLOBAL，则静态库中定义的全局变量在共享库中名同地址也同
		//int flag = RTLD_LOCAL | RTLD_LAZY;  //如果是RTLD_LOCAL，则静态库中定义的全局变量在共享库中名同地址不同
		instance_nls_ = dlopen(dir.c_str(), RTLD_LAZY);//so必须是绝对路径，如Android系统下是“/data/data/{程序包名}/lib/{so文件名}”
#endif

		if (instance_nls_ == NULL)
		{
			return false;
		}

		return true;
	}

	void NLSSDKInstance::UnLoadSdkDll()
	{
		assert(instance_nls_);
		if (instance_nls_)
		{
#if defined (WIN32)
			::FreeLibrary(instance_nls_);
#else
			dlclose(instance_nls_);
#endif
			instance_nls_ = NULL;
		}
	}
}