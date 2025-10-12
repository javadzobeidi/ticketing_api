using KhzCeoTicketingApi.Domains.Entities;

namespace KhzCeoTicketingApi.Application.Contract;

public class UserDto
{
    public long UserId { set; get; }
    public string FirstName { set; get; }
    public string LastName { set; get; }
    public string NationalCode { set; get; }
    public string Mobile { set; get; }
    public int CityId { set; get; }
    public string City { set; get; }

    public static UserDto From(User user)
    {
   
    
        return new UserDto
        {
            UserId = user.UserId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            NationalCode = user.NationalCode,
            Mobile = user.Mobile,
            CityId = user.CityId,
            City = user.City.Title
           
        };
    }
}