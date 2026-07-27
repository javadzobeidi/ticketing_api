using KhzCeoTicketingApi.Application.Common.Interfaces;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using KhzCeoTicketingApi.Domains.Enums;
using KhzCeoTicketingApi.Domains.Entities;
using KhzCeoTicketingApi.Application.Extensions;
using KhzCeoTicketingApi.Application.Reports.Contracts;

namespace KhzCeoTicketingApi.Application.Reports;

public sealed record GetDepartmentPerformanceQuery : IQuery<List<DepartmentPerformanceReportDto>>
{
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public int? TargetDepartmentId { get; set; } // اگر نال باشد همه واحدها را می‌آورد
}

public sealed class GetDepartmentPerformanceQueryHandler(IApplicationDbContext context) 
    : IQueryHandler<GetDepartmentPerformanceQuery, List<DepartmentPerformanceReportDto>>
{
    public async ValueTask<List<DepartmentPerformanceReportDto>> Handle(GetDepartmentPerformanceQuery request, CancellationToken cancellationToken)
    {
        var predicate = PredicateBuilder.New<Ticket>(true);

        // 1. بررسی Hierarchy دپارتمان‌ها
        if (request.TargetDepartmentId.HasValue && request.TargetDepartmentId > 0)
        {
            var originalDepartments = await context.Departments
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            var targetDep = originalDepartments.FirstOrDefault(d => d.Id == request.TargetDepartmentId);
            if (targetDep != null)
            {
                // گرفتن شناسه خود دپارتمان و تمام فرزندانش
                var depIds = targetDep.GetFullHierarchy(originalDepartments).Select(d => d.Id).ToList();
                predicate = predicate.And(t => depIds.Contains(t.DepartmentId));
            }
        }

        // 2. فیلتر تاریخ
        if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
        {
            DateTime startDate = request.StartDate.ToDateTime();
            DateTime endDate = request.EndDate.ToDateTime();
            predicate = predicate.And(t => t.TicketDate.Date >= startDate.Date && t.TicketDate.Date <= endDate.Date);
        }

        var openTicketsStatus = new List<int> { 1, 2, 3, 5 };

        // 3. دریافت دیتای خام با Select (بسیار سبک برای دیتابیس)
        var rawStats = await context.Tickets
            .AsNoTracking()
            .AsExpandable()
            .Where(predicate)
            .Select(t => new 
            {
                t.DepartmentId,
                DepartmentTitle = t.Department.Title,
                t.CurrentAssignmentUserId,
                UserFirstName = t.CurrentAssignmentUser != null ? t.CurrentAssignmentUser.FirstName : null,
                UserLastName = t.CurrentAssignmentUser != null ? t.CurrentAssignmentUser.LastName : null,
                t.TicketStatusId,
                // آیا کارشناس فعلی، روی این تیکت پیامی ارسال کرده؟
                HasAnswered = t.TicketMessages.Any(m => m.SenderId == t.CurrentAssignmentUserId),
                // تعداد دفعاتی که این شخص تیکت را ارجاع داده
                ForwardedCount = t.TicketAssignments.Count(a => a.FromUserId == t.CurrentAssignmentUserId)
            })
            .ToListAsync(cancellationToken);

        // 4. پردازش و گروه‌بندی نهایی در حافظه سیستم (RAM)
        var reports = rawStats
            .GroupBy(x => new { x.DepartmentId, x.DepartmentTitle })
            .Select(depGroup => new DepartmentPerformanceReportDto
            {
                DepartmentId = depGroup.Key.DepartmentId,
                DepartmentName = depGroup.Key.DepartmentTitle,
                
                // آمارهای کل واحد
                TotalTickets = depGroup.Count(),
                UnassignedTickets = depGroup.Count(x => x.CurrentAssignmentUserId == null), // کسی نگرفته
                OpenTickets = depGroup.Count(x => openTicketsStatus.Contains(x.TicketStatusId)),
                ClosedTickets = depGroup.Count(x => x.TicketStatusId == (int)TicketStatusEnum.Closed),
                
                // لیست کارشناسان داخل این واحد و عملکردشان
                Users = depGroup
                    .Where(x => x.CurrentAssignmentUserId != null) // فقط تیکت‌هایی که دست کارشناس است
                    .GroupBy(u => new { u.CurrentAssignmentUserId, u.UserFirstName, u.UserLastName })
                    .Select(userGroup => new DepartmentUserPerformanceDto
                    {
                        UserId = userGroup.Key.CurrentAssignmentUserId,
                        UserName = $"{userGroup.Key.UserFirstName} {userGroup.Key.UserLastName}",
                        HandledTicketsCount = userGroup.Count(),
                        OpenTickets = userGroup.Count(x => openTicketsStatus.Contains(x.TicketStatusId)),
                        ClosedTickets = userGroup.Count(x => x.TicketStatusId == (int)TicketStatusEnum.Closed),
                        AnsweredCount = userGroup.Count(x => x.HasAnswered),
                        ForwardedCount = userGroup.Sum(x => x.ForwardedCount)
                    })
                    .OrderByDescending(u => u.HandledTicketsCount)
                    .ToList()
            })
            .OrderByDescending(d => d.TotalTickets)
            .ToList();

        return reports;
    }
}