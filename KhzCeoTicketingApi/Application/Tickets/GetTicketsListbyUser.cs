using Application.Common.Exceptions;
using Application.Common.Interfaces;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Application.Extensions;
using KhzCeoTicketingApi.Application.Users;
using KhzCeoTicketingApi.Domains.Entities;
using KhzCeoTicketingApi.Domains.Enums;
using LinqKit;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;


public sealed record GetTicketsListbyUser() : IQuery<List<TicketListUserItem>>
{
    public int Status { set; get; }

}

public record TicketListUserItem
{

    public Guid Code { set; get; }
    public string User { set; get; }
    public string Date { set; get; }
    public string Time { set; get; }
    public string City { set; get; }
    public string Status { set; get; }
    public int StatusId { set; get; }
    public string ResponseLastUser { set; get; }
    public string Branch { set; get; }
    public string Department { set; get; }
    

}


public sealed class GetTicketsListbyUserValidation : AbstractValidator<GetTicketsListbyUser>
{
    public GetTicketsListbyUserValidation()
    {
       
    }
}

public sealed class GetTicketsListbyUserHandler(
    IApplicationDbContext context,IMediator mediator,
    IUser user) 
    : IQueryHandler<GetTicketsListbyUser, List<TicketListUserItem>>
{
    
    public async ValueTask<List<TicketListUserItem>> Handle(GetTicketsListbyUser request, CancellationToken cancellationToken)
    {
       
        var predicate = PredicateBuilder.New<Ticket>(true);
     
        predicate = predicate.Start(d => d.UserId == user.UserId);

        if (request.Status > 0)
        {
            /// پاسخ کارناش پاسخ کاربر و پاسخ  ارجاع اگر وضعیت تیک باز باشه میشه 
            if (request.Status==2)
                predicate=   predicate.And(d=>d.TicketStatusId==2 || d.TicketStatusId==3 || d.TicketStatusId==5 );
            else
         predicate=   predicate.And(d=>d.TicketStatusId==request.Status );
        }

       var lst= context.Tickets.ToList();
        
        var appotinetms=context.Tickets
            .OrderBy(d=>d.TicketDate)
            .AsExpandable().Where(predicate)
            .Select(d => new TicketListUserItem
            {
                User = d.User != null ? d.User.FirstName + " " + d.User.LastName : "بدون کاربر",                
                Date = d.DateFa,
                Time = d.TimeFa,
                Code = d.IdentityCode,
                Branch = d.Branch.Title,
                Department = d.Department.Title,
                City=d.City.Title,
                Status = d.TicketStatus.Title,
                StatusId = d.TicketStatusId,
               ResponseLastUser = d.LastResponderUser != null 
                   ? $"{d.LastResponderUser.FirstName} {d.LastResponderUser.LastName}" 
                   : "بدون پاسخ"
               
            })
            .AsNoTracking() .ToList();
        
        
        return appotinetms;

    }
}

