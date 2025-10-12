namespace KhzCeoTicketingApi.Application.Common.Exceptions;

public class RequestException : Exception
{
    public RequestException()
        : base()
    {
    }

    public RequestException(string message)
        : base(message)
    {
    }



}
