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

public sealed record CloseTicketCommand : ICommand<bool>
{
    public Guid Code { set; get; }
    public string CloseType { set; get; }

}




public sealed class CloseTicketCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<CloseTicketCommand, bool>
{
    public async ValueTask<bool> Handle(CloseTicketCommand request, CancellationToken cancellationToken)
    {
        var userId= user.UserId;
        
      var ticket= await context.Tickets.Where(d => d.IdentityCode == request.Code).FirstOrDefaultAsync();
      if (ticket == null)
          throw new NotFoundException("اطلاعات تیکت یافت نشد");

      if (request.CloseType == "user" && ticket.UserId==userId)
      {
          ticket.TicketStatusId = (int)TicketStatusEnum.Closed;
      }
      else if (request.CloseType == "admin" && ticket.CurrentAssignmentUserId == userId)
      {
          ticket.TicketStatusId = (int)TicketStatusEnum.Closed;
      }
      else
          throw new Exception("امکان بستن تیکت وجود ندارد");
      
      
      
           await context.SaveChangesAsync(cancellationToken);
           return true;
      
        
              
    }
}