using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Common;
using KhzCeoTicketingApi.Domains.Enums;

namespace KhzCeoTicketingApi.Domains.Entities;

public class Appointment:BaseAuditableEntity
{
    public long Id { set; get; }
    public DateTime AppointmentDate { set; get; }
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
    
    public int AppointmentStatusId { get; set; }

    
    [NotMapped]
    public AppointmentStatusEnum AppointmentStatus
    {
        get => (AppointmentStatusEnum)AppointmentStatusId;
        set => AppointmentStatusId = (int)value;
    }

    public Guid IdentityCode { set; get; }

    public virtual AppointmentStatus AppointmentStatusDetails { get; set; }



    public ICollection<AppointmentAssignment> AppointmentAssignments { set; get; } = new List<AppointmentAssignment>();

    public ICollection<AppointmentMessage> AppointmentMessages { set; get; } = new List<AppointmentMessage>();
  
  public virtual User? User { get; set; }  // The main user
  public virtual User? CurrentAssignmentUser { get; set; }  // The
  
}