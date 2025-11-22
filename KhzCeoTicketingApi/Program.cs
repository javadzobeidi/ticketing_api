using System.Reflection;
using Application.Common.Behaviours;
using Application.Common.Interfaces;
using FluentValidation;
using Hangfire;
using Infrastructure.Data.Interceptors;
using Infrastructure.Services;
using KhzCeoTicketingApi;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Filters;
using KhzCeoTicketingApi.Infrastructure.Data;
using KhzCeoTicketingApi.Infrastructure.Data.Interfaces;
using KhzCeoTicketingApi.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options =>
{
    options.Filters.Add<FarsiStringNormalizationFilter>();
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<AuditableEntityInterceptor>();


builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));


});

builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("HangfireConnection")));
    builder.Services.AddHangfireServer();

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
builder.Services.AddDataProtection();
builder.Services.AddMemoryCache();

builder.Services.AddScoped<ICaptchaService, CaptchaService>();
builder.Services.Configure<JwtConfig>(
    builder.Configuration.GetSection("JwtConfig"));

builder.Services.Configure<SmsConfig>(
    builder.Configuration.GetSection("SmsConfig"));

builder.Services.AddScoped<ISmsService, SmsService>();
builder.Services.AddSingleton<ISmsTokenStorage, SmsTokenStorage>();



builder.Services
    .AddScoped(typeof(IPipelineBehavior<,>), typeof(HandleExceptionBehavior<,>))
    //.AddSingleton(typeof(IPipelineBehavior<,>), typeof(ErrorLoggingBehaviour<,>))
    .AddSingleton(typeof(IPipelineBehavior<,>), typeof(MessageValidatorBehaviour<,>))
    .AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

builder.Services.AddSingleton<TimeProvider>(TimeProvider.System);
builder.Services.AddApplicationAuthorization(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithOrigins("http://localhost:5173","https://crm.khzceo.ir")
          
    );

});

builder.Services.AddHttpClient("SMSClient", client =>
{
    client.BaseAddress = new Uri("https://www.payamsms.com/");
    client.Timeout = TimeSpan.FromSeconds(60);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
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
app.UseHangfireDashboard("/hangfire");
app.Run();