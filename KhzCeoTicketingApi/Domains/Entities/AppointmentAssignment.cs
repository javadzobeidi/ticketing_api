namespace KhzCeoTicketingApi.Domains.Entities;

public class AppointmentAssignment
{
    public int Id { get; set; }
    public long AppointmentId { get; set; }

    public long? FromUserId { get; set; }
    public long ToUserId { get; set; }
    public DateTime AssignedAt { get; set; }
    public string AssignDateFa { set; get; }
    
    public string? Note { get; set; }

    public Appointment Appointment { get; set; }

    
}