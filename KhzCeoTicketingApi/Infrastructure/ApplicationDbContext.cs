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
    public DbSet<Role> Roles => Set<Role>();
    
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }
    
    public DbSet<UserDepartment> UserDepartments => Set<UserDepartment>();

    public DbSet<Department> Departments => Set<Department>();
    public DbSet<BranchDepartment> BranchDepartments => Set<BranchDepartment>();

    public DbSet<Appointment> Appoinments => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.Entity<User>()
            .HasKey(u => u.UserId);
        
        // First relationship: User -> UserAppointments (one-to-many)
        builder.Entity<User>()
            .HasMany(u => u.UserAppointments)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Second relationship: User -> AssignmentAppointments (one-to-many)
        builder.Entity<User>()
            .HasMany(u => u.AssignmentAppointments)
            .WithOne(a => a.CurrentAssignmentUser)
            .HasForeignKey(a => a.CurrentAssignmentUserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        
        
        builder.Entity<Appointment>()
            .Property(e => e.RowVersion)
            .IsRowVersion()
            .IsConcurrencyToken();
        
        builder.Entity<RolePermission>()
            .HasKey(rp => new { rp.RoleId, rp.PermissionId });
        
        builder.Entity<RolePermission>()
            .HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId);

        builder.Entity<RolePermission>()
            .HasOne(rp => rp.Permission)
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId);
        
        
        builder.Entity<Branch>()
            .HasOne(b => b.City)
            .WithMany()                   // City has zero or many Branches (no navigation property)
            .HasForeignKey(b => b.CityId)
            .OnDelete(DeleteBehavior.NoAction); // or DeleteBehavior.NoAction
        
        
        builder.Entity<User>()
            .HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity<Dictionary<string, object>>(
                "UserRole", // Name of the join table
                j => j.HasOne<Role>().WithMany().HasForeignKey("RoleId"),
                j => j.HasOne<User>().WithMany().HasForeignKey("UserId"),
                j =>
                {
                    j.HasKey("UserId", "RoleId"); // Composite primary key
                    j.ToTable("UserRole");         // Table name in DB
                });
        
        builder.Entity<AppointmentMessage>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.NoAction);

        
        
        builder.Entity<BranchDepartment>(entity =>
        {
            entity.HasKey(bd => bd.Id); // Or use composite key if you don't need Id

            entity.HasOne(bd => bd.Branch)
                .WithMany(b => b.BranchDepartments)
                .HasForeignKey(bd => bd.BranchId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(bd => bd.Department)
                .WithMany(d => d.BranchDepartments)
                .HasForeignKey(bd => bd.DepartmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
    public async Task<IDbContextTransaction> BeginTransactionAsync()
    {
        return await Database.BeginTransactionAsync();
    }

}
