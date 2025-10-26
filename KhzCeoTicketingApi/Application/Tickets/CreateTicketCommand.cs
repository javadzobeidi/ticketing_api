using Application.Common.Exceptions;
using Application.Common.Interfaces;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using Microsoft.EntityFrameworkCore;
using KhzCeoTicketingApi.Application.Extensions;
using KhzCeoTicketingApi.Application.Users;
using KhzCeoTicketingApi.Application.Validator;
using KhzCeoTicketingApi.Domains.Enums;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record CreateTicketCommand : ICommand<bool>
{
    public long BranchDepartmentId { set; get; }

    public string Message { set; get; }

    public IFormFile Attachment { set; get; }

}


public sealed class CreateTicketCommandValidation : AbstractValidator<CreateTicketCommand>
{
    public CreateTicketCommandValidation()
    { 
        RuleFor(x => x.Message)
        .NotEmpty().WithMessage("متن پیام را وارد کنید ")
        .MaximumLength(500).WithMessage("متن پیام بیش از حد مجاز است");
        
        RuleFor(x => x.Attachment)
            .SetValidator(new FileValidator()); 
        
     }
}


public sealed class CreateTicketCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<CreateTicketCommand, bool>
{
    public async ValueTask<bool> Handle(CreateTicketCommand request, CancellationToken cancellationToken)
    {
        try
        {
           var userId= user.UserId;
        var branch=  await context.BranchDepartments.Include(d=>d.Branch).Where(d => d.Id == request.BranchDepartmentId).FirstOrDefaultAsync();

        if (branch == null)
            throw new NotFoundException("اطلاعات شعبه یافت نشد");
        
        DateTime now=DateTime.Now;
           var entity = new Ticket();
           entity.CityId = branch.Branch.CityId;
           entity.BranchId=branch.Id;
           entity.DepartmentId = branch.DepartmentId;
           entity.Description = request.Message;
           entity.UserId = userId;
           entity.TicketDate = now;
           entity.DateFa = now.ToPersianDate();
           entity.TimeFa = now.ToTime();
           entity.IdentityCode = Guid.NewGuid();
           entity.TicketStatusId =(int) TicketStatus.Open;
           ////////////////////////
           

              await context.SaveChangesAsync(cancellationToken);
              return true;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            throw new Exception("متاسفانه این ساعت توسط مهندس دیگری رزرو شده است");
        }
        
              
    }
}