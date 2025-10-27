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
    DbSet<Role> Roles { get; }
    DbSet<Appointment> Appoinments { get; }
    DbSet<Ticket> Tickets { get; }
    DbSet<TicketStatus> TicketStatus { get; }

    DbSet<Attachment> Attachments { get; }

    DbSet<Department> Departments { get; }
    DbSet<Permission> Permissions { get; }
    DbSet<RolePermission> RolePermissions { get; }
    DbSet<UserDepartment> UserDepartments { get; }

     DbSet<Branch> Branches { get; }
     DbSet<BranchDepartment> BranchDepartments { get; }

    Task<IDbContextTransaction> BeginTransactionAsync();

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
