using System;
using System.Text;
using KhzCeoTicketingApi.Infrastructure.Data;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Services;

public class CaptchaResultDto
{
    public string CaptchaImageBase64 { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}

public class CaptchaService : ICaptchaService 
{
    private readonly IDataProtector _protector;
    private readonly IMemoryCache _cache;
    
    public CaptchaService(IDataProtectionProvider provider, IMemoryCache cache)
    {
        _protector = provider.CreateProtector("Captcha.v1");
        _cache = cache;
    }

    public CaptchaResultDto GenerateCaptcha()
    {      
        Random rand = new Random();
        int num1 = rand.Next(1, 20); // اعداد بین ۱ تا ۲۰
        int num2 = rand.Next(1, 20);
        int sum = num1 + num2;
        
        string expiry = DateTime.Now.AddMinutes(2).ToString("yyyy-MM-dd HH:mm:ss");
        string uniqueId = Guid.NewGuid().ToString("N");
        string payload = $"{sum}|{expiry}|{uniqueId}";
        string token = _protector.Protect(payload);
        
        // تولید تصویر SVG به صورت Base64
        string base64String = GenerateSvgCaptchaImage(num1, num2, rand);
        
        return new CaptchaResultDto
        {
            // نوع تصویر به svg+xml تغییر کرده است
            CaptchaImageBase64 = $"data:image/svg+xml;base64,{base64String}",
            Token = token
        };
    }
    
    public bool VerifyCaptcha(string answer, string token)
    {
        try
        {
            string payload = _protector.Unprotect(token);
            string[] parts = payload.Split('|');
            string correctSum = parts[0];
            DateTime time = DateTime.Parse(parts[1]);
            string uniqueId = parts[2];

            if (_cache.Get(uniqueId) != null) return false;

            var cacheEntryOptions = new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(1));
            _cache.Set(uniqueId, true, cacheEntryOptions);

            if (DateTime.Now > time) return false;
            
            // تبدیل پاسخ کاربر (اگر فارسی تایپ کرده بود) به انگلیسی برای مقایسه
            string normalizedAnswer = ToEnglishNumber(answer);
            if (normalizedAnswer != correctSum) return false;

            return true;
        }
        catch
        {
            return false;
        }
    }
    
    private string GenerateSvgCaptchaImage(int num1, int num2, Random rand)
    {
        string[] colors = { "#0000FF", "#008000", "#FF0000", "#9400D3", "#00BFFF", "#FF8C00" };
        
        // تبدیل اعداد به فارسی
        string captchaText = $"{ToPersianNumber(num1.ToString())} + {ToPersianNumber(num2.ToString())} = ?";

        StringBuilder svg = new StringBuilder();
        svg.Append("<svg xmlns='http://www.w3.org/2000/svg' width='200' height='70'>");
        
        // 1. پس زمینه
        svg.Append("<rect width='200' height='70' fill='#f4f4f9' />");

        // 2. خطوط نویز (Noise Lines)
        for (int i = 0; i < 7; i++)
        {
            int x1 = rand.Next(0, 200);
            int y1 = rand.Next(0, 70);
            int x2 = rand.Next(0, 200);
            int y2 = rand.Next(0, 70);
            string color = colors[rand.Next(colors.Length)];
            svg.Append($"<line x1='{x1}' y1='{y1}' x2='{x2}' y2='{y2}' stroke='{color}' stroke-width='2' opacity='0.5' />");
        }

        // 3. رسم کاراکترها با چرخش و رنگ تصادفی
        int charX = 20;
        foreach (char c in captchaText)
        {
            if (c == ' ') 
            {
                charX += 10;
                continue;
            }

            int angle = rand.Next(-30, 30);
            int fontSize = rand.Next(24, 30);
            string color = colors[rand.Next(colors.Length)];
            int yPos = rand.Next(40, 50);

            // تگ text در SVG برای رسم حروف
            svg.Append($"<text x='{charX}' y='{yPos}' font-family='Tahoma, Arial, sans-serif' font-size='{fontSize}' font-weight='bold' fill='{color}' transform='rotate({angle}, {charX}, {yPos})'>{c}</text>");
            
            charX += 22; // فاصله بین حروف
        }

        svg.Append("</svg>");

        // تبدیل متن SVG به Base64
        byte[] svgBytes = Encoding.UTF8.GetBytes(svg.ToString());
        return Convert.ToBase64String(svgBytes);
    }

    // متد کمکی برای تبدیل اعداد انگلیسی به فارسی (برای نمایش در تصویر)
    private string ToPersianNumber(string input)
    {
        return input.Replace("0", "۰").Replace("1", "۱").Replace("2", "۲")
                    .Replace("3", "۳").Replace("4", "۴").Replace("5", "۵")
                    .Replace("6", "۶").Replace("7", "۷").Replace("8", "۸")
                    .Replace("9", "۹");
    }

    // متد کمکی برای تبدیل ورودی کاربر به انگلیسی (برای اعتبارسنجی)
    private string ToEnglishNumber(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return input;
        return input.Replace("۰", "0").Replace("۱", "1").Replace("۲", "2")
                    .Replace("۳", "3").Replace("۴", "4").Replace("۵", "5")
                    .Replace("۶", "6").Replace("۷", "7").Replace("۸", "8")
                    .Replace("۹", "9");
    }
}