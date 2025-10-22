namespace KhzCeoTicketingApi.Domains.Entities;

public class TicketMessage
{
    public int Id { get; set; }
    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    public int SenderId { get; set; }
    public User Sender { get; set; } = null!;

    public string Message { get; set; } = null!;
    public DateTime SentAt { get; set; } = DateTime.Now;

    public bool IsFromStaff { get; set; }
}