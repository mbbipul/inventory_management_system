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

        public static bool IsDateSame(string date1,DateTime d2){

            DateTime d1 = DateTime(date1);

            return d1.Day == d2.Day && d1.Month == d2.Month 
                        && d1.Year == d2.Year;

        }
    }
}