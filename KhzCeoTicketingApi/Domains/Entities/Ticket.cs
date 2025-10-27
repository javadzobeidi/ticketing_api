using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using KhzCeoTicketingApi.Domains.Enums;

namespace KhzCeoTicketingApi.Domains.Entities;

public class Ticket
{
    
    public long Id { set; get; }
    public DateTime TicketDate { set; get; }
    public string DateFa { set; get; }
    public string TimeFa { set; get; }
    
    public long? UserId { set; get; }
    public long? CurrentAssignmentUserId { set; get; }
    public string? Description { set; get; }
    public int DepartmentId { set; get; }
    public int BranchId { set; get; }
    public int CityId { set; get; }
    
    [Timestamp]
    public byte[] RowVersion { get; set; }
    
    public Branch Branch { set; get; }
    public Department Department { set; get; }
    public City City { set; get; }
    
    public int TicketStatusId { get; set; }

    public Guid IdentityCode { set; get; }


    public TicketStatus TicketStatus { set; get; }
    public ICollection<TicketAssignment> TicketAssignments { set; get; } = new List<TicketAssignment>();

    public ICollection<TicketMessage> TicketMessages { set; get; } = new List<TicketMessage>();
  
    public virtual User? User { get; set; }  // The main user
    public virtual User? CurrentAssignmentUser { get; set; }  // The


    public long? LastResponderId { set; get; }
    
    [ForeignKey(nameof(LastResponderId))]
    public virtual User? LastResponderUser { get; set; }  // The

}