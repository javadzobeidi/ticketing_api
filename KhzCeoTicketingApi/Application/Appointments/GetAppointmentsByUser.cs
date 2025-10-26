using Application.Common.Exceptions;
using Application.Common.Interfaces;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Application.Extensions;
using KhzCeoTicketingApi.Domains.Enums;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;


public sealed record GetAppointmentsByUser(string startDate,string endDate) : IQuery<List<AppointmentListUserItem>>
{
    
    
}

public record AppointmentListUserItem
{
    public long Id { set; get; }

    public string Date { set; get; }
    public Guid Code { set; get; }
    public string Time { set; get; }

    public string Status { set; get; }

    public string ResponseLastUser { set; get; }
    public string Branch { set; get; }

    public string Department { set; get; }
    

}


public sealed class GetAppointmentsByUserValidation : AbstractValidator<GetAppointmentsByUser>
{
    public GetAppointmentsByUserValidation()
    {
       
    }
}

public sealed class GetAppointmentsByUserHandler(
    IApplicationDbContext context,
    IUser user) 
    : IQueryHandler<GetAppointmentsByUser, List<AppointmentListUserItem>>
{
    
    public async ValueTask<List<AppointmentListUserItem>> Handle(GetAppointmentsByUser request, CancellationToken cancellationToken)
    {

        DateTime startDate = request.startDate.ToDateTime();
        DateTime endDate = request.endDate.ToDateTime();

       var userId= user.UserId;
       var query = context.Appoinments.Where(d => d.UserId == userId &&
                                                  d.AppointmentDate.Date>=startDate.Date && d.AppointmentDate.Date<=endDate.Date);
       
        
        var appotinetms=query
            .Select(d => new AppointmentListUserItem
            {
               Date = d.DateFa,
               Time = d.TimeFa,
               Id = d.Id,
               Branch = d.Branch.Title,
               Department = d.Department.Title,
               Code=d.IdentityCode,
               Status = d.AppointmentStatusDetails.Title,
               ResponseLastUser = d.CurrentAssignmentUser != null 
                   ? $"{d.CurrentAssignmentUser.FirstName} {d.CurrentAssignmentUser.LastName}" 
                   : null
               
            })
            .AsNoTracking() .ToList();
        
        
        return appotinetms;

    }
}

