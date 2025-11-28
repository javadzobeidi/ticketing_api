namespace KhzCeoTicketingApi.Application.Contract;

public sealed record DepartmentDto
{
    
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public bool IsActive { get; init; }
}

public sealed record DepartmentTreeDto
{
    
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public bool IsActive { get; init; }

    public int? ParentId { set; get; }
    
    public List<DepartmentTreeDto> Children { set; get; }
}

