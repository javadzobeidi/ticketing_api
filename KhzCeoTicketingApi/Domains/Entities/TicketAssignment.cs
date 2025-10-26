using KhzCeoTicketingApi.Domains.Enums;

namespace KhzCeoTicketingApi.Domains.Entities;
public class TicketAssignment
{
    public long Id { get; set; }
    public long TicketAssignmentId { get; set; }
    public long? FromUserId { get; set; }
    public long ToUserId { get; set; }
    public DateTime AssignedAt { get; set; }
    public string AssignDateFa { set; get; }
    public int StatusId { set; get; }

    public string? Note { get; set; }

    public Ticket Ticket { get; set; }
    
}