using System.Reflection;
using Application.Common.Behaviours;
using Application.Common.Interfaces;
using FluentValidation;
using Infrastructure.Data.Interceptors;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Infrastructure.Data;
using KhzCeoTicketingApi.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
builder.Services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
builder.Services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());


builder.Services.AddScoped<IUser, CurrentUserService>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddMediator(
    (MediatorOptions options) =>
    {
        options.ServiceLifetime = ServiceLifetime.Scoped;
    }
);
builder.Services.AddHttpContextAccessor();

builder.Services.Configure<JwtConfig>(
    builder.Configuration.GetSection("JwtConfig"));


builder.Services

    .AddScoped(typeof(IPipelineBehavior<,>), typeof(HandleExceptionBehavior<,>))
    //.AddSingleton(typeof(IPipelineBehavior<,>), typeof(ErrorLoggingBehaviour<,>))
    .AddSingleton(typeof(IPipelineBehavior<,>), typeof(MessageValidatorBehaviour<,>))
    .AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

builder.Services.AddSingleton<TimeProvider>(TimeProvider.System);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithOrigins("http://localhost:5173")
          
    );

});



var app = builder.Build();
app.UseCors("CorsPolicy");  

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();