namespace KhzCeoTicketingApi.Application.Contract;

public class UserDepartmentDto
{
    public long Id { set; get; }
    public int BranchId { set; get; }
    public int DepartmentId { set; get; }
    public string Title { set; get; }

}