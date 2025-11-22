
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Domains.Entities;

namespace Application;


public sealed record GetDashboardUserCommand() : IQuery<DashboardUserResult>
{
}

public record DashboardUserResult
{
    public long TicketCount { set; get; }
    public long ActiveUsers { set; get; }
    public long AppointmentCount { set; get; }
    public List<RecentTicket> RecentTickets { set; get; } = new List<RecentTicket>();
}

public class RecentTicket
{
    public string Message { set; get; }
    public string Status { set; get; }
    public Guid Code { set; get; }
    public string Date { set; get; }
    public long Id { set; get; }
    public bool IsAdminRoute { set; get; }
}
public sealed record GetDashboardUserCommandHandler(IApplicationDbContext context,IUser user) : IQueryHandler<GetDashboardUserCommand, DashboardUserResult>
{
    public async ValueTask<DashboardUserResult> Handle(GetDashboardUserCommand query,CancellationToken cancellationToken )
    {
        DashboardUserResult result=new DashboardUserResult();
        result.TicketCount=await context.Tickets.Where(d=>d.UserId==user.UserId).CountAsync(cancellationToken: cancellationToken);
        result.ActiveUsers=await context.Users.Where(d=>d.IsActive==true).CountAsync(cancellationToken: cancellationToken);

    result.RecentTickets= await   context.Tickets.Where(d => d.UserId == user.UserId || d.CurrentAssignmentUserId == user.UserId)
            .OrderByDescending(d => d.Id).Select(d => new RecentTicket
            {
                Id=d.Id,
                Message = d.Description,
                Status = d.TicketStatus.Title,
                Code = d.IdentityCode,
                Date = d.DateFa,
                IsAdminRoute=d.UserId != user.UserId
                
            }).Take(5).AsNoTracking().ToListAsync(cancellationToken);

       return result;
    }
}





