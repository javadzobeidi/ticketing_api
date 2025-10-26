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

public sealed record ReserveAppointmentCommand : ICommand<bool>
{
    public long AppointmentId { set; get; }

    public string Description { set; get; }

}


public sealed class ReserveAppointmentCommandValidation : AbstractValidator<ReserveAppointmentCommand>
{
    public ReserveAppointmentCommandValidation()
    { 
        RuleFor(x => x.Description)
        .NotEmpty().WithMessage("علت حضور را وارد کنید ")
        .MaximumLength(500).WithMessage("علت حضور بیش از حد مجاز است");
        
     }
}


public sealed class ReserveAppointmentCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<ReserveAppointmentCommand, bool>
{
    public async ValueTask<bool> Handle(ReserveAppointmentCommand request, CancellationToken cancellationToken)
    {
        try
        {
           var userId= user.UserId;
            

     
    var entity=   await context.Appoinments.Where(d => d.Id == request.AppointmentId).FirstOrDefaultAsync();

    if (entity == null)
        throw new NotFoundException("اطلاعات ارسالی اشتباه است");

    if (entity.AppointmentStatus != AppointmentStatusEnum.NoReserver)
        throw new Exception("متاسفانه این ساعت توسط مهندس دیگری رزرو شده است");

    entity.AppointmentStatus = AppointmentStatusEnum.Reserver;
    entity.UserId = userId;
    entity.Description = request.Description;
              await context.SaveChangesAsync(cancellationToken);
              return true;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            throw new Exception("متاسفانه این ساعت توسط مهندس دیگری رزرو شده است");
        }
        
              
    }
}