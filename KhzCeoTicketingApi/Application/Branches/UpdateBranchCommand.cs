using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record UpdateBranchCommand : ICommand<BranchDto>
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public int CityId { get; init; }
    public List<int> DepartmentIds { get; init; } = new();
    public bool IsActive { get; init; } = true;
}
public sealed class UpdateBranchCommandHandler(IApplicationDbContext context) 
    : ICommandHandler<UpdateBranchCommand, BranchDto>
{
    public async ValueTask<BranchDto> Handle(UpdateBranchCommand command, CancellationToken cancellationToken)
    {
        var branch = await context.Branches
            .Include(b => b.BranchDepartments)
            .FirstOrDefaultAsync(b => b.Id == command.Id, cancellationToken);

        if (branch == null)
        {
            throw new KeyNotFoundException($"شعبه با شناسه {command.Id} یافت نشد.");
        }

        // Verify city exists
        var cityExists = await context.Cities
            .AnyAsync(c => c.Id == command.CityId, cancellationToken);
        
        if (!cityExists)
        {
            throw new ArgumentException("شهر با شناسه مشخص شده یافت نشد.", nameof(command.CityId));
        }

        // Verify departments exist
        if (command.DepartmentIds.Any())
        {
            var existingDepartmentIds = await context.Departments
                .Where(d => command.DepartmentIds.Contains(d.Id))
                .Select(d => d.Id)
                .ToListAsync(cancellationToken);

            var invalidDepartmentIds = command.DepartmentIds
                .Except(existingDepartmentIds)
                .ToList();

            if (invalidDepartmentIds.Any())
            {
                throw new ArgumentException(
                    $"دپارتمان‌های با شناسه‌های زیر یافت نشدند: {string.Join(", ", invalidDepartmentIds)}", 
                    nameof(command.DepartmentIds));
            }
        }

        // Update properties
        branch.Title = command.Title;
        branch.CityId = command.CityId;
        branch.IsActive = command.IsActive;

        // Update departments
        branch.BranchDepartments.Clear();
        if (command.DepartmentIds.Any())
        {
            var departments = await context.Departments
                .Where(d => command.DepartmentIds.Contains(d.Id))
                .ToListAsync(cancellationToken);

            foreach (var department in departments)
            {
                branch.BranchDepartments.Add(new BranchDepartment{
                    Department =department
                    });
            }
        }

        await context.SaveChangesAsync(cancellationToken);

        return new BranchDto
        {
            Id = branch.Id,
            Title = branch.Title,
            CityId = branch.CityId,
            DepartmentIds = command.DepartmentIds,
            IsActive = branch.IsActive
        };
    }
}