namespace KhzCeoTicketingApi.Application.Contract;
public sealed record BranchDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public int CityId { get; init; }
    public string CityName { set; get; }
    public List<int> DepartmentIds { get; init; } = new();
    public List<DepartmentDto> Departments { get; init; } = new();
    public bool IsActive { get; init; }
}

