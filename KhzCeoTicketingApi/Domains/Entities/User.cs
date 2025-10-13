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
    public string NationalCode { set; get; }
    public string Mobile { set; get; }
    public int CityId { set; get; }
    public string Password { set; get; }
    public string PasswordSalt { set; get; }
    public DateTimeOffset? LastLoginDateTime { set; get; }

    public string Role { set; get; }
    public City City { set; get; }

    public ICollection<UserDepartment>  UserDepartments { set; get; }
}

