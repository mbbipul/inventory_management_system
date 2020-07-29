using System;

namespace inventory_rest_api.Models
{
    public static class AppUtils
    {
        public static DateTime DateTime(long unixDate){

            DateTime start = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            DateTime date= start.AddMilliseconds(unixDate).ToLocalTime();
            return date;
        }

        public static DateTime DateTime(string unixDate){
            long dt = long.Parse(unixDate);
            DateTime start = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            DateTime date= start.AddMilliseconds(dt).ToLocalTime();
            return date;
        }
    }
}