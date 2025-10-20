using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("Permission")]
public class Permission
{
    public Permission()
    {
    }

    public int Id { get; set; }
    public string Code { get; set; }
    public string Description { set; get; }
    
    public virtual ICollection<RolePermission> RolePermissions { get; set; }

    

}

