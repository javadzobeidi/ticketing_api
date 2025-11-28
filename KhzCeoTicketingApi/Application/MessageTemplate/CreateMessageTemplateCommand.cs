using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;

namespace KhzCeoTicketingApi.Application.Departments;

public sealed record CreateMessageTemplateCommand : ICommand<DepartmentDto>
{
    public string Title { get; init; } = string.Empty;

    public string Description { set; get; }

    public bool IsActive { get; init; } = true;
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
public sealed class CreateMessageTemplateCommandHandler(IApplicationDbContext context) : ICommandHandler<CreateMessageTemplateCommand, DepartmentDto>
{

    

    public async ValueTask<DepartmentDto> Handle(CreateMessageTemplateCommand command, CancellationToken cancellationToken)
    {
        var department = new Department
        {
            Title = command.Title,
            IsActive = command.IsActive
        };
        context.Departments.Add(department);
        await context.SaveChangesAsync(cancellationToken);
        return new DepartmentDto
        {
            Id = department.Id,
            Title = department.Title,
            IsActive = department.IsActive
        };
    }
}