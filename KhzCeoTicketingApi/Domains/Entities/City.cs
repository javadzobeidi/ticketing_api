using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("City")]
public class City
{
    public City()
    {
    }

    public int Id { get; set; }
    public string Title { get; set; }

}

