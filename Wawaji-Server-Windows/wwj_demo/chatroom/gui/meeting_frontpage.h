#pragma once

namespace nim_chatroom
{

class MeetingFrontpage : public nim_comp::WindowEx
{
public:
	MeetingFrontpage();
	~MeetingFrontpage();

	virtual std::wstring GetSkinFolder() override;
	virtual std::wstring GetSkinFile() override;
	virtual ui::UILIB_RESOURCETYPE GetResourceType() const;
	virtual std::wstring GetZIPFileName() const;

	virtual std::wstring GetWindowClassName() const override;
	virtual std::wstring GetWindowId() const override;
	virtual UINT GetClassStyle() const override;
	virtual LRESULT OnClose(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& bHandled) override;

	virtual void InitWindow() override;

	virtual LRESULT HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam) override;
	bool Notify(ui::EventArgs* msg);
	bool OnClicked(ui::EventArgs* msg);

	//收到会议相关权限消息
	void RecMeetingMsg(const std::string &uid, const std::string json);

private:
	void OnUserInfoChange(const std::list<nim::UserNameCard> &uinfos);
	void OnUserPhotoReady(PhotoType type, const std::string& account, const std::wstring& photo_path);
	void InitHeader();

	bool CheckRoomSingle();
	void OnJoinRoom();
	void JoinRoom(int64_t id);

	bool MainMenuButtonClick(ui::EventArgs* param);
	void PopupMainMenu(POINT point);

	void Logout(bool logoff);
public:
	static const LPTSTR kClassName;

private:
	ui::RichEdit* id_edit_;
	ui::RichEdit* name_edit_;
	bool create_room_ = false;

	AutoUnregister	unregister_cb;

};
}