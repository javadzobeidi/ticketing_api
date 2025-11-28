using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Departments;

public sealed record GetFullDepartmentHierarchyQuery : IQuery<List<DepartmentTreeDto>>
{    
    public bool? IsActive { get; init; }
}
public sealed class GetFullDepartmentHierarchyQueryHandler(IApplicationDbContext context) : IQueryHandler<GetFullDepartmentHierarchyQuery, List<DepartmentTreeDto>>
{
 
    public List<DepartmentTreeDto> BuildTree(List<DepartmentTreeDto> items)
    {
        var lookup = items.ToLookup(d => d.ParentId);

        foreach (var d in items)
            d.Children = lookup[d.Id].ToList();

        return lookup[null].ToList(); // Root nodes
    }
    

    public async ValueTask<List<DepartmentTreeDto>> Handle(GetFullDepartmentHierarchyQuery query, CancellationToken cancellationToken)
    {

   var departmentsList=   await  context.Departments.Select(d => new DepartmentTreeDto
            {
                Id = d.Id,
                Title = d.Title,
                IsActive = d.IsActive,
                ParentId = d.ParentId
            })
            .AsNoTracking()
            .ToListAsync(cancellationToken);

  var trees= BuildTree(departmentsList);
   
        
        

      
        return trees;
    }
}
