using Application.Common.Exceptions;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;

namespace KhzCeoTicketingApi.Application.Departments;

public sealed record GetDepartmentByIdQuery : IQuery<DepartmentDto?>
{
    public Guid Id { get; init; }
}

public sealed class GetDepartmentByIdQueryValidation : AbstractValidator<GetDepartmentByIdQuery>
{
    public GetDepartmentByIdQueryValidation()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("شناسه دپارتمان نمی‌تواند خالی باشد.");
    }
}

public sealed class GetDepartmentByIdQueryHandler(IApplicationDbContext context) : IQueryHandler<GetDepartmentByIdQuery, DepartmentDto?>
{

    public async ValueTask<DepartmentDto?> Handle(GetDepartmentByIdQuery query, CancellationToken cancellationToken)
    {
        var department = await context.Departments
            .FindAsync(new object[] { query.Id }, cancellationToken);

        if (department == null)
            throw new NotFoundException("واحد یافت نشد");

        return new DepartmentDto
        {
            Id = department.Id,
            Title = department.Title,
            IsActive = department.IsActive
        };
    }
}
