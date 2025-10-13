using System.Reflection;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Domains.Entities;
namespace KhzCeoTicketingApi.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
   
    public DbSet<User> Users => Set<User>();
    public DbSet<City> Cities => Set<City>();
    public DbSet<Branch> Branches => Set<Branch>();

    public DbSet<Department> Departments => Set<Department>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
    public async Task<IDbContextTransaction> BeginTransactionAsync()
    {
        return await Database.BeginTransactionAsync();
    }

}
