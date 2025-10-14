using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record GetBranchListQuery : IQuery<List<BranchDto>>
{
    
    
}
public sealed class GetBranchListQueryValidation : AbstractValidator<GetBranchListQuery>
{
    public GetBranchListQueryValidation()
    {
       
    }
}

public sealed class GetBranchListQueryHandler(IApplicationDbContext context) 
    : IQueryHandler<GetBranchListQuery, List<BranchDto>>
{
    public async ValueTask<List<BranchDto>> Handle(GetBranchListQuery query, CancellationToken cancellationToken)
    {
        var list =await context.Branches
            .Select(branch => new BranchDto
            {
                Id = branch.Id,
                Title = branch.Title,
                CityId = branch.CityId,
                CityName = branch.City.Title,
                DepartmentIds = branch.BranchDepartments.Select(d=>d.DepartmentId).ToList(),
                Departments = branch.BranchDepartments.Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    Title = d.Department.Title,
                    IsActive = d.Department.IsActive
                }).ToList(),
                IsActive = branch.IsActive
            }).AsNoTracking().ToListAsync();

        return list;

    }
}

