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

public sealed record CancelAppointmentCommand(Guid code) : ICommand<bool>
{
}


public sealed class CancelAppointmentCommandValidation : AbstractValidator<CancelAppointmentCommand>
{
    public CancelAppointmentCommandValidation()
    {
     
        
     }
}


public sealed class CancelAppointmentCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<CancelAppointmentCommand, bool>
{
    public async ValueTask<bool> Handle(CancelAppointmentCommand request, CancellationToken cancellationToken)
    {
       
            var userId = user.UserId;
            var entity = await context.Appoinments.Where(d =>d.UserId==userId && d.IdentityCode == request.code).FirstOrDefaultAsync();
            if (entity == null)
                throw new Exception("اطلاعات ارسالی اشتباه است");

            if (entity.AppointmentStatusId != (int)AppointmentStatusEnum.Reserver)
                throw new Exception("در دستور کار قرار گرفته است امکان انصراف نمی باشد");

            DateTime now=DateTime.Now;

            entity.AppointmentStatusId = (int)AppointmentStatusEnum.Cancelled;
   
              await context.SaveChangesAsync(cancellationToken);
              return true;
       
        
              
    }
}