using KhzCeoTicketingApi.Domains.Enums;

namespace KhzCeoTicketingApi.Domains.Entities;

public class Ticket
{
    public int Id { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }

    public int CreatedByUserId { get; set; }

    // کاربر فعلی مسئول رسیدگی
    public int? CurrentAssignedUserId { get; set; }

    public TicketStatus Status { get; set; } = TicketStatus.Open;

    public DateTime CreatedAt { get; set; }
    public DateTime? ClosedAt { get; set; }

    public ICollection<TicketMessage> TicketMessages { get; set; } = new List<TicketMessage>();
    public ICollection<TicketAssignmentHistory> AssignmentHistories { get; set; } = new List<TicketAssignmentHistory>();
}