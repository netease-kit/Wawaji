using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace NimUtility.Json
{
    class JsonKeyValuePairConverter : Newtonsoft.Json.JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return true;
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.None)
                reader.Read();

            var value = CreateJsonValue(reader, serializer);
            if (value == null)
                return null;
            if (!objectType.IsInstanceOfType(value))
                throw new JsonSerializationException(string.Format("Could not convert '{0}' to '{1}'.", value.GetType(), objectType));

            return value;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// 解析json字段的值;
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        private object CreateJsonValue(Newtonsoft.Json.JsonReader reader, Newtonsoft.Json.JsonSerializer serializer)
        {
            while (reader.TokenType == Newtonsoft.Json.JsonToken.Comment)
            {
                if (!reader.Read())
                    throw new JsonSerializationException("Unexpected end.");
            }

            switch (reader.TokenType)
            {
                case JsonToken.StartObject:
                    {
                        return CreateJsonObject(reader, serializer);
                    }
                case JsonToken.StartArray:
                    {
                        var list = new List<object>();

                        while (reader.Read())
                        {
                            switch (reader.TokenType)
                            {
                                case JsonToken.EndArray:
                                    return list;
                                default:
                                    var value = CreateJsonValue(reader, serializer);
                                    list.Add(value);
                                    break;
                            }
                        }
                    }
                    break;
                case JsonToken.Integer:
                    return System.Convert.ToInt64(reader.Value, CultureInfo.InvariantCulture);
                case JsonToken.Float:
                    return System.Convert.ToDouble(reader.Value, CultureInfo.InvariantCulture);
                case JsonToken.Boolean:
                    return System.Convert.ToBoolean(reader.Value, CultureInfo.InvariantCulture);
                case JsonToken.String:
                case JsonToken.Bytes:
                case JsonToken.Date:
                    return reader.Value.ToString();
                case JsonToken.Null:
                    return null;
                default:
                    throw new JsonSerializationException("Unexpected or unsupported token: {0}" + reader.TokenType);
            }

            throw new JsonSerializationException("Unexpected end.");
        }
        /// <summary>
        /// 递归创建对象;
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        private object CreateJsonObject(JsonReader reader, JsonSerializer serializer)
        {
            var dict = new Dictionary<string, object>();
            string propertyName = null;

            while (reader.Read())
            {
                switch (reader.TokenType)
                {
                    case JsonToken.PropertyName:
                        propertyName = (string)reader.Value;
                        break;
                    case JsonToken.EndObject:
                        return dict;
                    case JsonToken.Comment:
                        break;
                    default:
                        var propertyValue = CreateJsonValue(reader, serializer);
                        dict[propertyName] = propertyValue;
                        break;
                }
            }

            throw new JsonSerializationException("Unexpected end.");
        }
    }
}
