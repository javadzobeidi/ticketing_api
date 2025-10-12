namespace KhzCeoTicketingApi.Application.Contract;


public class FilterListItem
{
    public string id { set; get; }
    public string value { set; get; }
}


public class SortItem
{
    public SortItem()
    {

    }

    public SortItem(string id)
    {
        this.id = id;
        this.desc = true;
    }
    public SortItem(string id, bool desc)
    {
        this.id = id;
        this.desc = desc;
    }
    public string id { set; get; }
    public bool desc { set; get; }
}