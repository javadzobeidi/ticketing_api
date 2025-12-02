using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("MessageTemplate")]
public class MessageTemplate
{
    public int Id { get; set; }
    public string Title { get; set; } 
    public string Description { get; set; }
    
}

