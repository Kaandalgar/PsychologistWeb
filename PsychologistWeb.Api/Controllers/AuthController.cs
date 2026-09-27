using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PsychologistWeb.Api.Data;
using PsychologistWeb.Api.DTOs;
using PsychologistWeb.Api.Models;
using PsychologistWeb.Api.Services.EmailServices;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PsychologistWeb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<AdminUser> _passwordHasher;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;
        private readonly IEmailService _emailService;

        public AuthController(
            AppDbContext context,
            IPasswordHasher<AdminUser> passwordHasher,
            IConfiguration configuration,
            IWebHostEnvironment environment,
            IEmailService emailService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
            _environment = environment;
            _emailService = emailService;
        }


        // =========================
        // SETUP ADMIN
        // =========================

        [HttpPost("setup-admin")]
        public async Task<IActionResult> SetupAdmin(
            CreateAdminDto dto)
        {
            // Yalnızca Development ortamında çalışır.
            if (!_environment.IsDevelopment())
            {
                return NotFound();
            }

            if (await _context.AdminUsers.AnyAsync())
            {
                return BadRequest(
                    "Admin zaten oluşturulmuş."
                );
            }

            var admin = new AdminUser
            {
                FullName = dto.FullName.Trim(),

                Email = dto.Email
                    .Trim()
                    .ToLower()
            };

            admin.PasswordHash =
                _passwordHasher.HashPassword(
                    admin,
                    dto.Password
                );

            _context.AdminUsers.Add(admin);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =
                    "Admin başarıyla oluşturuldu."
            });
        }


        // =========================
        // LOGIN
        // =========================

        [EnableRateLimiting("auth")]
        [HttpPost("login")]
        public async Task<IActionResult> Login(
            LoginDto loginDto)
        {
            var email = loginDto.Email
                .Trim()
                .ToLower();

            var admin =
                await _context.AdminUsers
                    .FirstOrDefaultAsync(
                        x => x.Email == email
                    );

            if (admin == null)
            {
                return Unauthorized(
                    "E-posta veya şifre hatalı."
                );
            }

            var passwordResult =
                _passwordHasher.VerifyHashedPassword(
                    admin,
                    admin.PasswordHash,
                    loginDto.Password
                );

            if (
                passwordResult ==
                PasswordVerificationResult.Failed
            )
            {
                return Unauthorized(
                    "E-posta veya şifre hatalı."
                );
            }

            var token =
                CreateToken(admin);

            return Ok(new
            {
                token,

                admin = new
                {
                    admin.Id,
                    admin.FullName,
                    admin.Email
                }
            });
        }


        // =========================
        // JWT TOKEN
        // =========================

        private string CreateToken(
            AdminUser admin)
        {
            var claims =
                new List<Claim>
                {
                    new Claim(
                        ClaimTypes.NameIdentifier,
                        admin.Id.ToString()
                    ),

                    new Claim(
                        ClaimTypes.Name,
                        admin.FullName
                    ),

                    new Claim(
                        ClaimTypes.Email,
                        admin.Email
                    ),

                    new Claim(
                        ClaimTypes.Role,
                        "Admin"
                    )
                };

            var jwtKey =
                _configuration["Jwt:Key"];

            if (string.IsNullOrWhiteSpace(jwtKey))
            {
                throw new InvalidOperationException(
                    "JWT Key bulunamadı."
                );
            }

            var key =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        jwtKey
                    )
                );

            var credentials =
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256
                );

            var expireMinutes =
                int.Parse(
                    _configuration[
                        "Jwt:ExpireMinutes"
                    ] ?? "120"
                );

            var token =
                new JwtSecurityToken(
                    issuer:
                        _configuration[
                            "Jwt:Issuer"
                        ],

                    audience:
                        _configuration[
                            "Jwt:Audience"
                        ],

                    claims: claims,

                    expires:
                        DateTime.UtcNow
                            .AddMinutes(
                                expireMinutes
                            ),

                    signingCredentials:
                        credentials
                );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }


        // =========================
        // FORGOT PASSWORD
        // =========================

        [EnableRateLimiting("password-reset")]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
            ForgotPasswordDto dto)
        {
            var email = dto.Email
                .Trim()
                .ToLower();

            var admin =
                await _context.AdminUsers
                    .FirstOrDefaultAsync(
                        x => x.Email == email
                    );

            /*
             * Kullanıcının sistemde bulunup
             * bulunmadığını dışarı vermiyoruz.
             */
            const string successMessage =
                "Bu e-posta sistemde kayıtlıysa " +
                "şifre sıfırlama bağlantısı gönderilmiştir.";

            if (admin == null)
            {
                return Ok(new
                {
                    message = successMessage
                });
            }


            // =========================
            // RESET TOKEN
            // =========================

            var tokenBytes =
                RandomNumberGenerator
                    .GetBytes(32);

            var token =
                WebEncoders.Base64UrlEncode(
                    tokenBytes
                );


            // Token'ın kendisi yerine hash saklanır.
            var tokenHash =
                Convert.ToHexString(
                    SHA256.HashData(
                        Encoding.UTF8.GetBytes(
                            token
                        )
                    )
                );

            admin.PasswordResetTokenHash =
                tokenHash;

            admin.PasswordResetTokenExpiresAt =
                DateTime.UtcNow
                    .AddMinutes(30);

            await _context.SaveChangesAsync();


            // =========================
            // RESET URL
            // =========================

            var frontendUrl =
                _configuration["FrontendUrl"]
                ?? "http://localhost:5173";

            frontendUrl =
                frontendUrl.TrimEnd('/');

            var resetUrl =
                $"{frontendUrl}/admin/sifre-sifirla" +
                $"?token={Uri.EscapeDataString(token)}";


            // =========================
            // EMAIL HTML
            // =========================

            var emailBody = $"""
                <!DOCTYPE html>
                <html>
                <body style="
                    margin:0;
                    padding:0;
                    background-color:#f5f5f2;
                    font-family:Arial,sans-serif;
                ">

                    <div style="
                        max-width:600px;
                        margin:40px auto;
                        background:white;
                        border-radius:12px;
                        padding:35px;
                        border:1px solid #e3e5df;
                    ">

                        <h2 style="
                            margin-top:0;
                            color:#40594d;
                        ">
                            Şifre Sıfırlama
                        </h2>

                        <p style="
                            color:#555;
                            line-height:1.7;
                        ">
                            Merhaba {admin.FullName},
                        </p>

                        <p style="
                            color:#555;
                            line-height:1.7;
                        ">
                            Admin hesabınız için bir
                            şifre sıfırlama talebi aldık.
                        </p>

                        <p style="
                            color:#555;
                            line-height:1.7;
                        ">
                            Yeni şifrenizi belirlemek için
                            aşağıdaki butona tıklayın.
                        </p>

                        <div style="
                            margin:30px 0;
                        ">

                            <a
                                href="{resetUrl}"
                                style="
                                    display:inline-block;
                                    background-color:#526f5f;
                                    color:white;
                                    text-decoration:none;
                                    padding:13px 24px;
                                    border-radius:7px;
                                    font-weight:bold;
                                "
                            >
                                Şifremi Sıfırla
                            </a>

                        </div>

                        <p style="
                            color:#777;
                            font-size:14px;
                            line-height:1.6;
                        ">
                            Bu bağlantı 30 dakika boyunca
                            geçerlidir ve yalnızca bir kez
                            kullanılabilir.
                        </p>

                        <p style="
                            color:#999;
                            font-size:12px;
                            line-height:1.6;
                            margin-top:30px;
                        ">
                            Bu şifre sıfırlama talebini
                            siz oluşturmadıysanız bu
                            e-postayı dikkate almayabilirsiniz.
                        </p>

                    </div>

                </body>
                </html>
                """;


            // =========================
            // MAIL GÖNDER
            // =========================

            await _emailService.SendAsync(
                admin.Email,
                "Şifre Sıfırlama",
                emailBody
            );

            return Ok(new
            {
                message = successMessage
            });
        }


        // =========================
        // RESET PASSWORD
        // =========================

        [EnableRateLimiting("password-reset")]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
            ResetPasswordDto dto)
        {
            if (
                string.IsNullOrWhiteSpace(
                    dto.Token
                )
            )
            {
                return BadRequest(
                    "Geçersiz şifre sıfırlama bağlantısı."
                );
            }

            if (
                string.IsNullOrWhiteSpace(
                    dto.NewPassword
                ) ||
                dto.NewPassword.Length < 8
            )
            {
                return BadRequest(
                    "Yeni şifre en az 8 karakter olmalıdır."
                );
            }


            // =========================
            // TOKEN HASH
            // =========================

            var tokenHash =
                Convert.ToHexString(
                    SHA256.HashData(
                        Encoding.UTF8.GetBytes(
                            dto.Token
                        )
                    )
                );


            var admin =
                await _context.AdminUsers
                    .FirstOrDefaultAsync(
                        x =>
                            x.PasswordResetTokenHash ==
                            tokenHash
                    );

            if (admin == null)
            {
                return BadRequest(
                    "Şifre sıfırlama bağlantısı geçersiz."
                );
            }


            // =========================
            // TOKEN SÜRESİ
            // =========================

            if (
                admin.PasswordResetTokenExpiresAt ==
                null ||

                admin.PasswordResetTokenExpiresAt <
                DateTime.UtcNow
            )
            {
                admin.PasswordResetTokenHash =
                    null;

                admin.PasswordResetTokenExpiresAt =
                    null;

                await _context.SaveChangesAsync();

                return BadRequest(
                    "Şifre sıfırlama bağlantısının süresi dolmuş."
                );
            }


            // =========================
            // YENİ ŞİFRE
            // =========================

            admin.PasswordHash =
                _passwordHasher.HashPassword(
                    admin,
                    dto.NewPassword
                );


            // Token bir daha kullanılamasın.
            admin.PasswordResetTokenHash =
                null;

            admin.PasswordResetTokenExpiresAt =
                null;

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message =
                    "Şifreniz başarıyla değiştirildi."
            });
        }
    }
}