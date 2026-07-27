namespace KhzCeoTicketingApi.Application.Reports.Contracts;

public record ExpertPerformanceDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Branch { get; set; } = string.Empty;
    
    public int AssignedCount { get; set; } // کل تیکت‌های تخصیص یافته
    public int AnsweredCount { get; set; } // پاسخ داده شده (فعلاً معادل کل در نظر گرفتیم تا منطق شما مشخص شود)
    public int ClosedCount { get; set; }   // بسته شده‌ها
    public int ActiveTickets { get; set; } // تیکت‌های باز/فعال
    
    public double AvgResponseTime { get; set; } // میانگین زمان پاسخگویی (نیاز به محاسبه دارد)
    public double AvgRating { get; set; }       // امتیاز (در صورت داشتن سیستم امتیازدهی)
}