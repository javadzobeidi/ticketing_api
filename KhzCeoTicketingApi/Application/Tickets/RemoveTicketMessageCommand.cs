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

public sealed record RemoveTicketMessageCommand(long Id) : ICommand<bool>
{
    

}




public sealed class RemoveTicketMessageCommandHandler(
    IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<RemoveTicketMessageCommand, bool>
{
    public async ValueTask<bool> Handle(RemoveTicketMessageCommand request, CancellationToken cancellationToken)
    {
        var userId= user.UserId;
        
      var ticket= await context.TicketMessages.Where(d => d.Id == request.Id).FirstOrDefaultAsync();
      if (ticket == null)
          throw new NotFoundException("اطلاعات تیکت یافت نشد");
      
      DateTime dt=DateTime.Now;
      
      double remainingSeconds = 60 - (dt - ticket.SentAt).TotalSeconds;

      if (remainingSeconds < 0)
          remainingSeconds = 0;

      if (remainingSeconds <= 0)
          throw new Exception("زمان حذف پایان یافت");
      
      context.TicketMessages.Remove(ticket);
           await context.SaveChangesAsync(cancellationToken);
           return true;
      
        
              
    }
}