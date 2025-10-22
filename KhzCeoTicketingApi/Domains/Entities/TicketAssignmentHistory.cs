using KhzCeoTicketingApi.Domains.Enums;

namespace KhzCeoTicketingApi.Domains.Entities;

public class TicketAssignmentHistory
{
    public int Id { get; set; }
    public int TicketId { get; set; }
    public Ticket Ticket { get; set; }

    public int? FromUserId { get; set; }
    public int ToUserId { get; set; }
    public DateTime AssignedAt { get; set; }

    public AssignmentType Type { get; set; } = AssignmentType.Forward;
    public string? Note { get; set; }
}