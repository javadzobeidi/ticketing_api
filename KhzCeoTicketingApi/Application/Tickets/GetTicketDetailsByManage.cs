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


public sealed record GetTicketDetailsByManage(Guid Code) : IQuery<TicketDetailsItem>
{
    
    
}

public record TicketDetailsItem
{
    public Guid Code { set; get; }

    public long Id { set; get; }
    public string Status { set; get; }

    public bool CanProcess { set; get; }

    public int StatusId { set; get; }
    public string Description { set; get; }
    public string Date { set; get; }
    public string Time { set; get; }
    public string User { set; get; }

    public long? CurrentAssignUserId { set; get; }


    public List<TicketDetailsMessageItem> Messages { set; get; }
}

public record TicketDetailsMessageItem
{
   
    
    public string Message { set; get; }
    public string User { set; get; }
    public string Date { set; get; }
    public string Time { set; get; }

    public bool IsFromStuff { set; get; }
    

    public AttachmentItem? Attachment { set; get; }
}

public record AttachmentItem
{
    public string FileName { set; get; }

    public string Url { set; get; }
}

public sealed class GetTicketDetailsByManageValidation : AbstractValidator<GetTicketDetailsByManage>
{
    public GetTicketDetailsByManageValidation()
    {
    }
}

public sealed class GetTicketDetailsByManageHandler(
    IApplicationDbContext context,IMediator mediator,
    IUser user) 
    : IQueryHandler<GetTicketDetailsByManage, TicketDetailsItem>
{
    
    
    public async ValueTask<TicketDetailsItem> Handle(GetTicketDetailsByManage request, CancellationToken cancellationToken)
    {

       var departments=await context.UserDepartments.Where(d => d.UserId == user.UserId).Select(d => new
        {
            d.BranchId,
            d.Branch.CityId,
            d.DepartmentId
        }).AsNoTracking().ToListAsync();

        var query =  context.Tickets
            .Where(d => d.IdentityCode == request.Code ).AsQueryable();

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
         if ( item.CurrentAssignUserId == user.UserId || item.CurrentAssignUserId==null)
             item.CanProcess = true;
     }


     return item;

    }
}

