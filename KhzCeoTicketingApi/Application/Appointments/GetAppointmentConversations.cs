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


public sealed record GetAppointmentConversations(Guid Code) : IQuery<AppointmentConversationItem>
{
    
    
}

public record AppointmentConversationItem
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

    public List<AppointmentConversationMessageItem> Messages { set; get; }
}

public record AppointmentConversationMessageItem
{
   
    
    public string Message { set; get; }
    public string User { set; get; }
    public string Date { set; get; }
    public string Time { set; get; }
    
}

public sealed class GetAppointmentConversationsValidation : AbstractValidator<GetAppointmentConversations>
{
    public GetAppointmentConversationsValidation()
    {
    }
}

public sealed class GetAppointmentConversationsHandler(
    IApplicationDbContext context,IMediator mediator,
    IUser user) 
    : IQueryHandler<GetAppointmentConversations, AppointmentConversationItem>
{
    
    
    public async ValueTask<AppointmentConversationItem> Handle(GetAppointmentConversations request, CancellationToken cancellationToken)
    {
        
        var currentUser=await mediator.Send(new GetUserByIdQuery(user.UserId));

        var departments=currentUser.UserDepartments.Select(d => new
        {
            d.CityId,
            d.BranchId,
            d.DepartmentId
        }).ToList();

        var query =  context.Appoinments
            .Where(d => d.IdentityCode == request.Code).AsQueryable();

     var item=await   query.Select(d => new AppointmentConversationItem
        {
            Id=d.Id,
          Description  = d.Description,
          Status=d.AppointmentStatusDetails.Title,
          Date = d.DateFa,
          StatusId = d.AppointmentStatusId,
          Time = d.TimeFa,
          User= d.User.FirstName+" "+d.User.LastName,
          CurrentAssignUserId=d.CurrentAssignmentUserId,
       Messages=     d.AppointmentMessages.Select(ap => new AppointmentConversationMessageItem
            {
                User = ap.Sender.FirstName + " " + ap.Sender.LastName,
                Message = ap.Message,
                Date =ap.DateFa,
                Time = ap.TimeFa
            }).ToList()
        }).FirstOrDefaultAsync(cancellationToken);
        
        
     if (item == null)
         throw new Exception("اطلاعات ارسالی اشتباه است");


     return item;

    }
}

