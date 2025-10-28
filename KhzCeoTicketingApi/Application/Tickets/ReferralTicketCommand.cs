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

public sealed record ReferralTicketCommand : ICommand<bool>
{
    public Guid Code { set; get; }
    public string Description { set; get; }
    public long UserId { set; get; }
}


public sealed class ReferralTicketCommandValidation : AbstractValidator<ReferralTicketCommand>
{
    public ReferralTicketCommandValidation()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("علت ارجاع را وارد کنید ")
            .MaximumLength(500).WithMessage("علت ارجاع بیش از حد مجاز است");
        
     }
}


public sealed class ReferralTicketCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<ReferralTicketCommand, bool>
{
    public async ValueTask<bool> Handle(ReferralTicketCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var userId = user.UserId;

         var referralUser=  await context.Users.Where(d => d.UserId == request.UserId).FirstOrDefaultAsync();
         if (referralUser == null)
             throw new NotFoundException("متاسفانه کاربر ارجاعی یافت نشده است");

            var entity = await context.Tickets.Where(d => d.IdentityCode == request.Code).FirstOrDefaultAsync();

            if (entity == null)
                throw new Exception("اطلاعات ارسالی اشتباه است");
            
            if (entity.CurrentAssignmentUserId.HasValue && userId != entity.CurrentAssignmentUserId)
                throw new Exception("شما امکان پاسخ به این جلسه را ندارید");


            if (entity.TicketStatusId == (int)TicketStatusEnum.Closed)
                throw new Exception("قبلا پایان یافته است");

            DateTime now=DateTime.Now;
            

            entity.TicketAssignments.Add(new TicketAssignment
            {
                FromUserId =userId, 
                ToUserId = request.UserId,
                AssignedAt = now,
                AssignDateFa = now.ToPersianDate(),
                Note = request.Description,
                StatusId =(int) TicketStatusEnum.Referred
 
            });
            entity.CurrentAssignmentUserId = request.UserId;
            entity.TicketStatusId = (int)TicketStatusEnum.Referred;
    
    entity.TicketMessages.Add(new TicketMessage
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