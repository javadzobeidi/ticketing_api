using System.ComponentModel.DataAnnotations;
using KhzCeoTicketingApi.Domains.Enums;

namespace KhzCeoTicketingApi.Domains.Entities;

public class TicketStatus
{
   
   [Key]
   public int Id { set; get; }
   public string Title { set; get; }
   
}