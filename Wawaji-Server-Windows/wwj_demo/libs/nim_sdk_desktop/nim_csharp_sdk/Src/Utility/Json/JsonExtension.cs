using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace NimUtility.Json
{
    class JExtConverter : Newtonsoft.Json.JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var ext = value as JsonExtension;
            if (ext == null)
                writer.WriteNull();
            else
            {
                writer.WriteValue(ext.Value);
            }
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.Value == null) return null;
            var v = reader.Value.ToString();
            if (!string.IsNullOrEmpty(v))
            {
                JToken token = JToken.Parse(v);
                NimUtility.Json.JsonExtension ext = new NimUtility.Json.JsonExtension(token);
                return ext;
            }
            return null;
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(NimUtility.Json.JsonExtension);
        }
    }

    /// <summary>
    /// json 序列化对象
    /// </summary>
    public class JsonExtension
    {
        public string Value { get; private set; }

        public JsonExtension(object obj)
        {
            Value = JsonParser.Serialize(obj);
        }
    }
}
