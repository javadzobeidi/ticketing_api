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


public sealed record GetTicketsListForManager() : IQuery<List<TicketListItem>>
{
    public string StartDate { set; get; }
    public string EndDate { set; get; }
    public int Status { set; get; }

}

public record TicketListItem
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


public sealed class GetTicketsListForManagerValidation : AbstractValidator<GetTicketsListForManager>
{
    public GetTicketsListForManagerValidation()
    {
       
    }
}

public sealed class GetTicketsListForManagerHandler(
    IApplicationDbContext context,IMediator mediator,
    IUser user) 
    : IQueryHandler<GetTicketsListForManager, List<TicketListItem>>
{
    
    public async ValueTask<List<TicketListItem>> Handle(GetTicketsListForManager request, CancellationToken cancellationToken)
    {
        
        var currentUser=await mediator.Send(new GetUserByIdQuery(user.UserId));

        var departments=currentUser.UserDepartments.Select(d => new
        {
            d.CityId,
            d.BranchId,
            d.DepartmentId
        }).ToList();
        
        var cityIds =currentUser.UserDepartments.Select(x => x.CityId).Distinct().ToList();
        var branchIds = currentUser.UserDepartments.Select(x => x.BranchId).Distinct().ToList();
        var departmentIds = currentUser.UserDepartments.Select(x => x.DepartmentId).Distinct().ToList();
      
        var predicate = PredicateBuilder.New<Ticket>(true);
        
        foreach (var filter in departments)
        {
            var localFilter = filter; 
    
           predicate = predicate.Or(appt => 
                appt.CityId == localFilter.CityId &&
                appt.DepartmentId == localFilter.DepartmentId &&
                appt.BranchId == localFilter.BranchId
            );
        }
        predicate = predicate.Or(d => d.CurrentAssignmentUserId == user.UserId);
        predicate = predicate.Or(d => d.TicketAssignments.Any(a => a.ToUserId == user.UserId));

        if (string.IsNullOrEmpty(request.StartDate) && string.IsNullOrEmpty(request.EndDate))
        {
            DateTime startDate = request.StartDate.ToDateTime();
            DateTime endDate = request.EndDate.ToDateTime();
        //    predicate=   predicate.And(d=>d.TicketDate.Date>=startDate.Date && d.TicketDate.Date<=endDate.Date);

        }

        if (request.Status > 0)
        {
       //     predicate=   predicate.And(d=>d.TicketStatusId==request.Status );
        }

       var lst= context.Tickets.ToList();
        
        var appotinetms=context.Tickets
            .OrderBy(d=>d.TicketDate)
            .AsExpandable().Where(predicate)
            .Select(d => new TicketListItem
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

