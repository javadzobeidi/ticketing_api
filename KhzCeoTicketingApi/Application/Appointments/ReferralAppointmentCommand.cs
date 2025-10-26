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

public sealed record ReferralAppointmentCommand : ICommand<bool>
{
    public long AppointmentId { set; get; }
    public string Description { set; get; }
    public long UserId { set; get; }
}


public sealed class ReferralAppointmentCommandValidation : AbstractValidator<ReferralAppointmentCommand>
{
    public ReferralAppointmentCommandValidation()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("علت حضور را وارد کنید ")
            .MaximumLength(500).WithMessage("علت حضور بیش از حد مجاز است");
        
     }
}


public sealed class ReferralAppointmentCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<ReferralAppointmentCommand, bool>
{
    public async ValueTask<bool> Handle(ReferralAppointmentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var userId = user.UserId;

         var referralUser=  await context.Users.Where(d => d.UserId == request.UserId).FirstOrDefaultAsync();
         if (referralUser == null)
             throw new NotFoundException("متاسفانه کاربر ارجاعی یافت نشده است");

            var entity = await context.Appoinments.Where(d => d.Id == request.AppointmentId).FirstOrDefaultAsync();

            if (entity == null)
                throw new Exception("اطلاعات ارسالی اشتباه است");
            if (entity.CurrentAssignmentUserId.HasValue && userId != entity.CurrentAssignmentUserId)
                throw new Exception("شما امکان پاسخ به این جلسه را ندارید");


            if (entity.AppointmentStatusId == (int)AppointmentStatusEnum.Completed)
                throw new Exception("قبلا پایان یافته است");

            DateTime now=DateTime.Now;
            
            

            entity.AppointmentAssignments.Add(new AppointmentAssignment
            {
                FromUserId =userId, 
                ToUserId = request.UserId,
                AssignedAt = now,
                AssignDateFa = now.ToPersianDate(),
                Note = "",
                StatusId =(int) AppointmentStatusEnum.Referral
                    
            });
            entity.CurrentAssignmentUserId = request.UserId;
            entity.AppointmentStatusId = (int)AppointmentStatusEnum.Referral;
    
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
            throw new Exception("دوباره تلاش کنید خطایی اتفاق افتاده است");
        }
        
              
    }
}