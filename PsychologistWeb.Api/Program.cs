using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PsychologistWeb.Api.Data;
using PsychologistWeb.Api.Models;
using PsychologistWeb.Api.Services.EmailServices;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);


// =========================
// CONTROLLERS
// =========================

builder.Services.AddControllers();


// =========================
// PASSWORD HASHER
// =========================

builder.Services.AddScoped<
    IPasswordHasher<AdminUser>,
    PasswordHasher<AdminUser>
>();


// =========================
// JWT
// =========================

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "Jwt:Key bulunamadý. User Secrets veya environment variable üzerinden tanýmlayýn."
    );
}

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ClockSkew = TimeSpan.FromMinutes(1)
            };
    });


builder.Services.AddAuthorization();


// =========================
// DATABASE
// =========================

builder.Services.AddDbContext<AppDbContext>(
    options =>
        options.UseSqlServer(
            builder.Configuration
                .GetConnectionString(
                    "DefaultConnection"
                )
        )
);


// =========================
// CORS
// =========================

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "ReactPolicy",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});


// =========================
// EMAIL
// =========================

builder.Services.Configure<EmailSettings>(
    builder.Configuration
        .GetSection("EmailSettings")
);

builder.Services.AddScoped<
    IEmailService,
    EmailService
>();


// =========================
// RATE LIMITING
// =========================

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode =
        StatusCodes.Status429TooManyRequests;


    // -------------------------
    // GENEL API KORUMASI
    // IP baþýna 120 istek / dakika
    // -------------------------

    options.GlobalLimiter =
        PartitionedRateLimiter.Create<HttpContext, string>(
            httpContext =>
            {
                var ipAddress =
                    httpContext.Connection
                        .RemoteIpAddress?
                        .ToString()
                    ?? "unknown";

                return RateLimitPartition
                    .GetFixedWindowLimiter(
                        partitionKey: ipAddress,
                        factory: _ =>
                            new FixedWindowRateLimiterOptions
                            {
                                PermitLimit = 120,

                                Window =
                                    TimeSpan.FromMinutes(1),

                                QueueLimit = 0,

                                QueueProcessingOrder =
                                    QueueProcessingOrder
                                        .OldestFirst,

                                AutoReplenishment = true
                            }
                    );
            });


    // -------------------------
    // LOGIN
    // IP baþýna 5 deneme / dakika
    // -------------------------

    options.AddPolicy<string>(
        "auth",
        httpContext =>
        {
            var ipAddress =
                httpContext.Connection
                    .RemoteIpAddress?
                    .ToString()
                ?? "unknown";

            return RateLimitPartition
                .GetFixedWindowLimiter(
                    partitionKey: ipAddress,
                    factory: _ =>
                        new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 5,

                            Window =
                                TimeSpan.FromMinutes(1),

                            QueueLimit = 0,

                            QueueProcessingOrder =
                                QueueProcessingOrder
                                    .OldestFirst,

                            AutoReplenishment = true
                        }
                );
        });


    // -------------------------
    // ÞÝFRE SIFIRLAMA
    // IP baþýna 3 istek / 10 dakika
    // -------------------------

    options.AddPolicy<string>(
        "password-reset",
        httpContext =>
        {
            var ipAddress =
                httpContext.Connection
                    .RemoteIpAddress?
                    .ToString()
                ?? "unknown";

            return RateLimitPartition
                .GetFixedWindowLimiter(
                    partitionKey: ipAddress,
                    factory: _ =>
                        new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 3,

                            Window =
                                TimeSpan.FromMinutes(10),

                            QueueLimit = 0,

                            QueueProcessingOrder =
                                QueueProcessingOrder
                                    .OldestFirst,

                            AutoReplenishment = true
                        }
                );
        });


    // -------------------------
    // PUBLIC FORM
    // Randevu / iletiþim
    // IP baþýna 10 istek / dakika
    // -------------------------

    options.AddPolicy<string>(
        "public-write",
        httpContext =>
        {
            var ipAddress =
                httpContext.Connection
                    .RemoteIpAddress?
                    .ToString()
                ?? "unknown";

            return RateLimitPartition
                .GetFixedWindowLimiter(
                    partitionKey: ipAddress,
                    factory: _ =>
                        new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 10,

                            Window =
                                TimeSpan.FromMinutes(1),

                            QueueLimit = 0,

                            QueueProcessingOrder =
                                QueueProcessingOrder
                                    .OldestFirst,

                            AutoReplenishment = true
                        }
                );
        });


    // Rate limit aþýlýrsa temiz JSON döndür.
    options.OnRejected = async (
        context,
        cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode =
            StatusCodes.Status429TooManyRequests;

        await context.HttpContext.Response
            .WriteAsJsonAsync(
                new
                {
                    message =
                        "Çok fazla istek gönderildi. Lütfen kýsa bir süre sonra tekrar deneyin."
                },
                cancellationToken
            );
    };
});


// =========================
// OPEN API
// =========================

builder.Services.AddOpenApi();


var app = builder.Build();


// =========================
// DEVELOPMENT / PRODUCTION
// =========================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}


// =========================
// STATIC FILES
// =========================

app.UseStaticFiles();


// =========================
// CORS
// =========================

app.UseCors("ReactPolicy");


// =========================
// RATE LIMITER
// =========================

app.UseRateLimiter();


// =========================
// AUTH
// =========================

app.UseAuthentication();
app.UseAuthorization();


// =========================
// CONTROLLERS
// =========================

app.MapControllers();


app.Run();