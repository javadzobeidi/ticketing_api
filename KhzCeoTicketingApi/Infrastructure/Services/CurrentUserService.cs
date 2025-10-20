
using System.Net.NetworkInformation;
using System.Security.Claims;

using Application.Common.Interfaces;
using Microsoft.AspNetCore.Http; // Requires framework reference Microsoft.AspNetCore.App
using System.Security.Claims;

namespace KhzCeoTicketingApi.Infrastructure.Services;

public class CurrentUserService : IUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    // Use ClaimsPrincipal?.FindFirstValue(ClaimTypes.NameIdentifier) or similar

    public long UserId
    {
        get
        {
            var userIdStr = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return long.TryParse(userIdStr, out var id) ? id : 0;
        }
    }

    public ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;



}


