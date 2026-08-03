using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Reports.Contracts;
using KhzCeoTicketingApi.Domains.Entities;
using KhzCeoTicketingApi.Domains.Enums;
using KhzCeoTicketingApi.Application.Extensions;
using LinqKit;
using Microsoft.EntityFrameworkCore;

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

            // 1. فیلترهای مکانی
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
        
            // جایگزینی اعداد هاردکد شده با Enum
            var openTicketsStatus = new List<int> 
            { 
                (int)TicketStatusEnum.Open, 
                (int)TicketStatusEnum.AnsweredByStaff, 
                (int)TicketStatusEnum.AnsweredByUser, 
                (int)TicketStatusEnum.Referred 
            };

            // 3. اجرای کوئری
           var ticketsQuery = context.Tickets.AsNoTracking().AsExpandable().Where(predicate);

    // 2. آمار تیکت‌های در دست اقدام و مختومه (از جدول Tickets)
    var currentStats = await ticketsQuery
        .Where(t => t.CurrentAssignmentUserId != null)
        .GroupBy(t => t.CurrentAssignmentUserId)
        .Select(g => new 
        {
            UserId = (long)g.Key!,
            ActiveCount = g.Count(t => openTicketsStatus.Contains(t.TicketStatusId)),
            ClosedCount = g.Count(t => t.TicketStatusId == (int)TicketStatusEnum.Closed)
        }).ToListAsync(cancellationToken);

    // 3. آمار ارجاع داده شده - Referred (از جدول TicketAssignments)
    var referredStats = await context.TicketAssignments
        .AsNoTracking()
        .Where(ta => ta.FromUserId != null && ticketsQuery.Any(t => t.Id == ta.TicketId))
        .GroupBy(ta => ta.FromUserId)
        .Select(g => new { UserId = (long)g.Key!, ReferredCount = g.Count() })
        .ToListAsync(cancellationToken);

    // 4. آمار ارجاع گرفته شده - Assigned (از جدول TicketAssignments)
    var currentAssignments = ticketsQuery
        .Where(t => t.CurrentAssignmentUserId != null)
        .Select(t => new { UserId = (long)t.CurrentAssignmentUserId!, TicketId = t.Id });
    
    var historicalAssignments = context.TicketAssignments
        .Where(ta => ta.FromUserId != null && ticketsQuery.Any(t => t.Id == ta.TicketId))
        .Select(ta => new { UserId = (long)ta.FromUserId!, TicketId = ta.TicketId });
    
    var assignedStats = await currentAssignments
        .Union(historicalAssignments)
        .Distinct()
        .GroupBy(x => x.UserId)
        .Select(g => new { UserId = g.Key, AssignedCount = g.Count() })
        .ToListAsync(cancellationToken);
    
    
    // 5. آمار پاسخ‌گویی - Answered (از جدول TicketMessages)
    // Distinct: برای اینکه اگر کارشناس ۱۰ پیام روی یک تیکت داد، فقط یک "تیکتِ پاسخ داده شده" شمرده شود
    var answeredStats = await context.TicketMessages
        .AsNoTracking()
        .Where(m => m.IsFromStaff && ticketsQuery.Any(t => t.Id == m.TicketId))
        .Select(m => new { m.TicketId, m.SenderId })
        .Distinct()
        .GroupBy(m => m.SenderId)
        .Select(g => new { UserId = g.Key, AnsweredCount = g.Count() })
        .ToListAsync(cancellationToken);

    
    
    // 6. استخراج آیدی تمام کارشناسانی که در این بازه فعالیتی داشته‌اند
    var firstResponses = await context.TicketMessages
        .AsNoTracking()
        .Where(m => m.IsFromStaff && ticketsQuery.Any(t => t.Id == m.TicketId))
        .GroupBy(m => new { m.SenderId, m.TicketId, m.Ticket.TicketDate })
        .Select(g => new 
        {
            UserId = g.Key.SenderId,
            // پیدا کردن اولین پیامِ شخص در آن تیکت و محاسبه زمان به دقیقه
            ResponseMinutes = EF.Functions.DateDiffMinute(g.Key.TicketDate, g.Min(m => m.SentAt))
        })
        .ToListAsync(cancellationToken);
    
    var avgResponseStats = firstResponses
        .GroupBy(x => x.UserId)
        .Select(g => new 
        {
            UserId = g.Key,
            // میانگین با یک رقم اعشار
            AvgTime = Math.Round(g.Average(x => (double?)x.ResponseMinutes) ?? 0, 1) 
        })
        .ToList();
    
    
    
    
    var allUserIds = currentStats.Select(x => x.UserId)
        .Union(referredStats.Select(x => x.UserId))
        .Union(assignedStats.Select(x => x.UserId))
        .Union(answeredStats.Select(x => x.UserId))
        .Distinct()
        .ToList();

    if (!allUserIds.Any())
        return new List<ExpertPerformanceDto>();

    // 7. واکشی اطلاعات هویتی و سازمانی کارشناسان
    var usersInfo = await context.Users
        .AsNoTracking()
        .Where(u => allUserIds.Contains(u.UserId))
        .Select(u => new 
        {
            u.UserId,
            u.FirstName,
            u.LastName,
            CityTitle = u.City.Title,
            DepartmentTitle = u.UserDepartments.Select(ud => ud.Department.Title).FirstOrDefault(),
            BranchTitle = u.UserDepartments.Select(ud => ud.Branch.Title).FirstOrDefault()
        }).ToListAsync(cancellationToken);

    // 8. ادغام بسیار سریع داده‌ها در حافظه RAM سرور 
    var result = usersInfo.Select(u => new ExpertPerformanceDto
    {
        Id = u.UserId,
        Name = $"{u.FirstName} {u.LastName}",
        City = u.CityTitle,
        Department = u.DepartmentTitle,
        Branch = u.BranchTitle,

        ActiveTickets = currentStats.FirstOrDefault(x => x.UserId == u.UserId)?.ActiveCount ?? 0,
        ClosedCount = currentStats.FirstOrDefault(x => x.UserId == u.UserId)?.ClosedCount ?? 0,
        ReferredCount = referredStats.FirstOrDefault(x => x.UserId == u.UserId)?.ReferredCount ?? 0,
        AssignedCount = assignedStats.FirstOrDefault(x => x.UserId == u.UserId)?.AssignedCount ?? 0,
        AnsweredCount = answeredStats.FirstOrDefault(x => x.UserId == u.UserId)?.AnsweredCount ?? 0,
        
        AvgResponseTime = avgResponseStats.FirstOrDefault(x => x.UserId == u.UserId)?.AvgTime ?? 0,
        
        AvgRating = 0
    })
    .OrderByDescending(x => x.AssignedCount)
    .ToList();
    
            
            return result;
        }
    }
}