using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Departments;

public sealed record CreateMessageTemplateCommand : ICommand<bool>
{
    public int? Id { set; get; }
    
    public string Title { get; init; } = string.Empty;
    public string Description { set; get; }
}
public sealed class CreateMessageTemplateCommandValidation : AbstractValidator<CreateMessageTemplateCommand>
{
    public CreateMessageTemplateCommandValidation()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("عنوان  نمی‌تواند خالی باشد.")
            .MaximumLength(100).WithMessage("عنوان  نباید بیشتر از ۱۰۰ کاراکتر باشد.")
            .MinimumLength(2).WithMessage("عنوان  باید حداقل ۲ کاراکتر باشد.");
        
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("متن الگو  نمی‌تواند خالی باشد.")
            .MaximumLength(300).WithMessage("متن الگو  نباید بیشتر از 300 کاراکتر باشد.")
            .MinimumLength(2).WithMessage("عنوان  باید حداقل ۲ کاراکتر باشد.");
        
    }
    
    
}
public sealed class CreateMessageTemplateCommandHandler(IApplicationDbContext context) : ICommandHandler<CreateMessageTemplateCommand, bool>
{

    

    public async ValueTask<bool> Handle(CreateMessageTemplateCommand command, CancellationToken cancellationToken)
    {

        MessageTemplate item = null;
        if (command.Id.HasValue)
        {
            item=  await context.MessageTemplates.Where(d => d.Id == command.Id).FirstOrDefaultAsync();
            
        }
        

        if (item == null)
        {
            item=new  MessageTemplate();
            context.MessageTemplates.Add(item);
        }
        item.Title = command.Title;
        item.Description = command.Description;
        
        
       await context.SaveChangesAsync(cancellationToken);
       return true;
    }
}