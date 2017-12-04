/** @file NIMUserAPI.cs
  * @brief NIM SDK提供的用户相关接口
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using NIM.User.Delegate;
using System;
using System.Collections.Generic;

namespace NIM.User
{
    /// <summary>
    /// 获取好友关系结果回调
    /// </summary>
    /// <param name="code"></param>
    /// <param name="list"></param>
    public delegate void GetUserRelationshipResuleDelegate(ResponseCode code, UserSpecialRelationshipItem[] list);

    /// <summary>
    /// 获取用户名片结果回调
    /// </summary>
    /// <param name="list"></param>
    public delegate void GetUserNameCardResultDelegate(UserNameCard[] list);

    /// <summary>
    /// 更新名片结果回调
    /// </summary>
    /// <param name="response"></param>
    public delegate void UpdateNameCardResultDelegate(ResponseCode response);
    public class UserAPI
    {

        private static readonly SyncMutedAndBlacklistDelegate SyncMutedAndBlacklistCompleted;
        private static readonly UserNameCardChangedDelegate UserNameCardChanged;
        private static readonly GetUserNameCardDelegate GetUserNameCardCompleted;
        private static readonly UpdateUserNameCardDelegate UpdateNameCardCompleted;

        public static EventHandler<UserNameCardChangedArgs> UserNameCardChangedHandler;
        public static EventHandler<UserRelationshipSyncArgs> UserRelationshipListSyncHander;
        public static EventHandler<UserRelationshipChangedArgs> UserRelationshipChangedHandler;

        static UserAPI()
        {
            SyncMutedAndBlacklistCompleted = new SyncMutedAndBlacklistDelegate(OnGetUserRelationshipCompleted);
            UserNameCardChanged = new UserNameCardChangedDelegate(OnUserNameCardChanged);
            GetUserNameCardCompleted = new GetUserNameCardDelegate(OnGetUserNameCardCompleted);
            UpdateNameCardCompleted = new UpdateUserNameCardDelegate(OnNameCardUpdated);
            RegSpecialRelationshipChangedCb();
            RegUserNameCardChangedCb();
        }

        /// <summary>
        /// 统一注册用户属性变更通知回调函数（本地、多端同步黑名单、静音名单变更）
        /// </summary>
        /// <param name="cb">操作结果回调</param>
        private static void RegSpecialRelationshipChangedCb()
        {
            UserNativeMethods.nim_user_reg_special_relationship_changed_cb(null, OnRelationshipChanged, IntPtr.Zero);
        }

        private static readonly UserSpecialRelationshipChangedDelegate OnRelationshipChanged = (type, result, je, ptr) =>
        {
            if (type == NIMUserRelationshipChangeType.SyncMuteAndBlackList)
            {
                if (UserRelationshipListSyncHander != null)
                {
                    UserSpecialRelationshipItem[] items = null;
                    if (!string.IsNullOrEmpty(result))
                        items = NimUtility.Json.JsonParser.Deserialize<UserSpecialRelationshipItem[]>(result);
                    UserRelationshipSyncArgs args = new UserRelationshipSyncArgs(items);
                    UserRelationshipListSyncHander(null, args);
                }
            }
            else
            {
                if (UserRelationshipChangedHandler != null)
                {
                    var obj = Newtonsoft.Json.Linq.JObject.Parse(result);
                    var idToken = obj.SelectToken("accid");
                    var valueToken = obj.SelectToken(type == NIMUserRelationshipChangeType.AddRemoveBlacklist ? "black" : "mute");
                    var id = idToken.ToObject<string>();
                    var value = valueToken.ToObject<bool>();
                    UserRelationshipChangedArgs args = new UserRelationshipChangedArgs(type, id, value);
                    UserRelationshipChangedHandler(null, args);
                }
            }
            
        };

        /// <summary>
        /// 设置、取消设置黑名单.
        /// </summary>
        /// <param name="accountId"> 好友id.</param>
        /// <param name="inBlacklist">if set to <c>true</c> [set_black].</param>
        /// <param name="cb">操作结果回调.</param>
        public static void SetBlacklist(string accountId, bool inBlacklist, UserOperationDelegate cb)
        {
            UserNativeMethods.nim_user_set_black(accountId, inBlacklist, null, cb, IntPtr.Zero);
        }

        /// <summary>
        /// 设置、取消设置静音名单
        /// </summary>
        /// <param name="accountId">好友id</param>
        /// <param name="isMuted">取消或设置</param>
        /// <param name="cb">操作结果回调</param>
        public static void SetUserMuted(string accountId, bool isMuted, UserOperationDelegate cb)
        {
            UserNativeMethods.nim_user_set_mute(accountId, isMuted, null, cb, IntPtr.Zero);
        }

        /// <summary>
        /// 获取用户关系列表(黑名单和静音列表)
        /// </summary>
        /// <param name="resultDelegate"></param>
        public static void GetRelationshipList(GetUserRelationshipResuleDelegate resultDelegate)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(resultDelegate);
            UserNativeMethods.nim_user_get_mute_blacklist("Blacklist", SyncMutedAndBlacklistCompleted, ptr);
        }

        private static void OnGetUserRelationshipCompleted(ResponseCode response, string blacklistJson, string jsonExtension, IntPtr userData)
        {
            if (userData != IntPtr.Zero)
            {
                UserSpecialRelationshipItem[] items = NimUtility.Json.JsonParser.Deserialize<UserSpecialRelationshipItem[]>(blacklistJson);
                NimUtility.DelegateConverter.InvokeOnce<GetUserRelationshipResuleDelegate>(userData,response, (object) items);
            }
        }

        /// <summary>
        /// 统一注册用户名片变更通知回调函数
        /// </summary>
        private static void RegUserNameCardChangedCb()
        {
            UserNativeMethods.nim_user_reg_user_name_card_changed_cb(null, UserNameCardChanged, IntPtr.Zero);
        }

        private static void OnUserNameCardChanged(string resultJson, string jsonExtension, IntPtr userData)
        {
            if (string.IsNullOrEmpty(resultJson))
                return;
            var cards = NimUtility.Json.JsonParser.Deserialize<List<UserNameCard>>(resultJson);
            if (UserNameCardChangedHandler != null)
            {
                UserNameCardChangedHandler(null, new UserNameCardChangedArgs(cards));
            }
        }

        /// <summary>
        /// 获取本地的指定帐号的用户名片
        /// </summary>
        /// <param name="accountIdList"></param>
        /// <param name="resultDelegate"></param>
        public static void GetUserNameCard(List<string> accountIdList, GetUserNameCardResultDelegate resultDelegate)
        {
            var idJsonParam = NimUtility.Json.JsonParser.Serialize(accountIdList);
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(resultDelegate);
            UserNativeMethods.nim_user_get_user_name_card(idJsonParam, null, GetUserNameCardCompleted, ptr);
        }

        private static void OnGetUserNameCardCompleted(string resultJson, string jsonExtension, IntPtr userData)
        {
            if (string.IsNullOrEmpty(resultJson) || userData == IntPtr.Zero)
                return;
            var cards = NimUtility.Json.JsonParser.Deserialize<UserNameCard[]>(resultJson);
            NimUtility.DelegateConverter.InvokeOnce<GetUserNameCardResultDelegate>(userData, (object) cards);
        }

        /// <summary>
        /// 在线查询指定帐号的用户名片
        /// </summary>
        /// <param name="accountIdList"></param>
        /// <param name="resultDelegate"></param>
        public static void QueryUserNameCardOnline(List<string> accountIdList, GetUserNameCardResultDelegate resultDelegate)
        {
            var idJsonParam = NimUtility.Json.JsonParser.Serialize(accountIdList);
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(resultDelegate);
            UserNativeMethods.nim_user_get_user_name_card_online(idJsonParam, null, GetUserNameCardCompleted, ptr);
        }

        /// <summary>
        /// 更新用户名片
        /// </summary>
        /// <param name="card"></param>
        /// <param name="d"></param>
        public static void UpdateMyCard(UserNameCard card, UpdateNameCardResultDelegate d)
        {
            var json = card.Serialize();
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(d);
            UserNativeMethods.nim_user_update_my_user_name_card(json, null, UpdateNameCardCompleted, ptr);
        }

        private static void OnNameCardUpdated(ResponseCode response, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.InvokeOnce<UpdateNameCardResultDelegate>(userData, response);
        }
    }
}
