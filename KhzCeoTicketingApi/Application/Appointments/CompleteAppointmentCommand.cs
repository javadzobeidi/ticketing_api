using Application.Common.Exceptions;
using Application.Common.Interfaces;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using Microsoft.EntityFrameworkCore;
using KhzCeoTicketingApi.Application.Extensions;
using KhzCeoTicketingApi.Application.Users;
using KhzCeoTicketingApi.Domains.Enums;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record CompleteAppointmentCommand : ICommand<bool>
{
    public long AppointmentId { set; get; }

    public string Description { set; get; }

}


public sealed class CompleteAppointmentCommandValidation : AbstractValidator<CreateBranchCommand>
{
    public CompleteAppointmentCommandValidation()
    {
     }
}


public sealed class CompleteAppointmentCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<CompleteAppointmentCommand, bool>
{
    public async ValueTask<bool> Handle(CompleteAppointmentCommand request, CancellationToken cancellationToken)
    {
        try
        {
           var userId= user.UserId;
     
    var entity=   await context.Appoinments.Where(d => d.Id == request.AppointmentId).FirstOrDefaultAsync();

    if (entity == null)
        throw new Exception("اطلاعات ارسالی اشتباه است");
    if (entity.CurrentAssignmentUserId.HasValue && userId != entity.CurrentAssignmentUserId)
        throw new Exception("شما امکان پاسخ به این جلسه را ندارید");
    

    if (entity.AppointmentStatusId==(int)AppointmentStatusEnum.Completed)
        throw new Exception("قبلا پایان یافته است");

    if (entity.CurrentAssignmentUserId == null)
        entity.CurrentAssignmentUserId = userId;

    DateTime now=DateTime.Now;
    
    entity.AppointmentMessages.Add(new AppointmentMessage
    {
        IsFromStaff = true,
        Message = request.Description,
        SenderId = user.UserId,
        SentAt = now,
        TimeFa = now.ToTime(),
        DateFa = now.ToPersianDate(),
    });
  
              await context.SaveChangesAsync(cancellationToken);
              return true;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            throw new Exception("متاسفانه این ساعت توسط مهندس دیگری رزرو شده است");
        }
        
              
    }
}