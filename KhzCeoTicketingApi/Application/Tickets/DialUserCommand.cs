using Application.Common.Exceptions;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using MrSmsApi.Application.Common.Interfaces;
using System;
using System.CodeDom;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using AsterNET.NetStandard.Manager;
using AsterNET.NetStandard.Manager.Action;
using AsterNET.NetStandard.Manager.Response;
using KhzCeoTicketingApi.Application.Common.Exceptions;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Application.Extensions;
using KhzCeoTicketingApi.Domains.Entities;
using KhzCeoTicketingApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace KhzCeoTicketingApi.Application.Users;

public sealed record DialUserCommand(long Id) : IQuery<bool>
{
  
}



public sealed class DialUserCommandHandler(
    IApplicationDbContext context,
    IUser user,
    ILogger<RegisterUserCommand> _logger,
    IOptions<JwtConfig> persistenceOptions,
    
    IWebHostEnvironment env) : IQueryHandler<DialUserCommand, bool>
{
    public async ValueTask<bool> Handle(DialUserCommand command, CancellationToken cancellationToken)
    {
        
     var current=  await context.Tickets.Where(d => d.Id == command.Id).Select(d => new
        {
            d.User.Mobile,
            d.CurrentAssignmentUser,
            d.CurrentAssignmentUser.LocalNumber
        }).FirstOrDefaultAsync();
        if (current == null)
        {
            throw new NotFoundException("تیکت یافت نشد");
        }

        if (current.CurrentAssignmentUser == null)
            throw new RequestException("هنوز پشتیبانی انتخاب نشده");
        
        
     string AMI_HOST = "172.16.130.6";      // مثال: "192.168.1.10"
   int AMI_PORT = 5038;
     string AMI_USER = "AMI-amg";         // نام کاربری AMI
     string AMI_SECRET = "Pars@3909$#"; // رمز عبور AMI

     string CALLER_EXTENSION = $"SIP/{current.LocalNumber}";  // کانال مبدا (اولویت با PJSIP است)
     string DIAL_NUMBER = "9"+current.Mobile;      // شماره‌ای که قرار است زنگ بخورد
     string DIAL_CONTEXT = "from-internal";   // کانتکست (اغلب برای تماس خروجی "from-internal" است)
     int DIAL_TIMEOUT_MS = 30000;        
    
        
       var manager = new ManagerConnection(AMI_HOST, AMI_PORT, AMI_USER, AMI_SECRET);
       manager.Login(); 
       if (!manager.IsConnected())
       {
           throw new RequestException("امکان برقراری تماس نمی باشد");
       }
       var originateAction = new OriginateAction
       {
           Channel = CALLER_EXTENSION, 
           Exten = DIAL_NUMBER,
           Context = DIAL_CONTEXT,
           Priority ="1",
           CallerId = $"\"Support_{current.LocalNumber}",
           Timeout = DIAL_TIMEOUT_MS,
           Async = true 
       };

       string persianName = "پشتیبانی واحد";

       var variables = new Dictionary<string, string>
       {
           // ۱. **پاسخ خودکار (Auto-Answer):** تزریق هدر SIP
           // این هدر به تلفن IP شما دستور می دهد که بلافاصله پاسخ دهد.
           { "__SIPADDHEADER0", "Call-Info: answer-after=0" },
           { "__SIPADDHEADER1", "Alert-Info: Ring Answer" },
           { "CALLERIDNAME_UTF8", "پشتیبانی واحد" },
           { "CHANNEL(alertinfo)", "Ring Answer" }
       };
       originateAction.SetVariables(variables);

       ManagerResponse response = manager.SendAction(originateAction, DIAL_TIMEOUT_MS);
       if (response.IsSuccess())
       {
        var currentTicket=  await context.Tickets.Where(d => d.Id == command.Id).FirstOrDefaultAsync(cancellationToken);
           
           DateTime now=DateTime.Now;
           TicketMessage message=new TicketMessage();
           currentTicket.TicketMessages.Add(message);
           message.SentAt = now;
           message.DateFa = now.ToPersianDate();
           message.TimeFa = now.ToTime();
           message.IsFromStaff = true;
           message.MessageTypeId = 2;
           message.Message="تماس با کاربر ";
           
           message.SenderId =user.UserId ;
          await context.SaveChangesAsync(cancellationToken);
           manager.Logoff();

       }
       else
       {
           throw new RequestException("امکان برقراری تماس نمی باشد");
           
       }

       return true;


    }
    
}
    
  



