using System.Globalization;

namespace KhzCeoTicketingApi.Application.Extensions;

public static  class DateTimeExtensions
{
    public static  DateTime? ToPersianDate(this string persianDate)
    {
        if (string.IsNullOrWhiteSpace(persianDate)) return null;

        var parts = persianDate.Split('/');
        if (parts.Length != 3) return null;

        int year = int.Parse(parts[0]);
        int month = int.Parse(parts[1]);
        int day = int.Parse(parts[2]);

        PersianCalendar pc = new PersianCalendar();
        return pc.ToDateTime(year, month, day, 0, 0, 0, 0);
    }

}
