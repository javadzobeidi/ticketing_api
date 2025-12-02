using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record GetUserDepartmentsIdQuery(int id) : IQuery<List<UserDepartmentItem>>
{
    
}

public record UserDepartmentItem
{
    public string FullName { set; get; }

    public string Role { set; get; }
    public string Description { set; get; }
    public long Id { set; get; }
}

public sealed class GetUserDepartmentsIdQueryHandler(IApplicationDbContext context) 
    : IQueryHandler<GetUserDepartmentsIdQuery, List<UserDepartmentItem>>
{
    public async ValueTask<List<UserDepartmentItem>> Handle(GetUserDepartmentsIdQuery query, CancellationToken cancellationToken)
    {
    var branch=   await context.BranchDepartments.Where(d => d.Id == query.id).FirstOrDefaultAsync();

   var list=await context.UserDepartments.Where(d => d.BranchId == branch.BranchId && d.DepartmentId == branch.DepartmentId)
        .Select(d => new UserDepartmentItem
        {
            Id=d.UserId,
            FullName = d.User.FirstName + " " + d.User.LastName,
            Role = d.User.Roles.FirstOrDefault().Title
        })
        .AsNoTracking()
        .ToListAsync(cancellationToken);
    

        return list;

    }
}

