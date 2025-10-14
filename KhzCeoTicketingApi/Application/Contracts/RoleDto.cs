namespace KhzCeoTicketingApi.Application.Contract;

public sealed record RoleDto
{
    
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    
}
