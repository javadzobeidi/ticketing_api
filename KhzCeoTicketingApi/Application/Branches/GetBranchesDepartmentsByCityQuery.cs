using System.Drawing.Printing;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record GetBranchesDepartmentsByCityQuery(int CityId) : IQuery<List<ItemValue>>
{
}




public sealed class GetBranchesDepartmentsByCityQueryHandler(IApplicationDbContext context) 
    : IQueryHandler<GetBranchesDepartmentsByCityQuery, List<ItemValue>>
{
    
    public List<BranchDepartmentHierachyItem> BuildTree(List<BranchDepartmentHierachyItem> items)
    {
        var lookup = items.ToLookup(d => d.ParentId);

        foreach (var d in items)
            d.Children = lookup[d.Id].ToList();

        return lookup[null].ToList(); // Root nodes
    }
    
    
    public async ValueTask<List<ItemValue>> Handle(GetBranchesDepartmentsByCityQuery query, CancellationToken cancellationToken)
    {

       var departments=await context.Departments
           .Select(d=>new BranchDepartmentHierachyItem
           {
               ParentId = d.ParentId,
               Id = d.Id,
               Title = d.Title,
           })
           .AsNoTracking().ToListAsync(cancellationToken);
    var treeDepartments=   BuildTree(departments);
    
            
        var list = await context.BranchDepartments
            .Where(b => b.Branch.CityId == query.CityId && b.Department.ParentId==null)
            .Select(d => new 
            {
                Id=d.Id,
                Title = d.Branch.Title,
                ParentId = d.Department.ParentId,
                DepartmentId=d.DepartmentId
                
            }).AsNoTracking().ToListAsync();

        foreach (var d in treeDepartments)
        {
         d.Branches=   list.Where(dep => dep.DepartmentId == d.Id)
                .Select(b => new ItemBranch
                {
                    Id = b.Id,
                    Title = b.Title
                })
                .ToList();
        }

        List<ItemValue> items = new List<ItemValue>();
        

        foreach (var d in treeDepartments)
        {
            
            foreach (var b in d.Branches)
            {
                items.Add(new ItemValue
                {
                    Id = b.Id,
                    Title = d.Title+" "+b.Title
                });

                foreach (var c in d.Children)
                {
                    items.Add(new ItemValue
                    {
                        Id = b.Id,
                        Title =d.Title+" "+ c.Title+" "+b.Title
                    });
                    
                }
            }
            
        }
     

        return items;

    }
}

