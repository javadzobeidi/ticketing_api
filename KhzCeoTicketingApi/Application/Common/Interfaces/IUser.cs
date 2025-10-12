using System.Security.Claims;

namespace Application.Common.Interfaces;

public interface IUser
{
    ClaimsPrincipal? User { get; }

    long? UserId { get; }
}
