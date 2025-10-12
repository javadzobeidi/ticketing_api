namespace KhzCeoTicketingApi.Models;

public class ApiSuccessResult
{
    public object data { set; get; }

    public ApiSuccessResult(object model)
    {
        this.data = model;
    }
   
}

public class ApiErrorResult
{
    public object? data { set; get; }
    public string? message { set; get; }

    public ApiErrorResult(string message)
    {
        this.message = message;
        this.data = null;
    }
    public ApiErrorResult(string message, object model)
    {
        this.message = message;
        this.data = model;
    }


}
