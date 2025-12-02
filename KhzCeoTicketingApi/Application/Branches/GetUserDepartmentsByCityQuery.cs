using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record GetUserDepartmentsByCityQuery(int id) : IQuery<List<UserDepartmentItem>>
{
    
}


public sealed class GetUserDepartmentsByCityQueryHandler(IApplicationDbContext context) 
    : IQueryHandler<GetUserDepartmentsByCityQuery, List<UserDepartmentItem>>
{
    public async ValueTask<List<UserDepartmentItem>> Handle(GetUserDepartmentsByCityQuery query, CancellationToken cancellationToken)
    {
        var list=await context.UserDepartments.Where(d => d.Branch.CityId == query.id).Select(d => new 
        {
            Id = d.UserId,
            FullName = d.User.FirstName + " " + d.User.LastName,
            Role = d.User.Roles.FirstOrDefault().Title,
            Department=d.Department.Title,
            
            
        }).AsNoTracking().ToListAsync(cancellationToken);

        var grouped = list
            .GroupBy(x => new { x.Id, x.FullName, x.Role })
            .Select(g => new  UserDepartmentItem
            {
                Id = g.Key.Id,
                FullName = g.Key.FullName,
                Role = g.Key.Role,
                Description = string.Join(", ", g.Select(x => x.Department).Distinct())
            })
            .ToList();
        
        return grouped;

    }
}

