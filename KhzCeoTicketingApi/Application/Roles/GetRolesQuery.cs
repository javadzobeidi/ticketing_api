using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Departments;

public sealed record GetRolesQuery : IQuery<List<RoleDto>>
{    
}
public sealed class GetRolesQueryHandler(IApplicationDbContext context) : IQueryHandler<GetRolesQuery, List<RoleDto>>
{

    public async ValueTask<List<RoleDto>> Handle(GetRolesQuery command, CancellationToken cancellationToken)
    {
        var query = context.Roles.AsQueryable();

        var result = await query
            .Select(d => new RoleDto()
            {
                Id = d.Id,
                Title = d.Title,
            }).AsNoTracking().ToListAsync(cancellationToken);

        return result;
    }
}
