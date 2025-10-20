using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("BranchDepartment")]
public class BranchDepartment
{
    public int Id { set; get; }
    public int DepartmentId { get; set; }
    public int BranchId { get; set; }
    public Department Department { set; get; }
    public Branch Branch { set; get; }

}

