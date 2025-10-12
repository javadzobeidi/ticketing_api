
using Application.Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Domains.Entities;

namespace Application;


public sealed record GetCitiesQuery() : IQuery<List<CityDto>>
{
}

public record CityDto(int Id, string Name);

public sealed record GetCitiesQueryHandler(IApplicationDbContext context) : IQueryHandler<GetCitiesQuery, List<CityDto>>
{
    public async ValueTask< List<CityDto>> Handle(GetCitiesQuery query,CancellationToken cancellationToken )
    {
       var cities=await context.Cities.Select(c => new CityDto(c.Id, c.Title)).AsNoTracking().ToListAsync();
       return cities;
    }
}





