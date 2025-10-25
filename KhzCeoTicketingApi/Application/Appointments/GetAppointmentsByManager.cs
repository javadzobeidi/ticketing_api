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


public sealed record GetAppointmentsByManager(string startDate,string endDate) : IQuery<List<AppointmentListManagerItem>>
{
    
    
}

public record AppointmentListManagerItem
{
    public string User { set; get; }
    public long Id { set; get; }

    public string Date { set; get; }

    public string Time { set; get; }
    public string City { set; get; }

    public string Status { set; get; }

    public string ResponseLastUser { set; get; }
    public string Branch { set; get; }

    public string Department { set; get; }
    

}


public sealed class GetAppointmentsByManagerValidation : AbstractValidator<GetAppointmentsByManager>
{
    public GetAppointmentsByManagerValidation()
    {
       
    }
}
public class FilterModel
{
    public int CityId { get; set; }
    public int DepartmentId { get; set; }
    public int BranchId { get; set; }
}
public sealed class GetAppointmentsByManagerHandler(
    IApplicationDbContext context,IMediator mediator,
    IUser user) 
    : IQueryHandler<GetAppointmentsByManager, List<AppointmentListManagerItem>>
{
    
    public async ValueTask<List<AppointmentListManagerItem>> Handle(GetAppointmentsByManager request, CancellationToken cancellationToken)
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
        
        
   
        
        DateTime startDate = request.startDate.ToDateTime();
        DateTime endDate = request.endDate.ToDateTime();
        
        var predicate = PredicateBuilder.New<Appointment>(false);
        
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
        predicate = predicate.Or(d => d.AppointmentAssignments.Any(a => a.ToUserId == user.UserId));
        predicate=   predicate.And(d=>d.AppointmentDate.Date>=startDate.Date && d.AppointmentDate.Date<=endDate.Date);
        var appotinetms=context.Appoinments.AsExpandable().Where(predicate)
            .Select(d => new AppointmentListManagerItem
            {
                User = d.User != null ? d.User.FirstName + " " + d.User.LastName : "بدون کاربر",                
               Date = d.DateFa,
               Time = d.TimeFa,
               Id = d.Id,
               Branch = d.Branch.Title,
               Department = d.Department.Title,
               City=d.City.Title,
               Status = d.AppointmentStatusDetails.Title,
               ResponseLastUser = d.CurrentAssignmentUser != null 
                   ? $"{d.CurrentAssignmentUser.FirstName} {d.CurrentAssignmentUser.LastName}" 
                   : "بدون پاسخ"
               
            })
            .AsNoTracking() .ToList();
        
        
        return appotinetms;

    }
}

