#include "serial_win32_jj.h"
#include "nim_tools_http_cpp.h"
#include "base/callback/callback.h"
#include <thread>
#include <mutex>
#include <queue>
#include <list>
#include <signal.h>
#include <errno.h>

#define kServerAddr "https://catchu.azusasoft.com"
#define kAppID "4dd89132-2c7b-459e-b4a2-095eb4883718"
using namespace nbase;

namespace nim_wwj
{
	WwjControl_jj::WwjControl_jj()
	{
		std::wstring dir = nbase::win32::GetCurrentModuleDirectory();
		std::string dir_utf8 = nbase::UTF16ToUTF8(dir);
		ca_path_ = dir_utf8 + "res\\cacert.pem";
		web_socket_ = new WebSocket();
		extra_id_ = 100;
		game_state_mutex_.lock();
		game_state_ = GameState::UnInit;
		game_state_mutex_.unlock();
	}
	
	WwjControl_jj::~WwjControl_jj()
	{
		web_socket_->close();
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
								room_info.id_= room_json_info[i]["id"].asInt();
								room_info.auto_start_ = room_json_info[i]["autostart"].asInt();
								room_info.status_ = room_json_info[i]["status"].asString();
								room_info.price_ = room_json_info[i]["price"].asInt();
								room_info.game_time_ = room_json_info[i]["game_time"].asInt();
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
												game_state_mutex_.lock();
												game_state_ = GameState::Init;
												game_state_mutex_.unlock();
												return;
											}
										}
										QLOG_APP(L"open users ret:{0},code:{1},replay:{2}") << ret << response_code << reply;
										if (wwj_opt_cb_)
										{
											wwj_opt_cb_(kgameonline, kSerialOptFailed, error);
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
								return;
							}
						}
					}
				}

				QLOG_APP(L"query rooms info ret:{0},code:{1},replay:{2}") << ret << response_code << reply;
				if (wwj_opt_cb_)
				{
					wwj_opt_cb_(kgameonline, kSerialOptFailed, error);
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
		if (game_state_ != GameState::UnInit)
		{
			web_socket_->close();
		}
		game_state_mutex_.lock();
		game_state_ = GameState::UnInit;
		game_state_mutex_.unlock();
	}

	bool WwjControl_jj::CrownBlockReset()
	{
		return true;
	}

	bool WwjControl_jj::SerialDirectectOpt(serial_direction_opt_type_e type)
	{
		if (game_state_ == GameState::Play)
		{
			Json::Value value;
			value["type"] = "Control";
			string opt_data = "l";
			string opt_undo_data = "A";
			switch (type)
			{
			case kfront:
				opt_data = "u";
				opt_undo_data = "W";
				break;
			case kclaw:
				opt_data = "b";
				break;
			case kleft:
				opt_data = "l";
				opt_undo_data = "A";
				break;
			case kright:
				opt_data = "r";
				opt_undo_data = "D";
				break;
			case kback:
				opt_data = "d";
				opt_undo_data = "S";
				break;
			}

			value["data"] = opt_data;
			value["extra"] = extra_id_;
			string query = value.toStyledString();
			if (web_socket_->getReadyState() == WebSocket::State::OPEN)
			{
				web_socket_->send(query);
				if (opt_data != "b")
				{
					Sleep(260);
					Json::Value value;
					value["type"] = "Control";
					value["data"] = opt_undo_data;
					value["extra"] = extra_id_;
					string query = value.toStyledString();
					web_socket_->send(query);
				}
			}
			else
			{
				
			}
			return true;
		}
		return false;
	}

	void WwjControl_jj::SerialSetStepSize(unsigned char step_size)
	{

	}

	void  WwjControl_jj::Pay(int coins)
	{
		if (game_state_ != GameState::Init&&game_state_!=GameState::GameOver)
		{
			return;
		}
		game_state_mutex_.lock();
		game_state_ = GameState::Charge;
		game_state_mutex_.unlock();
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
				
						//连接wss
						web_socket_->init(*this, wss_url_,ca_path_);
						//wwj_opt_cb_(kgamepay, kSerialOptSuccess, normal);
						//if (wwj_opt_cb_)
						//{
						//	wwj_opt_cb_(kgamepay, kSerialOptSuccess, normal);
						//}
						return;
					}
				}
				
			}
			QLOG_APP(L"charge fun:{0} ret:{1},code:{2},reply{3}") << __FUNCTION__ << ret << code << reply;
			if (wwj_opt_cb_)
			{
				wwj_opt_cb_(kgamepay, kSerialOptFailed, normal);
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
			QLOG_APP(L"gamepay fun:{0} line:{1},room_size:{2}") << __FUNCTION__ << __LINE__ << room_info_.size();
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

	void WwjControl_jj::onOpen(WebSocket* ws) 
	{
		//连接wss成功,wws充币
		if (game_state_ == GameState::Charge)
		{
			Json::Value value;
			value["type"] = "Insert";
			string opt_data = "";
			value["data"] = opt_data;
			value["extra"] = extra_id_;
			string query = value.toStyledString();
			if (web_socket_->getReadyState() == WebSocket::State::OPEN)
			{
				web_socket_->send(query);
			}
			game_state_mutex_.lock();
			game_state_ = GameState::Coin;
			game_state_mutex_.unlock();
		}
	}
	
	void WwjControl_jj::onMessage(WebSocket* ws, const WebSocket::Data& data)
	{
		printf("----------receive data------------%s--------\n", data.bytes);
		{
			string json_value = data.bytes;
			Json::Value valus;
			Json::Reader reader;
			if (reader.parse(json_value, valus))
			{
				string opt_type = valus["type"].asString();
				string str_extra_id = valus["extra"].asString();
				int extra_id = 0; 
				nbase::StringToInt(str_extra_id, &extra_id);
			
				if (extra_id == extra_id_&&opt_type == "Coin")
				{
					//暂定有回调就被视为充币成功
					if (wwj_opt_cb_ != NULL)
					{
						wwj_opt_cb_(kgamepay, kSerialOptSuccess, normal);
					}
					game_state_mutex_.lock();
					game_state_ = GameState::Play;
					game_state_mutex_.unlock();
				}
				else if (opt_type == "Result")
				{
					bool result = valus["data"].asBool();
					game_state_mutex_.lock();
					game_state_ = GameState::GameOver;
					game_state_mutex_.unlock();
					if (result)
					{
						//中奖
						if (wwj_opt_cb_ != NULL)
						{
							wwj_opt_cb_(kgameend, kSerialOptSuccess, normal);
							wwj_opt_cb_(kgameprize, kSerialOptSuccess, normal);
						}
					}
					else
					{
						//未中奖
						if (wwj_opt_cb_ != NULL)
						{
							wwj_opt_cb_(kgameend, kSerialOptSuccess, normal);
							wwj_opt_cb_(kgameprize, kSerialOptFailed, normal);
						}
					}
					//关闭websocket连接
					web_socket_->close();
					extra_id_++;
				}
				else if (opt_type == "Ack")
				{
					printf("Websocket ack\n");
				}
				else if (opt_type == "Delay")
				{
					printf("Websocket Delay\n");
				}
				else if (opt_type == "Wait")
				{
					printf("Websocket wait\n");
				}
				else if (opt_type == "Ready")
				{
					printf("Websocket ready\n");
				}
			}
		}
	}

	void WwjControl_jj::onClose(WebSocket* ws)
	{
		//只有 Coin 和Play状态才会收到这个通知
		QLOG_APP(L"websocket close state:{0}") << (int)game_state_;
		switch (game_state_)
		{
		case nim_wwj::GameState::Coin:
			if (wwj_opt_cb_ != NULL)
			{
				wwj_opt_cb_(kgamepay, kSerialOptFailed, normal);
			}
			break;
		case nim_wwj::GameState::Play:
			if (wwj_opt_cb_ != NULL)
			{
				wwj_opt_cb_(kgameend, kSerialOptSuccess, normal);
			}
			break;
		default:
			break;
		}

		game_state_mutex_.lock();
		game_state_ = GameState::GameOver;
		game_state_mutex_.unlock();
		printf("websocket close\n");
	}

	void WwjControl_jj::onError(WebSocket* ws, const WebSocket::ErrorCode& error)
	{
		//只有 Coin 和Play状态才会收到这个通知
		QLOG_APP(L"websocket close state:{0},error:{1}") << (int)game_state_ << (int)error;
		switch (game_state_)
		{
		case nim_wwj::GameState::Coin:
			if (wwj_opt_cb_ != NULL)
			{
				wwj_opt_cb_(kgamepay, kSerialOptFailed, normal);
			}
			break;
		case nim_wwj::GameState::Play:
			if (wwj_opt_cb_ != NULL)
			{
				wwj_opt_cb_(kgameend, kSerialOptSuccess, normal);
			}
			break;
		default:
			break;
		}
		
		game_state_mutex_.lock();
		game_state_ = GameState::GameOver;
		game_state_mutex_.unlock();
	}

}