namespace KhzCeoTicketingApi.Domains.Entities;

public class AppointmentMessage
{
    public int Id { get; set; }
    public long AppointmentId { get; set; }
    public Appointment Appointment { get; set; } = null!;

    public long SenderId { get; set; }
    public User Sender { get; set; } = null!;

    public string Message { get; set; } = null!;
    public DateTime SentAt { get; set; } = DateTime.Now;
    public string DateFa { set; get; }
    public string TimeFa { set; get; }
    public bool IsFromStaff { get; set; }
}