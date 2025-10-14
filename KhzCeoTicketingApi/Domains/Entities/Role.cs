using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("Role")]
public class Role
{
    public Role()
    {
    }

    public int Id { get; set; }
    public string Title { get; set; }
    
    public ICollection<User> Users { get; set; } = new List<User>();

}

