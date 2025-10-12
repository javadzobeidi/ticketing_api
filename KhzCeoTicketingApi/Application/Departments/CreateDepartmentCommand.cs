using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;

namespace KhzCeoTicketingApi.Application.Departments;

public sealed record CreateDepartmentCommand : ICommand<DepartmentDto>
{
    public string Title { get; init; } = string.Empty;
    public bool IsActive { get; init; } = true;
}
public sealed class CreateDepartmentCommandValidation : AbstractValidator<CreateDepartmentCommand>
{
    public CreateDepartmentCommandValidation()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("عنوان دپارتمان نمی‌تواند خالی باشد.")
            .MaximumLength(100).WithMessage("عنوان دپارتمان نباید بیشتر از ۱۰۰ کاراکتر باشد.")
            .MinimumLength(2).WithMessage("عنوان دپارتمان باید حداقل ۲ کاراکتر باشد.");
    }
}
public sealed class CreateDepartmentCommandHandler(IApplicationDbContext context) : ICommandHandler<CreateDepartmentCommand, DepartmentDto>
{

    

    public async ValueTask<DepartmentDto> Handle(CreateDepartmentCommand command, CancellationToken cancellationToken)
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