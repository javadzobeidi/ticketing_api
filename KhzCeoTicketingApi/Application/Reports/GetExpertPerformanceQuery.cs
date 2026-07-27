using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Reports.Contracts;
using KhzCeoTicketingApi.Domains.Entities;
using KhzCeoTicketingApi.Domains.Enums;


using LinqKit;
using Microsoft.EntityFrameworkCore;
using KhzCeoTicketingApi.Domains.Enums;
using KhzCeoTicketingApi.Application.Extensions;

namespace KhzCeoTicketingApi.Application.Reports
{
    public sealed record GetExpertPerformanceQuery : IQuery<List<ExpertPerformanceDto>>
    {
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public int? CityId { get; set; }
        public int? BranchId { get; set; }
        public int? DepartmentId { get; set; }
    }

    public sealed class GetExpertPerformanceQueryHandler(IApplicationDbContext context) 
        : IQueryHandler<GetExpertPerformanceQuery, List<ExpertPerformanceDto>>
    {
        public async ValueTask<List<ExpertPerformanceDto>> Handle(GetExpertPerformanceQuery request, CancellationToken cancellationToken)
        {
            var predicate = PredicateBuilder.New<Ticket>(true);

            // 1. فیلترهای مکانی (در صورت ارسال از سمت کلاینت)
            if (request.CityId.HasValue && request.CityId > 0)
                predicate = predicate.And(t => t.CityId == request.CityId);

            if (request.BranchId.HasValue && request.BranchId > 0)
                predicate = predicate.And(t => t.BranchId == request.BranchId);

            if (request.DepartmentId.HasValue && request.DepartmentId > 0)
                predicate = predicate.And(t => t.DepartmentId == request.DepartmentId);

            // 2. فیلتر تاریخ
            if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
            {
                DateTime startDate = request.StartDate.ToDateTime();
                DateTime endDate = request.EndDate.ToDateTime();
                predicate = predicate.And(t => t.TicketDate.Date >= startDate.Date && t.TicketDate.Date <= endDate.Date);
            }
        
            // لیست وضعیت‌های باز (مشابه منطق خودتان)
            var openTicketsStatus = new List<int> { 1, 2, 3, 5 };

            // 3. اجرای کوئری و گروه‌بندی بر اساس کارشناس
            var expertsData = await context.Tickets
                .AsNoTracking()
                .AsExpandable()
                .Where(predicate)
                .Where(t => t.CurrentAssignmentUserId != null) // فقط تیکت‌هایی که به کارشناس ارجاع شده‌اند
                .GroupBy(t => new 
                { 
                    t.CurrentAssignmentUser!.UserId,
                    t.CurrentAssignmentUser.FirstName,
                    t.CurrentAssignmentUser.LastName,
                    DepartmentName = t.Department.Title,
                    CityName = t.City.Title,
                    BranchName = t.Branch.Title
                })
                .Select(g => new ExpertPerformanceDto
                {
                    Id = g.Key.UserId,
                    Name = $"{g.Key.FirstName} {g.Key.LastName}",
                    Department = g.Key.DepartmentName,
                    City = g.Key.CityName,
                    Branch = g.Key.BranchName,
              
                    AssignedCount = g.Count(),
                
                    ClosedCount = g.Count(t => t.TicketStatusId == (int)TicketStatusEnum.Closed),
                
                    // تعداد باز (فعال)
                    ActiveTickets = g.Count(t => openTicketsStatus.Contains(t.TicketStatusId)),
                
                    // مواردی که باید بر اساس دیتابیس شما شخصی‌سازی شوند:
                    AnsweredCount = g.Count(t => t.TicketMessages.Any(m => m.SenderId == g.Key.UserId)), 
                    AvgResponseTime = 0, 
                    AvgRating = 0       
                })
                .OrderByDescending(x => x.AssignedCount)
                .ToListAsync(cancellationToken);

            return expertsData;
        }
    }
}