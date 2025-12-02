using Application.Common.Exceptions;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Departments;

public sealed record DeleteMessageTemplateCommand(int id) : ICommand<bool>
{
  
}

public sealed class DeleteMessageTemplateCommandHandler(IApplicationDbContext context) : ICommandHandler<DeleteMessageTemplateCommand, bool>
{

    

    public async ValueTask<bool> Handle(DeleteMessageTemplateCommand command, CancellationToken cancellationToken)
    {

      
          var  item=  await context.MessageTemplates.Where(d => d.Id == command.id).FirstOrDefaultAsync();

        if (item == null)
        {
            throw new NotFoundException("امکان حذف نمی باشد");
        }

        context.MessageTemplates.Remove(item);
       await context.SaveChangesAsync(cancellationToken);
       return true;
    }
}