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
    public List<IFormFile> Attachments { set; get; }

}


public sealed class CreateTicketCommandValidation : AbstractValidator<CreateTicketCommand>
{
    public CreateTicketCommandValidation()
    { 
        RuleFor(x => x.Message)
        .NotEmpty().WithMessage("متن پیام را وارد کنید ")
        .MaximumLength(500).WithMessage("متن پیام بیش از حد مجاز است");
        
        /*RuleFor(x => x.Attachment)
            .SetValidator(new FileValidator()); */
        
     }
}


public sealed class CreateTicketCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<CreateTicketCommand, bool>
{
    public async ValueTask<bool> Handle(CreateTicketCommand request, CancellationToken cancellationToken)
    {

        var userId = user.UserId;
        var branch = await context.BranchDepartments.Include(d => d.Branch)
            .Where(d => d.Id == request.BranchDepartmentId).FirstOrDefaultAsync();

        if (branch == null)
            throw new NotFoundException("اطلاعات شعبه یافت نشد");
        DateTime now = DateTime.Now;
        var entity = new Ticket();
        entity.CityId = branch.Branch.CityId;
        entity.BranchId = branch.BranchId;
        entity.DepartmentId = branch.DepartmentId;
        entity.Description = request.Message;
        entity.UserId = userId;
        entity.TicketDate = now;
        entity.DateFa = now.ToPersianDate();
        entity.TimeFa = now.ToTime();
        entity.IdentityCode = Guid.NewGuid();
        entity.TicketStatusId = (int)TicketStatusEnum.Open;
        //////////////
        TicketMessage message = new TicketMessage();
        entity.TicketMessages.Add(message);
        message.DateFa = entity.DateFa;
        message.TimeFa = entity.TimeFa;
        message.IsFromStaff = false;
        message.Message = entity.Description;
        message.SenderId = userId;
        message.MessageTypeId = 1;
        foreach (var attachment in request.Attachments)
        {
            string fileName = $"{Guid.NewGuid()}_{Path.GetFileName(attachment.FileName)}";
            string filePath = Path.Combine("Uploads", "Tickets", entity.IdentityCode.ToString());
            Directory.CreateDirectory(filePath);
            string fullPath = Path.Combine(filePath, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await attachment.CopyToAsync(stream);
            }
            message.TicketAttachments.Add(new TicketAttachment
            {
                Attachment = new Attachment
                {
                    FileName = attachment.FileName,
                    FilePath = fullPath,
                    FileSize = attachment.Length,
                    ContentType = attachment.ContentType,
                    UploadDate = now
                }
            });
            
            
        }
     


        context.Tickets.Add(entity);

            await context.SaveChangesAsync(cancellationToken);
            return true;

        }

}