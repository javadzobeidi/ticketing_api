using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("Department")]
public class Department
{
    public int Id { get; set; }
    public string Title { get; set; }
    public bool IsActive { set; get; }
}

