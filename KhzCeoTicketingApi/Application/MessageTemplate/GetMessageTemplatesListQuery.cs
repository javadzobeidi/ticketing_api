
using Application.Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Domains.Entities;

namespace Application;


public sealed record GetMessageTemplatesListQuery() : IQuery<List<MessageTemplateListItem>>
{
}

public record MessageTemplateListItem(int Id, string Title,String Description);

public sealed record GetMessageTemplatesListQueryHandler(IApplicationDbContext context) : IQueryHandler<GetMessageTemplatesListQuery, List<MessageTemplateListItem>>
{
    public async ValueTask< List<MessageTemplateListItem>> Handle(GetMessageTemplatesListQuery query,CancellationToken cancellationToken )
    {
       var list=await context.MessageTemplates.Select(c => new MessageTemplateListItem(c.Id, c.Title,c.Description)).AsNoTracking().ToListAsync();
       return list;
    }
}





