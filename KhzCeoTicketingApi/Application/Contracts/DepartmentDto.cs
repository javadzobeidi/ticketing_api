namespace KhzCeoTicketingApi.Application.Contract;

public sealed record DepartmentDto
{
    
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public bool IsActive { get; init; }
}
