using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using KhzCeoTicketingApi.Domains.Entities;
using System.Collections.Generic;
using KhzCeoTicketingApi.Domains.Entities;

namespace KhzCeoTicketingApi.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<City> Cities { get; }
    DbSet<Department> Departments { get; }
    
     DbSet<Branch> Branches { get; }

    Task<IDbContextTransaction> BeginTransactionAsync();

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
