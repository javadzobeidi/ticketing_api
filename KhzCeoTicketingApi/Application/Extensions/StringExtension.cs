namespace KhzCeoTicketingApi.Application.Extensions;

public static class StringExtension
{
    public static string SafeFarsiStr(this string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        return input
            .Replace("ي", "ی") // ي عربی به ی فارسی
            .Replace("ك", "ک"); // ك عربی به ک فارسی
    }
    public static string FixEnglishNumber(this string persianNumber)
    {
        string englishNumber = "";
        foreach (char ch in persianNumber)
        {
            if (ch >= 1776 && ch <= 1785)
                englishNumber += char.GetNumericValue(ch);
            else
                englishNumber += ch;
        }
        return englishNumber;
    }
}
