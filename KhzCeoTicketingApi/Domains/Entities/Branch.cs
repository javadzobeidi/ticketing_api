namespace KhzCeoTicketingApi.Domains.Entities;

public class Branch
{
    public int Id { get; set; }
    public string Title { get; set; } 
    public int CityId { get; set; }
    
    public bool IsActive { get; set; }
    public City City { set; get; }

    public ICollection<BranchDepartment> BranchDepartments { get; set; } = new List<BranchDepartment>();
}

