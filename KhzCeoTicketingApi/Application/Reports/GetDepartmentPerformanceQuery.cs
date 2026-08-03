using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Domains.Entities;
using KhzCeoTicketingApi.Domains.Enums;
using KhzCeoTicketingApi.Application.Extensions;
using LinqKit;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Reports
{
    // مدل خروجی گزارش واحدها
    public sealed class DepartmentPerformanceDto
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int TotalTickets { get; set; }
        public int UnassignedTickets { get; set; } // منتظر ارجاع به کارشناس
        public int ActiveTickets { get; set; }     // در دست اقدام کارشناسان
        public int ClosedTickets { get; set; }     // حل شده
    }

    public sealed record GetDepartmentPerformanceQuery : IQuery<List<DepartmentPerformanceDto>>
    {
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public int? CityId { get; set; }
        public int? BranchId { get; set; }
        // فیلتر دپارتمان را اینجا نیاوردیم چون این گزارش کل دپارتمان‌ها را مقایسه می‌کند
    }

    public sealed class GetDepartmentPerformanceQueryHandler(IApplicationDbContext context) 
        : IQueryHandler<GetDepartmentPerformanceQuery, List<DepartmentPerformanceDto>>
    {
        public async ValueTask<List<DepartmentPerformanceDto>> Handle(GetDepartmentPerformanceQuery request, CancellationToken cancellationToken)
        {
            var predicate = PredicateBuilder.New<Ticket>(true);

            // فیلترهای تاریخ و مکان
            if (request.CityId.HasValue && request.CityId > 0)
                predicate = predicate.And(t => t.CityId == request.CityId);

            if (request.BranchId.HasValue && request.BranchId > 0)
                predicate = predicate.And(t => t.BranchId == request.BranchId);

            if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
            {
                DateTime startDate = request.StartDate.ToDateTime();
                DateTime endDate = request.EndDate.ToDateTime();
                predicate = predicate.And(t => t.TicketDate.Date >= startDate.Date && t.TicketDate.Date <= endDate.Date);
            }

            var openTicketsStatus = new List<int> 
            { 
                (int)TicketStatusEnum.Open, 
                (int)TicketStatusEnum.AnsweredByStaff, 
                (int)TicketStatusEnum.AnsweredByUser, 
                (int)TicketStatusEnum.Referred 
            };

            // گروه‌بندی بر اساس واحدها و شمارش وضعیت‌ها
            var departmentsData = await context.Tickets
                .AsNoTracking()
                .Where(predicate)
                .GroupBy(t => new { t.DepartmentId, t.Department.Title })
                .Select(g => new DepartmentPerformanceDto
                {
                    DepartmentId = g.Key.DepartmentId,
                    DepartmentName = g.Key.Title,
                    TotalTickets = g.Count(),
                    
                    // تیکت‌هایی که وضعیتشان باز است اما هیچ کارشناسی ندارند
                    UnassignedTickets = g.Count(t => t.CurrentAssignmentUserId == null && openTicketsStatus.Contains(t.TicketStatusId)),
                    
                    // تیکت‌هایی که باز هستند و الان دست یک کارشناس می‌باشند
                    ActiveTickets = g.Count(t => t.CurrentAssignmentUserId != null && openTicketsStatus.Contains(t.TicketStatusId)),
                    
                    // تیکت‌های بسته شده
                    ClosedTickets = g.Count(t => t.TicketStatusId == (int)TicketStatusEnum.Closed)
                })
                .OrderByDescending(x => x.TotalTickets) // مرتب‌سازی از پرکارترین واحد به کم‌کارترین
                .ToListAsync(cancellationToken);

            return departmentsData;
        }
    }
}