using System;

namespace NimUtility
{
    /// <summary>
    ///DateTimeConvert 
    /// </summary>
    public class DateTimeConvert
    {
        private static readonly DateTime StartedDateTime = new DateTime(1970, 1, 1,0,0,0,DateTimeKind.Utc);
        /// <summary>
        /// 将时间戳转换为DateTime类型
        /// </summary>
        /// <param name="timetag"></param>
        /// <param name="toLocalTime"></param>
        /// <returns></returns>
        public static DateTime FromTimetag(long timetag,bool toLocalTime = true)
        {
            var time = new DateTime(StartedDateTime.Ticks + timetag*10000);
            return toLocalTime ? time.ToLocalTime() : time;
        }

        /// <summary>
        /// 将Datetime类型转换为时间戳
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static long ToTimetag(DateTime dateTime)
        { 
            return (dateTime.ToUniversalTime().Ticks - StartedDateTime.Ticks)/10000;
        }
    }
}
