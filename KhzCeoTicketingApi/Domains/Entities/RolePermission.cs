using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("RolePermission")]
public class RolePermission
{
    public RolePermission()
    {
    }

    public int Id { get; set; } 
    
    public int RoleId { get; set; }

    public int PermissionId { set; get; }

    public Permission Permission { set; get; }
    public Role Role { set; get; }
}

