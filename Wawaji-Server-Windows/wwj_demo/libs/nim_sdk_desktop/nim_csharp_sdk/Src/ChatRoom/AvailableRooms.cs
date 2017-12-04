using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace NIMChatRoom
{
    /// <summary>
    /// 查询可用的聊天室
    /// </summary>
    public class AvailableRooms
    {
        private readonly string _appKey;
        public AvailableRooms(string appkey)
        {
            _appKey = appkey;
        }

        public List<ChatRoomInfo> Search()
        {
            var url = NimUtility.ConfigReader.GetChatRommListServerUrl();
            if (url == null)
                return null;
            var request = WebRequest.Create(url);
            request.Headers["appKey"] = _appKey;
            var response = request.GetResponse();
            var stream = response.GetResponseStream();
            List<ChatRoomInfo> result = null;
            if (stream != null)
            {
                StreamReader reader = new StreamReader(stream);
                var content = reader.ReadToEnd();
                stream.Close();
                reader.Close();
                result = ParseResponseJson(content);
            }
            return result;
        }

        List<ChatRoomInfo> ParseResponseJson(string jsonContent)
        {
            JObject jObj = JObject.Parse(jsonContent);
            var resToken = jObj.SelectToken("res");
            var listToken = jObj.SelectToken("msg.list");
            if (resToken == null || resToken.ToObject<int>() != 200 || listToken == null)
                return null;
            
            var rooms = listToken.ToArray();
            List<ChatRoomInfo> roomList = new List<ChatRoomInfo>();
            foreach (var r in rooms)
            {
                var room = new ChatRoomInfo();
                room.RoomId = r.Value<int>("roomid");
                room.RoomName = r.Value<string>("name");
                room.CreatorId = r.Value<string>("creator");
                room.OnlineMembersCount = r.Value<int>("onlineusercount");
                room.Valid = r.Value<int>("status");
                room.Extension = new NimUtility.Json.JsonExtension(r.SelectToken("ext"));
                room.Announcement = r.Value<string>("announcement");
                room.BroadcastUrl = r.Value<string>("broadcasturl");
                roomList.Add(room);

            }
            return roomList;
        }
    }
}
