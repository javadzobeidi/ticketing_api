namespace KhzCeoTicketingApi.Domains.Entities;

public class Attachment
{
    public long Id { get; set; }
    public string FileName { get; set; }
    public string OriginalFileName { get; set; }
    public string FilePath { get; set; }
    public long FileSize { get; set; }
    public string ContentType { get; set; }
    public DateTime UploadDate { get; set; }
    public int UploadedByUserId { get; set; }
}