namespace KhzCeoTicketingApi.Application.Contract;

public class UserDepartmentDto
{
    public long Id { set; get; }
    public int BranchId { set; get; }
    public int DepartmentId { set; get; }
    public int CityId { set; get; }
    public string Title { set; get; }
    public string City { set; get; }
    

}

public class BranchDepartmentDto
{
    public int Id { set; get; }
    public int BranchId { set; get; }
    public int DepartmentId { set; get; }
    public int CityId { set; get; }
    public string Title { set; get; }
    public string City { set; get; }
    

}
