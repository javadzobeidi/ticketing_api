using Application.Common.Exceptions;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;

namespace KhzCeoTicketingApi.Application.Departments;

public sealed record DeleteDepartmentCommand : ICommand<bool>
{
    public Guid Id { get; init; }
}
public sealed class DeleteDepartmentCommandValidation : AbstractValidator<DeleteDepartmentCommand>
{
    public DeleteDepartmentCommandValidation()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("شناسه دپارتمان نمی‌تواند خالی باشد.");
    }
}
public sealed class DeleteDepartmentCommandHandler(IApplicationDbContext context) : ICommandHandler<DeleteDepartmentCommand, bool>
{

    public async ValueTask<bool> Handle(DeleteDepartmentCommand command, CancellationToken cancellationToken)
    {
        var department = await context.Departments
            .FindAsync(new object[] { command.Id }, cancellationToken);

        if (department == null)
            throw new NotFoundException($"واحد یافت نشد");

        context.Departments.Remove(department);
        await context.SaveChangesAsync(cancellationToken);

        return true;
    }
}