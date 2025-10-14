using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record CreateBranchCommand : ICommand<BranchDto>
{
    public string Title { get; init; } = string.Empty;
    public int CityId { get; init; }
    public List<int> DepartmentIds { get; init; } = new();
    public bool IsActive { get; init; } = true;
}


public sealed class CreateBranchCommandValidation : AbstractValidator<CreateBranchCommand>
{
    public CreateBranchCommandValidation()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("عنوان شعبه نمی‌تواند خالی باشد.")
            .MaximumLength(100).WithMessage("عنوان شعبه نباید بیشتر از ۱۰۰ کاراکتر باشد.")
            .MinimumLength(2).WithMessage("عنوان شعبه باید حداقل ۲ کاراکتر باشد.");

        RuleFor(x => x.CityId)
            .GreaterThan(0).WithMessage("شناسه شهر باید بزرگتر از صفر باشد.");

        RuleFor(x => x.DepartmentIds)
            .NotNull().WithMessage("لیست دپارتمان‌ها نمی‌تواند null باشد.");

        RuleForEach(x => x.DepartmentIds)
            .GreaterThan(0).WithMessage("شناسه دپارتمان باید بزرگتر از صفر باشد.");
    }
}


public sealed class CreateBranchCommandHandler(IApplicationDbContext context) 
    : ICommandHandler<CreateBranchCommand, BranchDto>
{
    public async ValueTask<BranchDto> Handle(CreateBranchCommand command, CancellationToken cancellationToken)
    {
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

        var branch = new Branch
        {
            Title = command.Title,
            CityId = command.CityId,
            IsActive = command.IsActive
        };

        // Add departments to branch
        if (command.DepartmentIds.Any())
        {
            var departments = await context.Departments
                .Where(d => command.DepartmentIds.Contains(d.Id))
                .ToListAsync(cancellationToken);

            foreach (var dep in departments)
                branch.BranchDepartments.Add(new BranchDepartment
                {
                    Department = dep
                });
            
        }

        context.Branches.Add(branch); 
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