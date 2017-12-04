#pragma once

#include "gui/video/helper/ui_bitmap_control.h"
#include "gui/video/screen_capture_tool.h"
#include "game_cmd/serial_win32.h"
#include <time.h>

typedef enum GameStep
{
	kGameStepEmpty = 0,
	kGameStepGetMember,
	kGameStepInvite,
	kGameStepStart,
	kGameStepClaw,
	kGameStepEnd,
};
//基本形式为{ "command":int, "data" : "string" }
//1.娃娃机爪控制 {"command":1, "data" : "left"}   data 可为 上下左右，  up down left right
//2.娃娃机下爪   {"command":2}
//3.娃娃机摄像头切换 {"command":3, "data" : "1"}   data为摄像机编号，目前只有1，2号摄像机
//4.PC 结果通知{ "command":4, "data" : "true" }      data 为 true false
//5.PC 操作反馈{ "command":5, "data" : "ack_data" }  ack_data 为具体反馈信息，此协议供调试使用
typedef enum GameControlType
{
	kGctMove = 1,
	kGctGo = 2,
	kGctCamera = 3,
	kGctRetNotify = 4,
	kGctAck = 5,

	kGctAddCoins = 1001,
};

#define GAME_START_TIME_OUT	15
#define GAME_GO_TIME_OUT	45
#define GAME_RET_TIME_OUT	8
#define GAME_END_TIME_OUT	3

#define GAME_CLR_STEP		RGB(0x10,0xbc, 0x41)
#define GAME_CLR_WINNING	RGB(0xac,0x41, 0x1a)

#define CAMERA_W		640
#define CAMERA_H		480

namespace nim_chatroom
{
	class ChatroomForm : public nim_comp::WindowEx
	{
	public:

		ChatroomForm(__int64 room_id);
		~ChatroomForm();

		virtual std::wstring GetSkinFolder() override;
		virtual std::wstring GetSkinFile() override;
		virtual ui::Control* CreateControl(const std::wstring& pstrClass) override;
		virtual ui::UILIB_RESOURCETYPE GetResourceType() const;
		virtual std::wstring GetZIPFileName() const;

		virtual std::wstring GetWindowClassName() const override;
		virtual std::wstring GetWindowId() const override;
		virtual UINT GetClassStyle() const override;
		virtual LRESULT OnClose(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& bHandled) override;

		virtual void InitWindow() override;
		virtual LRESULT HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam) override;
		virtual void OnFinalMessage(HWND hWnd) override;

		void OnWndSizeMax(bool max);
		virtual bool Notify(ui::EventArgs* msg);
		virtual bool OnClicked(ui::EventArgs* msg);

	public:
		void RequestEnter(const __int64 room_id);
		__int64 GetRoomId();
		void OnReceiveMsgCallback(const ChatRoomMessage& result);
		void OnEnterCallback(int error_code, const ChatRoomInfo& info, const ChatRoomMemberInfo& my_info);
		void OnGetChatRoomInfoCallback(__int64 room_id, int error_code, const ChatRoomInfo& info);
		void OnNotificationCallback(const ChatRoomNotification& notification);
		void OnGetMembersCallback(__int64 room_id, int error_code, const std::list<ChatRoomMemberInfo>& infos);
		void GetMsgHistoryCallback(__int64 room_id, int error_code, const std::list<ChatRoomMessage>& msgs);
		void SetMemberAttributeCallback(__int64 room_id, int error_code, const ChatRoomMemberInfo& info);
		void KickMemberCallback(__int64 room_id, int error_code);
		void OnChatRoomRequestEnterCallback(int error_code, const std::string& result);
		void OnRegLinkConditionCallback(__int64 room_id, const NIMChatRoomLinkCondition condition);
		void TempMuteCallback(__int64 room_id, int error_code, const ChatRoomMemberInfo& info);

		void RequestRoomError(std::wstring tip);

		//收到会议相关权限消息
		void RecMeetingMsg(const std::string &uid, const std::string json);
		void SendP2PCustomMsg(const std::string &uid, const std::string json, bool offline);
		std::string GetSessionId() { return "room" + creater_id_; }

	private:
		void OnRelink(const Json::Value& values);

		void AddText(const std::string &text, COLORREF clr=0);
		void GetNextMember();
		void DoGetNextMember();
		void GetNextMemberCallback(int64_t room_id, int error_code, const ChatRoomQueueElement& element);
		void DoNextMemberCallback(int64_t room_id, int error_code, const ChatRoomQueueElement& element);
	private:
		void InitDeviceList(ui::Combo* combo);
		void StartDevice(ui::Combo* combo);
		void StopDevice();

		void PaintVideo();

		void StartVChat(const std::string& uid, bool webrtc);
		void EndVChat();
		void OnVChatStartCallback(int code);
		void OnVChatConnectCallback(int code);
		void OnVChatPeopleChangeCallback(std::string uid, bool join_type);

		void OnLsErrorCb(int32_t type, int32_t code);
		void OnLsStartCb(int32_t type, bool ret);
	private:
		void RecGameControl(const std::string &uid, int32_t command, const std::string &data, int64_t serial);
		bool InitGameHandle(const std::string &com);
		void CheckGameHanle();
		void OnGameRetCallback(int32_t type, int32_t code, int32_t status);
		bool CloseGameHandle();
		bool ResetClaw();
		int32_t DoGameControl(int32_t command, const std::string &data);
		void GameTimeout();
		void GameEnd();
		void GameReset();
		void QueuePollCb(const StdClosure &task, int64_t room_id, int error_code, const ChatRoomQueueElement& element);

	public:
		static const LPTSTR kClassName;
		static const int kAllowClose = 10;

	private:
		__int64			room_id_;
		std::string		room_enter_token_;

	private:
		bool			has_enter_;
		bool			exit_;
		std::string		creater_id_;	//创建者信息
		std::string		game_uid_;
		std::string		game_que_key_;
		std::string		game_session_id_;
		nim_wwj::WwjControl		game_handle_;
		GameStep		game_step_;
		bool			game_stop_;
		int32_t			game_get_member_try_num_;
		bool			game_camera_front_;
		bool			game_ret_success_;

		AutoUnregister	unregister_cb;

		ChatRoomInfo info_;

		nbase::WeakCallbackFlag paint_video_timer_;
		nbase::WeakCallbackFlag game_start_timer_;
		nbase::WeakCallbackFlag game_go_timer_;
		nbase::WeakCallbackFlag game_ret_timer_;

		bool paint_pic_;

		ui::Label* name_;
		ui::BitmapControl* screen_[4];
		//control
		ui::Combo* camera_device_1_;
		ui::Combo* camera_device_2_;
		ui::CheckBox* paint_checkbox_;
		ui::CheckBox* stop_checkbox_;
		ui::RichEdit* log_edit_;
	};
}