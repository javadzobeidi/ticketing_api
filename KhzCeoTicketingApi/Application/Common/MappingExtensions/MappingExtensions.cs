using Application.Models;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Common;


public static class MappingExtensions
{
    public static Task<PaginatedList<TDestination>> PaginatedListAsync<TDestination>(this IQueryable<TDestination> queryable, int pageNumber, int pageSize) where TDestination : class
        => PaginatedList<TDestination>.CreateAsync(queryable.AsNoTracking(), pageNumber, pageSize);


    public static IQueryable<TDestination> Filter<TDestination>(this IQueryable<TDestination> queryable, List<FilterListItem> filters) where TDestination : class
    => DynamicFilter.ApplyFilter(queryable, filters);

    public static IQueryable<TDestination> Sort<TDestination>(this IQueryable<TDestination> queryable, SortItem sortBy) where TDestination : class
       => DynamicFilter.ApplySort(queryable, sortBy);



}