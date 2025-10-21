using KhzCeoTicketingApi.Domains.Entities;

namespace KhzCeoTicketingApi.Application.Contract;

public class UserProfileDto
{
    public long UserId { set; get; }
    public string FirstName { set; get; }
    public string LastName { set; get; }
    public string NationalCode { set; get; }
    public string Mobile { set; get; }
    public int CityId { set; get; }
    public string City { set; get; }
    public bool IsActive { set; get; }
    public int RoleId { set; get; }
    public String Role { set; get; }

    public Guid Identity { set; get; }
    public List<UserDepartmentDto> UserDepartments { set; get; }=new List<UserDepartmentDto>();

    public List<String> Permissions { set; get; }=new List<string>();

    public static UserProfileDto From(User user)
    {
        return new UserProfileDto
        {
            UserId = user.UserId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            NationalCode = user.NationalCode,
            Mobile = user.Mobile,
            CityId = user.CityId,
            City = user.City.Title,
           
        };
    }
    
    
}