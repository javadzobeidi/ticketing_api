using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record DeleteBranchCommand : ICommand<bool>
{
    public int Id { get; init; }
}
public sealed class DeleteBranchCommandValidation : AbstractValidator<DeleteBranchCommand>
{
    public DeleteBranchCommandValidation()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("شناسه شعبه باید بزرگتر از صفر باشد.");
    }
}

public sealed class DeleteBranchCommandHandler(IApplicationDbContext context) 
    : ICommandHandler<DeleteBranchCommand, bool>
{
    public async ValueTask<bool> Handle(DeleteBranchCommand command, CancellationToken cancellationToken)
    {
        var branch = await context.Branches
            .FirstOrDefaultAsync(b => b.Id == command.Id, cancellationToken);

        if (branch == null)
        {
            throw new KeyNotFoundException($"شعبه با شناسه {command.Id} یافت نشد.");
        }

        context.Branches.Remove(branch);
        await context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
