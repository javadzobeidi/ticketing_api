
using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Enums;

public enum AppointmentStatusEnum
{
    NoReserver=1,
    Reserver=2,
    Completed=3,
    Referral=4,
    Cancelled=5
    
}