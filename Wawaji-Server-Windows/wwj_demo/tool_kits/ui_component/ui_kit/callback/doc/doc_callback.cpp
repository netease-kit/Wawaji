#include "doc_callback.h"
#include "module/doc/doc_manager.h"

namespace nim_comp
{

void DocTransCallback::DocTransNotifyCallback(int32_t code, const nim::DocTransInfo& doc_info)
{
	DocManager::GetInstance()->OnDocInfoNotify(code, doc_info);
}

void DocTransCallback::DocInfosCallback(int32_t code, int32_t count, const std::list<nim::DocTransInfo>& doc_infos)
{
	if (code == nim::kNIMResSuccess)
	{
		DocManager::GetInstance()->OnGetDocInfosCallback(code, count, doc_infos);
	}
}

}