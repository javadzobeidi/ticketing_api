namespace KhzCeoTicketingApi.Domains.Entities;

public class TicketAttachment
{
   public long TicketMessageId { set; get; }
   public long AttachmentId { set; get; }
   public Attachment Attachment { set; get; }
   public TicketMessage TicketMessage { set; get; }

}