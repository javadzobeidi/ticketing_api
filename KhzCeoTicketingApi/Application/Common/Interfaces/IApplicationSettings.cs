using System.Security.Claims;

namespace Application.Common.Interfaces;

 public interface IApplicationSettings
{
    string GetSetting(string key);
}
