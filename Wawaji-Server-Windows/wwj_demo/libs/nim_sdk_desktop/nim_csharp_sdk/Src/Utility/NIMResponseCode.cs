/** @file NIMResponseCode.cs
  * @brief NIM SDK提供给外部使用的错误号定义（包含客户端自定义和服务器返回的所有错误号）
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/2/1
  */


namespace NIM
{
    /// <summary>
    /// NIMResCode 返回的错误号（只定义需要客户端处理的）
    /// </summary>
    public enum ResponseCode
    {
        #region 通用错误码
        /// <summary>
        /// 没有错误，一切正常
        /// </summary>
        kNIMResSuccess = 200,

        /// <summary>
        /// 客户端版本不正确
        /// </summary>
        kNIMResVersionError = 201,

        /// <summary>
        /// 用户名或密码错误
        /// </summary>
        kNIMResUidPassError = 302,

        /// <summary>
        /// 禁止操作
        /// </summary>
        kNIMResForbidden = 403,

        /// <summary>
        /// 请求的目标（用户或对象）不存在
        /// </summary>
        kNIMResNotExist = 404,

        /// <summary>
        /// 数据自上次查询以来未发生变化（用于增量更新）
        /// </summary>
        kNIMResNoModify = 406,

        /// <summary>
        /// 请求过程超时
        /// </summary>
        kNIMResTimeoutError = 408,

        /// <summary>
        /// 参数错误
        /// </summary>
        kNIMResParameterError = 414,

        /// <summary>
        /// 网络连接出现错误
        /// </summary>
        kNIMResConnectionError = 415,

        /// <summary>
        /// 操作太过频繁
        /// </summary>
        kNIMResFrequently = 416,

        /// <summary>
        /// 对象已经存在
        /// </summary>
        kNIMResExist = 417,

        /// <summary>
        /// 帐号被禁用
        /// </summary>
        kNIMResAccountBlock = 422,

        /// <summary>
        /// 未知错误，或者不方便告诉你
        /// </summary>
        kNIMResUnknownError = 500,

        /// <summary>
        /// 服务器数据错误
        /// </summary>
        kNIMResServerDataError = 501,

        /// <summary>
        /// 服务器太忙
        /// </summary>
        kNIMResTooBuzy = 503,

        /// <summary>
        /// 协议无效, 不允许访问的协议
        /// </summary>
        kNIMResInvalid = 509,
        #endregion

        #region 群错误码
        /// <summary>
        /// 已达到人数限制
        /// </summary>
        kNIMResTeamECountLimit = 801,

        /// <summary>
        /// 没有权限
        /// </summary>
        kNIMResTeamENAccess = 802,

        /// <summary>
        /// 群不存在
        /// </summary>
        kNIMResTeamENotExist = 803,

        /// <summary>
        /// 用户不在兴趣组里面
        /// </summary>
        kNIMResTeamEMemberNotExist = 804,

        /// <summary>
        /// 群类型不对
        /// </summary>
        kNIMResTeamErrType = 805,

        /// <summary>
        /// 创建群数量限制
        /// </summary>
        kNIMResTeamLimit = 806,

        /// <summary>
        /// 群成员状态不对
        /// </summary>
        kNIMResTeamUserStatusErr = 807,

        /// <summary>
        /// 申请成功
        /// </summary>
        kNIMResTeamApplySuccess = 808,

        /// <summary>
        /// 已经在群里
        /// </summary>
        kNIMResTeamAlreadyIn = 809,

        /// <summary>
        /// 邀请成功
        /// </summary>
        kNIMResTeamInviteSuccess = 810,
        #endregion

        #region 数据解编错误代码
        /// <summary>
        /// 协议已失效
        /// </summary>
        kNIMResInvalidProtocol = 997,

        /// <summary>
        /// 解包错误
        /// </summary>
        kNIMResEUnpacket = 998,

        /// <summary>
        /// 打包错误
        /// </summary>
        kNIMResEPacket = 999,
        #endregion

        #region 客户端自定义的错误号
        /// <summary>
        /// 值大于该错误号的都是客户端自定义的错误号。不能随意更改其值
        /// </summary>
        kNIMLocalRes = 10000,

        /// <summary>
        /// 发送文件消息，NOS上传暂停
        /// </summary>
        kNIMLocalResMsgNosUploadCancel = 10200,

        /// <summary>
        /// 收到文件消息，NOS下载暂停
        /// </summary>
        kNIMLocalResMsgNosDownloadCancel = 10206,

        /// <summary>
        /// 本地资源不存在
        /// </summary>
        kNIMLocalResMsgFileNotExist = 10404,

        /// <summary>
        /// 收到消息，资源下载地址无效，无法下载
        /// </summary>
        kNIMLocalResMsgUrlInvalid = 10414,

        /// <summary>
        /// 收到消息，本地资源已存在，不需要重复下载
        /// </summary>
        kNIMLocalResMsgFileExist = 10417,

        /// <summary>
        /// 调用api，传入的参数有误
        /// </summary>
        kNIMLocalResParaError = 10450,

        /// <summary>
        /// 发送消息，上传NOS失败
        /// </summary>
        kNIMLocalResMsgSendNosError = 10502,

        /// <summary>
        /// 导入消息历史时验证身份和加密密钥不通过
        /// </summary>
        kNIMLocalResCheckMsgDBFailed = 10600,

        /// <summary>
        /// 导入消息历史时写记录失败
        /// </summary>
        kNIMLocalResImportMsgDBFailed = 10601,

        //客户端自定义的RTS错误号
        /// <summary>
        /// rts会话 未知错误
        /// </summary>
        kNIMLocalResRtsError = 11100,

        /// <summary>
        /// rts会话 id不存在 
        /// </summary>
        kNIMLocalResRtsIdNotExist = 11101,

        /// <summary>
        /// rts会话 音视频已存在
        /// </summary>
        kNIMLocalResRtsVChatExist = 11417,

        /// <summary>
        /// rts会话 通道状态不正确
        /// </summary>
        kNIMLocalResRtsStatusError = 11501,

        /// <summary>
        /// rts会话 通道不存在
        /// </summary>
        kNIMLocalResRtsChannelNotExist = 11510,
        #endregion

        #region 客户端自定义的api调用问题
        /// <summary>
        ///还未初始化或初始化未正常完成 
        /// </summary>
        kNIMLocalResAPIErrorInitUndone = 20000,

        /// <summary>
        ///还未登陆或登录未完成 
        /// </summary>
        kNIMLocalResAPIErrorEnterUndone = 20001,

        /// <summary>
        ///已经登录 
        /// </summary>
        kNIMLocalResAPIErrorEntered = 20002,

        /// <summary>
        ///SDK版本不对，可能会引发其他问题 
        /// </summary>
        kNIMLocalResAPIErrorVersionError = 20003, 
        #endregion


    }
}
