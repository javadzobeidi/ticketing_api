using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("OtpSms")]
public class OtpSms
{
    [Key]
    public Guid OtpId { get; set; }   // شناسه یکتا

   
    public string OtpCode { get; set; }  // کد OTP

    
    public DateTime OptDate { get; set; } = DateTime.Now; // زمان ایجاد

    public DateTime OptDateExpire { get; set; } // زمان انقضا

    public string Mobile { get; set; }  // شماره موبایل

}

