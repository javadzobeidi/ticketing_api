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


public sealed record GetTicketDetailsByUser(Guid Code) : IQuery<TicketDetailsItem>
{
    
    
}




public sealed class GetTicketDetailsByUserValidation : AbstractValidator<GetTicketDetailsByUser>
{
    public GetTicketDetailsByUserValidation()
    {
    }
}

public sealed class GetTicketDetailsByUserHandler(
    IApplicationDbContext context,IMediator mediator,
    IUser user) 
    : IQueryHandler<GetTicketDetailsByUser, TicketDetailsItem>
{
    
    
    public async ValueTask<TicketDetailsItem> Handle(GetTicketDetailsByUser request, CancellationToken cancellationToken)
    {

        var query =  context.Tickets
            .Where(d =>d.UserId==user.UserId && d.IdentityCode == request.Code ).AsQueryable();

     var item=await   query.Select(d => new TicketDetailsItem
        {
            Id=d.Id,
            Code=d.IdentityCode,
          Description  = d.Description,
          Status=d.TicketStatus.Title,
          Date = d.DateFa,
          StatusId = d.TicketStatusId,
          Time = d.TimeFa,
          User= d.User.FirstName+" "+d.User.LastName,
          CurrentAssignUserId=d.CurrentAssignmentUserId,
       Messages=     d.TicketMessages.Select(ap => new TicketDetailsMessageItem
            {
                User = ap.Sender.FirstName + " " + ap.Sender.LastName,
                Message = ap.Message,
                Date =ap.DateFa,
                Time = ap.TimeFa,
                IsFromStuff=ap.IsFromStaff,
                Attachment = ap.AttachmentId.HasValue?new AttachmentItem
                {
                    FileName = ap.Attachment.FileName,
                    Url = ap.AttachmentFileName
                    
                }:null
                    
            }).ToList()
        }).FirstOrDefaultAsync(cancellationToken);
        
        
     if (item == null)
         throw new Exception("اطلاعات ارسالی اشتباه است");


     if (item.StatusId != (int)TicketStatusEnum.Closed)
     {
             item.CanProcess = true;
     }


     return item;

    }
}

