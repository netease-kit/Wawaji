namespace NIM.Friend
{
    public interface INIMFriendChangedInfo
    {
        [Newtonsoft.Json.JsonIgnore]
        NIMFriendChangeType ChangedType { get;}
    }

    public class FriendDeletedInfo:NimUtility.NimJsonObject<FriendDeletedInfo>, INIMFriendChangedInfo
    {
        [Newtonsoft.Json.JsonProperty("accid")]
        public string AccountId { get; set; }

        public NIMFriendChangeType ChangedType
        {
            get { return NIMFriendChangeType.kNIMFriendChangeTypeDel; }
        }
    }

    public class FriendRequestInfo:NimUtility.NimJsonObject<FriendRequestInfo>, INIMFriendChangedInfo
    {
        [Newtonsoft.Json.JsonProperty("accid")]
        public string AccountId { get; set; }

        [Newtonsoft.Json.JsonProperty("type")]
        public NIMVerifyType VerifyType { get; set; }

        [Newtonsoft.Json.JsonProperty("msg")]
        public string Message { get; set; }

        public NIMFriendChangeType ChangedType
        {
            get { return NIMFriendChangeType.kNIMFriendChangeTypeRequest; }
        }
    }

    public class FriendListSyncInfo:NimUtility.NimJsonObject<FriendListSyncInfo>, INIMFriendChangedInfo
    {
        public NIMFriendChangeType ChangedType
        {
            get { return NIMFriendChangeType.kNIMFriendChangeTypeSyncList; }
        }
        [Newtonsoft.Json.JsonProperty("list")]
        public NIMFriendProfile[] ProfileCollection { get; set; }
       
    }

    public class FriendUpdatedInfo:NimUtility.NimJsonObject<FriendUpdatedInfo>, INIMFriendChangedInfo
    {
        public NIMFriendChangeType ChangedType
        {
            get { return NIMFriendChangeType.kNIMFriendChangeTypeUpdate; }
        }

        [Newtonsoft.Json.JsonProperty("info")]
        public NIMFriendProfile Profile { get; set; }
    }
}
