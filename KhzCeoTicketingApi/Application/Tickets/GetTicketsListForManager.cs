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
    public string LastAssignmentUser { set; get; }
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

public class FindDepartmentModel
{
    public int CityId { set; get; }
    public int BranchId { set; get; }
    public int DepartmentId { set; get; }


}

public sealed class GetTicketsListForManagerHandler(
    IApplicationDbContext context,IMediator mediator,
    IUser user) 
    : IQueryHandler<GetTicketsListForManager, List<TicketListItem>>
{
    
    public async ValueTask<List<TicketListItem>> Handle(GetTicketsListForManager request, CancellationToken cancellationToken)
    {
        
        var currentUser=await mediator.Send(new GetUserByIdQuery(user.UserId));


     var originalDepartments=  await  context.Departments.AsNoTracking().ToListAsync(cancellationToken);

     List<FindDepartmentModel> models = new List<FindDepartmentModel>();
     
        
        var departments=currentUser.UserDepartments.Select(d => new
        {
            d.CityId,
            d.BranchId,
            d.DepartmentId
        }).ToList();

        List<int> departmentIds = new List<int>();
        foreach (var d in departments)
        {
           var currentDepartment= originalDepartments.Where(dep => dep.Id == d.DepartmentId).FirstOrDefault();
           
           if (currentDepartment!=null)
           {
              var deps= currentDepartment.GetFullHierarchy(originalDepartments).Select(f => f.Id).ToList();

              foreach (var dep_h in deps)
              {
                  models.Add(new FindDepartmentModel
                  {
                      DepartmentId = dep_h,
                      CityId = d.CityId,
                      BranchId = d.BranchId,
                  });
                  
              }
           }

        }
        
        var cityIds =currentUser.UserDepartments.Select(x => x.CityId).Distinct().ToList();
        var branchIds = currentUser.UserDepartments.Select(x => x.BranchId).Distinct().ToList();
      
        var predicate = PredicateBuilder.New<Ticket>(true);
        
        foreach (var filter in models)
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

    

        if (request.Status > 0)
        {
            var openTicketsStatus = new List<int>{1, 2, 3, 5};
            
            
            if (request.Status==2)
                predicate=   predicate.And(d=>openTicketsStatus.Contains( d.TicketStatusId) );
            else
                predicate=   predicate.And(d=>d.TicketStatusId==(int)TicketStatusEnum.Closed );
            
        }

        if ( request.Status!=2 && !string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
        {
            DateTime startDate = request.StartDate.ToDateTime();
            DateTime endDate = request.EndDate.ToDateTime();
            predicate=   predicate.And(d=>d.TicketDate.Date>=startDate.Date && d.TicketDate.Date<=endDate.Date);

        }
        
       var lst= context.Tickets.ToList();
        
        var appotinetms=context.Tickets
            .OrderBy(d=>d.TicketDate)
            .AsExpandable().Where(predicate)
            .Select(d => new TicketListItem
            {
                User = d.User != null ? d.User.FirstName + " " + d.User.LastName : "بدون کاربر",
                LastAssignmentUser=d.CurrentAssignmentUser!=null?d.CurrentAssignmentUser.FirstName+" "+d.CurrentAssignmentUser.LastName:"در انتظار کارشناس",

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

