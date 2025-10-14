using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record GetBranchesByCityQuery : IQuery<List<ItemValue>>
{
    public int CityId { set; get; }
}


public sealed class GetBranchListCityQueryHandler(IApplicationDbContext context) 
    : IQueryHandler<GetBranchesByCityQuery, List<ItemValue>>
{
    public async ValueTask<List<ItemValue>> Handle(GetBranchesByCityQuery query, CancellationToken cancellationToken)
    {

        var list = await context.BranchDepartments
            .Where(b => b.Branch.CityId == query.CityId)
            .Select(d => new ItemValue
            {
                Id=d.Id,
                Title = " شعبه " + d.Branch.Title + " واحد " + d.Department.Title
                
            }).AsNoTracking().ToListAsync();
        
       

        return list;

    }
}

