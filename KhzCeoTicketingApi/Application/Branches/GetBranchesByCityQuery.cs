using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record GetBranchesByCityQuery : IQuery<List<BranchDepartmentItem>>
{
    public int CityId { set; get; }
}

public class BranchDepartmentItem
{
    public int Id { set; get; }
    public string Department { set; get; }
    public string Branch { set; get; }

    public string Title { set; get; }

    public int DepartmentId { set; get; }
}
public sealed class GetBranchesByCityQueryHandler(IApplicationDbContext context) 
    : IQueryHandler<GetBranchesByCityQuery, List<BranchDepartmentItem>>
{
    public async ValueTask<List<BranchDepartmentItem>> Handle(GetBranchesByCityQuery query, CancellationToken cancellationToken)
    {

        var list = await context.BranchDepartments
            .Where(b => b.Branch.CityId == query.CityId)
            .Select(d => new BranchDepartmentItem
            {
                Id=d.Id,
                Department = d.Department.Title,
                Branch = d.Branch.Title,
                DepartmentId = d.DepartmentId,
                Title =  " واحد " + d.Department.Title + " - " + d.Branch.Title 
                
            }).AsNoTracking().ToListAsync();
        
       

        return list;

    }
}

