using System.Drawing.Printing;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record GetBranchesDepartmentHierachyByCityQuery : IQuery<List<BranchDepartmentHierachyItem>>
{
    public int CityId { set; get; }
}

public class BranchDepartmentHierachyItem
{
    public int Id { set; get; }
    public string Title { set; get; }
    public int? ParentId { set; get; }

    public List<ItemBranch> Branches { set; get; } = new List<ItemBranch>();
    public List<BranchDepartmentHierachyItem> Children { set; get; }
}

public class ItemBranch
{
    public int Id { set; get;  }

    public string Title { set; get; }
}


public sealed class GetFullBranchesDepartmentByCityQueryHandler(IApplicationDbContext context) 
    : IQueryHandler<GetBranchesDepartmentHierachyByCityQuery, List<BranchDepartmentHierachyItem>>
{
    
    public List<BranchDepartmentHierachyItem> BuildTree(List<BranchDepartmentHierachyItem> items)
    {
        var lookup = items.ToLookup(d => d.ParentId);

        foreach (var d in items)
            d.Children = lookup[d.Id].ToList();

        return lookup[null].ToList(); // Root nodes
    }
    
    
    public async ValueTask<List<BranchDepartmentHierachyItem>> Handle(GetBranchesDepartmentHierachyByCityQuery query, CancellationToken cancellationToken)
    {
        

       var departments=await context.Departments
           .Select(d=>new BranchDepartmentHierachyItem
           {
               ParentId = d.ParentId,
               Id = d.Id,
               Title = d.Title,
           })
           .AsNoTracking().ToListAsync(cancellationToken);
      var departmentsIds= departments.Select(d => d.Id).ToList();
       
       
       
       var branchList = await context.BranchDepartments
           .Where(b => b.Branch.CityId == query.CityId )
           .Select(d => new 
           {
               Id=d.Id,
               Title = d.Branch.Title,
               ParentId = d.Department.ParentId,
               DepartmentId=d.DepartmentId
                
           }).AsNoTracking().ToListAsync();

      var departmetsBranchIds= branchList.Select(d => d.DepartmentId).ToList();

     departments= departments.Where(d => departmetsBranchIds.Contains(d.Id)).ToList();
            
       
       var treeDepartments=   BuildTree(departments);
    

        foreach (var d in treeDepartments)
        {
            foreach (var t in d.Children)
            {
                t.Branches=   branchList.Where(dep => dep.DepartmentId == t.Id)
                    .Select(b => new ItemBranch
                    {
                        Id = b.Id,
                        Title = b.Title
                    })
                    .ToList();
            }
       
            d.Branches=   branchList.Where(dep => dep.DepartmentId == d.Id)
                .Select(b => new ItemBranch
                {
                    Id = b.Id,
                    Title = b.Title
                })
                .ToList();
            
        }
     

        return treeDepartments;

    }
}

