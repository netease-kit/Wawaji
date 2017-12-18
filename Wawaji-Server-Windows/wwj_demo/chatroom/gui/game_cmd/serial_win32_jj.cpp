#include "serial_win32_jj.h"
#include "nim_tools_http_cpp.h"
#include "base/callback/callback.h"

#define kServerAddr "https://catchu.azusasoft.com"
#define kAppID "4dd89132-2c7b-459e-b4a2-095eb4883718"
using namespace nbase;

namespace nim_wwj
{
	WwjControl_jj::WwjControl_jj()
	{

	}
	
	WwjControl_jj::~WwjControl_jj()
	{

	}

	bool WwjControl_jj::OpenSerial(const char* com)
	{
		identifying_ = com;
		
		{
			auto http_cb = [this](bool ret, int response_code, const std::string& reply)
			{
				int32_t code = response_code;
				if (ret && response_code == 200 || response_code == 201)
				{
					Json::Value values;
					Json::Reader reader;
					if (reader.parse(reply, values))
					{
						room_info_.clear();
						if (values["rooms"].isArray())
						{
							int size = values["rooms"].size();
							for (int i=0;i<size;i++)
							{
								Json::Value room_json_info = values["rooms"];
								RoomInfo room_info;
								room_info.id_= room_json_info[0]["id"].asInt();
								room_info.auto_start_ = room_json_info[0]["autostart"].asInt();
								room_info.status_ = room_json_info[0]["status"].asString();
								room_info.price_ = room_json_info[0]["price"].asInt();
								room_info.game_time_ = room_json_info[0]["game_time"].asInt();
								room_info_.push_back(room_info);
							}
							if (size > 0)
							{
								auto http_cb = [this](bool ret, int response_code, const std::string& reply)
								{
									int32_t code = response_code;
									if (ret && response_code == 200 || response_code == 201)
									{
										Json::Value values;
										Json::Reader reader;
										if (reader.parse(reply, values))
										{
											if (values["user"].isObject())
											{
												string id = values["user"]["id"].asString();
												string account = values["user"]["account"].asString();
												string binding = values["user"]["binding"].asString();
											}
										}
									}
								};
								std::string api_addr = kServerAddr;
								api_addr += "/open_api/v0.2/users";
								api_addr = nbase::StringPrintf("%s?app_id=%s&binding=%s", api_addr.c_str(), kAppID, identifying_.c_str());
								nim_http::HttpRequest request(api_addr, "", 0, ToWeakCallback(http_cb));
								request.AddHeader("Content-Type", "application/json");
								request.SetMethodAsPost();
								nim_http::PostRequest(request);
							}
						}
					}
				}
			};
			std::string api_addr = kServerAddr;
			api_addr += "/open_api/v0.2/rooms";
			api_addr = nbase::StringPrintf("%s?app_id=%s", api_addr.c_str(), kAppID);
			nim_http::HttpRequest request(api_addr, "", 0, ToWeakCallback(http_cb));
			request.AddHeader("Content-Type", "application/json");
			nim_http::PostRequest(request);
		}
		return true;
	}

	bool WwjControl_jj::SetSerialParam(serial_param_t param)
	{
		return true;
	}

	void WwjControl_jj::CloseSerial()
	{

	}

	bool WwjControl_jj::CrownBlockReset()
	{
		return true;
	}

	bool WwjControl_jj::SerialDirectectOpt(serial_direction_opt_type_e type)
	{
		Json::Value value;
		value["type"] = "Control";
		string opt_data = "l";
		switch (type)
		{
			switch (type)
			{
			case kfront:
				opt_data = "u";
				break;
			case kclaw:
				opt_data = "b";
				break;
			case kleft:
				opt_data = "l";
				break;
			case kright:
				opt_data = "r";
				break;
			case kback:
				opt_data = "d";
				break;
			}
		}
		value["data"] = opt_data;
		string query = value.toStyledString();

		auto http_cb = [this](bool ret, int response_code, const std::string& reply)
		{
			int32_t code = response_code;
			if (ret && response_code == 200 || response_code == 201)
			{
				Json::Value values;
				Json::Reader reader;
				if (reader.parse(reply, values))
				{
					if (values["user"].isObject())
					{
						string id = values["user"]["id"].asString();
						string account = values["user"]["account"].asString();
						string binding = values["user"]["binding"].asString();
					}
				}
			}
		};
		std::string api_addr = kServerAddr;
		api_addr += "/open_api/v0.2/users";
		api_addr = nbase::StringPrintf("%s?app_id=%s&binding=%s", api_addr.c_str(), kAppID, identifying_.c_str());
		nim_http::HttpRequest request(api_addr, "", 0, ToWeakCallback(http_cb));
		request.AddHeader("Content-Type", "application/json");
		request.SetMethodAsPost();
		nim_http::PostRequest(request);
		return true;
	}

	void WwjControl_jj::SerialSetStepSize(unsigned char step_size)
	{

	}

	void  WwjControl_jj::Pay(int coins)
	{
		auto http_cb = [this](bool ret, int response_code, const std::string& reply)
		{
			int32_t code = response_code;
			if (ret && (response_code == 200|| response_code == 201))
			{
				Json::Value values;
				Json::Reader reader;
				if (reader.parse(reply, values))
				{
					string status = values["status"].asString();
					if (status=="ok"&&values["user"].isObject())
					{
						WWJ_INFO wwj_info;
						string id = values["user"]["id"].asString();
						string account = values["user"]["account"].asString();
						string binding = values["user"]["binding"].asString();
						wss_url_ = values["user"]["ws_url"].asString();
					}
				}
				if (wwj_opt_cb_)
				{
					wwj_opt_cb_(kgamepay, kSerialOptSuccess, normal);
				}
			}
			else
			{
				if (wwj_opt_cb_)
				{
					wwj_opt_cb_(kgamepay, kSerialOptFailed, normal);
				}
			}
		};
		std::string api_addr = kServerAddr;
		api_addr += "/open_api/v0.2/charge";
		if (room_info_.size() > 0)
		{
			api_addr = nbase::StringPrintf("%s?app_id=%s&binding=%s&amount=%d&room_id=%d", api_addr.c_str(), kAppID, identifying_.c_str(), coins, room_info_.front().id_);
			nim_http::HttpRequest request(api_addr, "", 0, ToWeakCallback(http_cb));
			request.AddHeader("Content-Type", "application/json");
			request.SetMethodAsPost();
			nim_http::PostRequest(request);
		}
		else
		{
			if (wwj_opt_cb_)
			{
				wwj_opt_cb_(kgamepay, kSerialOptFailed, normal);
			}
		}
	}

	bool WwjControl_jj::QueryDeviceInfo()
	{
		return true;
	}

	bool WwjControl_jj::CheckNormal()
	{
		return true;
	}

	wwj_set_param_t WwjControl_jj::GetSettingParam()
	{
		wwj_set_param_t set_param_t;
		return set_param_t;
	}

	bool  WwjControl_jj::SetSettingParam(wwj_set_param_t param)
	{
		return true;
	}

	void WwjControl_jj::StartSerialReadThread()
	{

	}
}