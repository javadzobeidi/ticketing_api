﻿namespace KhzCeoTicketingApi.Domains.Entities;

public class TicketMessage
{
    public long Id { get; set; }
    public long TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    public long SenderId { get; set; }
    public User Sender { get; set; } = null!;

    public string Message { get; set; } = null!;
    public DateTime SentAt { get; set; } = DateTime.Now;
    public string DateFa { set; get; }
    public string TimeFa { set; get; }
    public bool IsFromStaff { get; set; }
    
}