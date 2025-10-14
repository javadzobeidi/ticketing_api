using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record GetBranchByIdQuery : IQuery<BranchDto>
{
    public int Id { get; init; }
}

public sealed class GetBranchByIdQueryValidation : AbstractValidator<GetBranchByIdQuery>
{
    public GetBranchByIdQueryValidation()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("شناسه شعبه باید بزرگتر از صفر باشد.");
    }
}

// Handler
public sealed class GetBranchByIdQueryHandler(IApplicationDbContext context) 
    : IQueryHandler<GetBranchByIdQuery, BranchDto>
{
    public async ValueTask<BranchDto> Handle(GetBranchByIdQuery query, CancellationToken cancellationToken)
    {
        var branch = await context.Branches
            .Include(d=>d.BranchDepartments).ThenInclude(d=>d.Department)
            .FirstOrDefaultAsync(b => b.Id == query.Id, cancellationToken);

        if (branch == null)
        {
            throw new KeyNotFoundException($"شعبه با شناسه {query.Id} یافت نشد.");
        }

        return new BranchDto
        {
            Id = branch.Id,
            Title = branch.Title,
            CityId = branch.CityId,
            DepartmentIds = branch.BranchDepartments.Select(d => d.Id).ToList(),
            Departments=branch.BranchDepartments.Select(d=>new DepartmentDto
            {
                Id = d.Id,
                Title = d.Department.Title,
                IsActive = d.Department.IsActive
            }).ToList(),
            IsActive = branch.IsActive
        };
    }
}
