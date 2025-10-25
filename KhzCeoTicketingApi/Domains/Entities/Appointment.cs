using System.ComponentModel.DataAnnotations;
using KhzCeoTicketingApi.Domains.Enums;

namespace KhzCeoTicketingApi.Domains.Entities;

public class Appointment
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
    public AppointmentStatus AppointmentStatus { set; get; }
    
    public ICollection<AppointmentAssignment> AppointmentAssignments { set; get; }
  public ICollection<AppointmentMessage> AppointmentMessages { set; get; }
}