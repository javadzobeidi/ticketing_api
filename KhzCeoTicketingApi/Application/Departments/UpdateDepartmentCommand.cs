using Application.Common.Exceptions;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;

namespace KhzCeoTicketingApi.Application.Departments;

public sealed record UpdateDepartmentCommand : ICommand<DepartmentDto>
{
    public int Id { set; get; }
    public string Title { get; init; } = string.Empty;
    public bool IsActive { get; init; } = true;
}
public sealed class UpdateDepartmentCommandValidation : AbstractValidator<UpdateDepartmentCommand>
{
    public UpdateDepartmentCommandValidation()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("عنوان دپارتمان نمی‌تواند خالی باشد.")
            .MaximumLength(100).WithMessage("عنوان دپارتمان نباید بیشتر از ۱۰۰ کاراکتر باشد.")
            .MinimumLength(2).WithMessage("عنوان دپارتمان باید حداقل ۲ کاراکتر باشد.");
    }
}
public sealed class UpdateDepartmentCommandHandler(IApplicationDbContext context) : ICommandHandler<UpdateDepartmentCommand, DepartmentDto>
{
    public async ValueTask<DepartmentDto> Handle(UpdateDepartmentCommand command, CancellationToken cancellationToken)
    {
        
        var department = await context.Departments
            .FindAsync(new object[] { command.Id }, cancellationToken);

        if (department == null)
            throw new NotFoundException($"واحد با این کد   {command.Id} یافت نشد");

        department.Title = command.Title;
        department.IsActive = command.IsActive;

        await context.SaveChangesAsync(cancellationToken);

        return new DepartmentDto
        {
            Id = department.Id,
            Title = department.Title,
            IsActive = department.IsActive
        };
        
    }
}