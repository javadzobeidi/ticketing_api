using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("UserDepartment")]
public class UserDepartment
{
    [Key]
    public long Id { get; set; }  // Primary key
    public long UserId { get; set; }
    public int DepartmentId { get; set; }
    public int BranchId { get; set; }
    public DateTimeOffset AssignedDate { get; set; }  
    
    public User User { get; set; }
    public Department Department { get; set; }
    public Branch Branch { get; set; }
}

