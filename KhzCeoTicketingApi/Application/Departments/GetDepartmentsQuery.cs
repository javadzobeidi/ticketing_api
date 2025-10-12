using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Departments;

public sealed record GetDepartmentsQuery : IQuery<List<DepartmentDto>>
{    
    public bool? IsActive { get; init; }
}
public sealed class GetDepartmentsQueryHandler(IApplicationDbContext context) : IQueryHandler<GetDepartmentsQuery, List<DepartmentDto>>
{
 

    public async ValueTask<List<DepartmentDto>> Handle(GetDepartmentsQuery query, CancellationToken cancellationToken)
    {
        var departments = context.Departments.AsQueryable();

        if (query.IsActive.HasValue)
            departments = departments.Where(d => d.IsActive == query.IsActive.Value);

        var result = await departments
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                Title = d.Title,
                IsActive = d.IsActive
            }).AsNoTracking().ToListAsync(cancellationToken);

        return result;
    }
}
