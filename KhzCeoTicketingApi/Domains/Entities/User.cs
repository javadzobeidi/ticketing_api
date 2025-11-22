using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("User")]
public class User
{
    public User()
    {
    }

    public long UserId { get; set; }
    public string FirstName { set; get; }
    public string LastName { set; get; }
    public string UserName { set; get; }
    public string NationalCode { set; get; }
    public string Mobile { set; get; }
    public int CityId { set; get; }
    public string Password { set; get; }
    public string? LocalNumber { set; get; }
    
    public string PasswordSalt { set; get; }
    public DateTimeOffset? LastLoginDateTime { set; get; }
    public City City { set; get; }

    public bool IsActive { set; get; }

    public Guid IdentityKey { set; get; }
    public ICollection<Role> Roles { get; set; } = new List<Role>();
    public ICollection<UserDepartment> UserDepartments { set; get; }=new List<UserDepartment>();

    public void AddRole(Role role)
    {
        Roles.Add(role);
    }
    
    public virtual ICollection<Appointment> UserAppointments { get; set; } = new List<Appointment>();  // For a.User
    public virtual ICollection<Appointment> AssignmentAppointments { get; set; } = new List<Appointment>();  // For a.CurrentAssignmentUser

    

}

