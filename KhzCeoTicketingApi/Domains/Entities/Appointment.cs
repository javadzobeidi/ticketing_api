namespace KhzCeoTicketingApi.Domains.Entities;

public class Appointment
{
    public long Id { set; get; }
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }

    public string StartDate { set; get; }
    public string EndDate { set; get; }

    public string StartTime { set; get; }
    public string EndTime { set; get; }

    public int IntervalMinutes { set; get; }

    public int UserId { set; get; }
    public int DepartmentId { set; get; }
    public int BranchId { set; get; }
    public int CityId { set; get; }
    
    public Branch Branch { set; get; }
    public Department Department { set; get; }
    public City City { set; get; }  
    
  
}