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
using KhzCeoTicketingApi.Infrastructure.Data.Interfaces;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record SendTicketMessageCommand : ICommand<bool>
{
    public Guid Code { set; get; }
    public string Message { set; get; }
    public List<IFormFile>? Attachments { set; get; } = new List<IFormFile>();
}


public sealed class SendTicketMessageCommandValidation : AbstractValidator<SendTicketMessageCommand>
{
    public SendTicketMessageCommandValidation()
    { 
        RuleFor(x => x.Message)
        .NotEmpty().WithMessage("متن پیام را وارد کنید ")
        .MaximumLength(5000).WithMessage("متن پیام بیش از حد مجاز است");
        
        RuleForEach(x => x.Attachments)
            .SetValidator(new FileValidator()); 
     }
}


public sealed class SendTicketMessageCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator,
    ISmsService smsService
    ) 
    : ICommandHandler<SendTicketMessageCommand, bool>
{
    public async ValueTask<bool> Handle(SendTicketMessageCommand request, CancellationToken cancellationToken)
    {
        var userId= user.UserId;

        
      var ticket= await context.Tickets.Where(d => d.IdentityCode == request.Code).FirstOrDefaultAsync();
      if (ticket == null)
          throw new NotFoundException("اطلاعات تیکت یافت نشد");

     
      

      if (ticket.CurrentAssignmentUserId.HasValue && ticket.CurrentAssignmentUserId != user.UserId)
          throw new Exception("امکان ارسال پیام نمی باشد");

      if (ticket.CurrentAssignmentUserId.GetValueOrDefault() <= 0)
          ticket.CurrentAssignmentUserId = userId;

      ticket.LastResponderId = user.UserId;
      ticket.TicketStatusId = (int)TicketStatusEnum.AnsweredByStaff;
        DateTime now=DateTime.Now;
        
           TicketMessage message=new TicketMessage();
           ticket.TicketMessages.Add(message);
           message.SentAt = now;
           message.DateFa = now.ToPersianDate();
           message.TimeFa = now.ToTime();
           message.IsFromStaff = true;
           message.Message=request.Message;
           message.SenderId = userId;
           message.MessageTypeId = 1;


           
           foreach (var attachment in request.Attachments)
           {
               string fileName = $"{Guid.NewGuid()}_{Path.GetFileName(attachment.FileName)}";
               string filePath = Path.Combine("Uploads", "Tickets", ticket.IdentityCode.ToString());
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
       
           await context.SaveChangesAsync(cancellationToken);


          var phoneNumber=await context.Users.Where(d => d.UserId == ticket.UserId).Select(d=>d.Mobile).FirstOrDefaultAsync(cancellationToken);

          await smsService.SendSMSAsync( phoneNumber,"کاربر گرامی، به تیکت شما پاسخ داده شد لغو=11", ticket.UserId.ToString());
           
           return true;
      
        
              
    }
}