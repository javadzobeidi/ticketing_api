namespace KhzCeoTicketingApi.Application.Reports.Contracts;

public record DepartmentPerformanceReportDto
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    
    // آمارهای کلی واحد
    public int TotalTickets { get; set; }       // کل تیکت‌های واحد در این تاریخ
    public int UnassignedTickets { get; set; }  // تیکت‌هایی که در کارتابل واحد مانده و کسی نگرفته
    public int OpenTickets { get; set; }        // کل تیکت‌های باز واحد
    public int ClosedTickets { get; set; }      // کل تیکت‌های بسته واحد
    
    // لیست عملکرد تک تک کارشناسان داخل این واحد
    public List<DepartmentUserPerformanceDto> Users { get; set; } = new();
}

// گزارش عملکرد هر فرد روی تیکت‌هایی که برداشته
public record DepartmentUserPerformanceDto
{
    public long? UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    
    public int HandledTicketsCount { get; set; } // چند تیکت دست این شخص است؟
    public int AnsweredCount { get; set; }       // در چندتا از آن‌ها جواب داده است؟
    public int ForwardedCount { get; set; }      // چندبار ارجاع داده است؟
    public int OpenTickets { get; set; }         // چند تیکت باز دستش مانده؟
    public int ClosedTickets { get; set; }       // چند تیکت را بسته؟
}