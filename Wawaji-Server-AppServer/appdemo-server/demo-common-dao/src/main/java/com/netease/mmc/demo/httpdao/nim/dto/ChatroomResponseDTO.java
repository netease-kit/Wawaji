package com.netease.mmc.demo.httpdao.nim.dto;

/**
 * 云信API接口返回值DTO.
 *
 * @author hzwanglin1
 * @date 2017/6/24
 * @since 1.0
 */
public class ChatroomResponseDTO {
    /**
     * 返回状态码
     */
    private Integer code;

    /**
     * 聊天室信息
     */
    private ChatroomDTO chatroom;

    /**
     * 错误提示信息
     */
    private String desc;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public ChatroomDTO getChatroom() {
        return chatroom;
    }

    public void setChatroom(ChatroomDTO chatroom) {
        this.chatroom = chatroom;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("ChatroomResponseDTO{");
        sb.append("code=").append(code);
        sb.append(", chatroom=").append(chatroom);
        sb.append(", desc='").append(desc).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
