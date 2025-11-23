/*
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record GetBranchesGroupByCityQuery : IQuery<List<ItemValue>>
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
public sealed class GetBranchesGroupByCityQueryHandler(IApplicationDbContext context) 
    : IQueryHandler<GetBranchesGroupByCityQuery, List<ItemValue>>
{
    public async ValueTask<List<ItemValue>> Handle(GetBranchesGroupByCityQuery query, CancellationToken cancellationToken)
    {

        var list = await context.BranchDepartments
            .Where(b => b.Branch.CityId == query.CityId)
            .Select(d => new BranchDepartmentItem
            {
                Id=d.Id,
                Branch=d.Branch.Title,
                Department=d.Department.Title,
                DepartmentId=d.DepartmentId,
                Title =  " واحد " + d.Department.Title + " - " + d.Branch.Title 
                
            }).AsNoTracking().ToListAsync(cancellationToken);

        list.GroupBy(d => new { d.DepartmentId, d.Department })
            .Select(f => new
            {
                f.Key.DepartmentId,
                f.Key.Department,

                f.Select(r => new
                    {
                        r.Id,
                        r.Branch
                    })
                    .ToList()
            })
            .ToList();
        
        

        return list;

    }
}
*/

