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

public sealed record SendTicketUserMessageCommand : ICommand<bool>
{
    public Guid Code { set; get; }
    public string Message { set; get; }
    public IFormFile? Attachment { set; get; }

}


public sealed class SendTicketUserMessageCommandValidation : AbstractValidator<SendTicketUserMessageCommand>
{
    public SendTicketUserMessageCommandValidation()
    { 
        RuleFor(x => x.Message)
        .NotEmpty().WithMessage("متن پیام را وارد کنید ")
        .MaximumLength(500).WithMessage("متن پیام بیش از حد مجاز است");
        
        RuleFor(x => x.Attachment)
            .SetValidator(new FileValidator()); 
        
     }
}


public sealed class SendTicketUserMessageCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<SendTicketUserMessageCommand, bool>
{
    public async ValueTask<bool> Handle(SendTicketUserMessageCommand request, CancellationToken cancellationToken)
    {
        var userId= user.UserId;

        
      var ticket= await context.Tickets.Where(d =>d.UserId==user.UserId && d.IdentityCode == request.Code).FirstOrDefaultAsync();
      if (ticket == null)
          throw new NotFoundException("اطلاعات تیکت یافت نشد");

      ticket.LastResponderId = user.UserId;
      ticket.TicketStatusId = (int)TicketStatusEnum.AnsweredByUser;
        DateTime now=DateTime.Now;
        
           TicketMessage message=new TicketMessage();
           ticket.TicketMessages.Add(message);
           message.SentAt = now;
           message.DateFa = now.ToPersianDate();
           message.TimeFa = now.ToTime();
           message.IsFromStaff = false;
           message.Message=request.Message;
           message.SenderId = userId;
           
           
           
           if (request.Attachment != null)
           {
                   string fileName = $"{Guid.NewGuid()}_{Path.GetFileName(request.Attachment.FileName)}";
                   string filePath = Path.Combine("Uploads", "Tickets", ticket.IdentityCode.ToString());
                   Directory.CreateDirectory(filePath);
                   string fullPath = Path.Combine(filePath, fileName);
                   using (var stream = new FileStream(fullPath, FileMode.Create))
                   {
                       await request.Attachment.CopyToAsync(stream);
                   }

                   message.AttachmentFileName = fullPath;

                   message.Attachment = new Attachment
                   {
                       FileName = request.Attachment.FileName,
                       FilePath = fullPath,
                       FileSize = request.Attachment.Length,
                       ContentType = request.Attachment.ContentType,
                       UploadDate = now
                   };
           }
           await context.SaveChangesAsync(cancellationToken);
           return true;
      
        
              
    }
}