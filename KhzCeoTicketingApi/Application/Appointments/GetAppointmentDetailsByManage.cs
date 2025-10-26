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


public sealed record GetAppointmentDetailsByManage(Guid Code) : IQuery<AppointmentDetailsItem>
{
    
    
}

public record AppointmentDetailsItem
{
    public long Id { set; get; }
    public string Status { set; get; }

    public bool CanProcess { set; get; }

    public int StatusId { set; get; }
    public string Description { set; get; }
    public string Date { set; get; }
    public string Time { set; get; }
    public string User { set; get; }

    public long? CurrentAssignUserId { set; get; }

    public List<AppointmentDetailsMessageItem> Messages { set; get; }
}

public record AppointmentDetailsMessageItem
{
   
    
    public string Message { set; get; }
    public string User { set; get; }
    public string Date { set; get; }
    public string Time { set; get; }
    
}

public sealed class GetAppointmentDetailsByManageValidation : AbstractValidator<GetAppointmentDetailsByManage>
{
    public GetAppointmentDetailsByManageValidation()
    {
    }
}

public sealed class GetAppointmentDetailsByManageHandler(
    IApplicationDbContext context,IMediator mediator,
    IUser user) 
    : IQueryHandler<GetAppointmentDetailsByManage, AppointmentDetailsItem>
{
    
    
    public async ValueTask<AppointmentDetailsItem> Handle(GetAppointmentDetailsByManage request, CancellationToken cancellationToken)
    {
        
        var currentUser=await mediator.Send(new GetUserByIdQuery(user.UserId));

        var departments=currentUser.UserDepartments.Select(d => new
        {
            d.CityId,
            d.BranchId,
            d.DepartmentId
        }).ToList();

        var query =  context.Appoinments
            .Where(d => d.IdentityCode == request.Code && d.AppointmentStatusId!=(int)AppointmentStatusEnum.NoReserver).AsQueryable();

     var item=await   query.Select(d => new AppointmentDetailsItem
        {
            Id=d.Id,
            
          Description  = d.Description,
          Status=d.AppointmentStatusDetails.Title,
          Date = d.DateFa,
          StatusId = d.AppointmentStatusId,
          Time = d.TimeFa,
          User= d.User.FirstName+" "+d.User.LastName,
          CurrentAssignUserId=d.CurrentAssignmentUserId,
       Messages=     d.AppointmentMessages.Select(ap => new AppointmentDetailsMessageItem
            {
                User = ap.Sender.FirstName + " " + ap.Sender.LastName,
                Message = ap.Message,
                Date =ap.DateFa,
                Time = ap.TimeFa
            }).ToList()
        }).FirstOrDefaultAsync(cancellationToken);
        
        
     if (item == null)
         throw new Exception("اطلاعات ارسالی اشتباه است");


     if (item.StatusId != (int)AppointmentStatusEnum.Completed)
     {
         if (item.StatusId == (int)AppointmentStatusEnum.Reserver
             || (item.StatusId == (int)AppointmentStatusEnum.Referral && item.CurrentAssignUserId == user.UserId)
             )
             item.CanProcess = true;
     }


     return item;

    }
}

