using System.Globalization;

namespace KhzCeoTicketingApi.Application.Extensions;

public static  class DateTimeExtensions
{
    private static readonly PersianCalendar _persianCalendar = new PersianCalendar();

    public static string ToPersianDate(this DateTime date)
    {
        int year = _persianCalendar.GetYear(date);
        int month = _persianCalendar.GetMonth(date);
        int day = _persianCalendar.GetDayOfMonth(date);

        return $"{year:0000}/{month:00}/{day:00}";
    }
    public static string ToPersianDateTime(this DateTime date)
    {
        int year = _persianCalendar.GetYear(date);
        int month = _persianCalendar.GetMonth(date);
        int day = _persianCalendar.GetDayOfMonth(date);
        int hour = _persianCalendar.GetHour(date);
        int minute = _persianCalendar.GetMinute(date);

        return $"{year:0000}/{month:00}/{day:00} {hour:00}:{minute:00}";
    }
    public static  DateTime ToDateTime(this string persianDate)
    {
        if (string.IsNullOrWhiteSpace(persianDate))
            throw new Exception("تاریخ معتبر نمی باشد");

        var parts = persianDate.Split('/');
        if (parts.Length != 3)
            throw new Exception("تاریخ معتبر نمی باشد");

        int year = int.Parse(parts[0]);
        int month = int.Parse(parts[1]);
        int day = int.Parse(parts[2]);

        PersianCalendar pc = new PersianCalendar();
        return pc.ToDateTime(year, month, day, 0, 0, 0, 0);
    }
    public static  string ToTime(this DateTime dateTime)
    {
        return $"{dateTime.Hour:00}:{dateTime.Minute:00}";
        
    }
}
