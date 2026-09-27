using System.ComponentModel.DataAnnotations;

namespace PsychologistWeb.Api.DTOs
{
    public class ResetPasswordDto
    {
        [Required(
            ErrorMessage = "Şifre sıfırlama tokenı zorunludur."
        )]
        [StringLength(
            500,
            ErrorMessage = "Geçersiz şifre sıfırlama tokenı."
        )]
        public string Token { get; set; } = string.Empty;


        [Required(
            ErrorMessage = "Yeni şifre zorunludur."
        )]
        [StringLength(
            100,
            MinimumLength = 8,
            ErrorMessage = "Şifre 8-100 karakter arasında olmalıdır."
        )]
        public string NewPassword { get; set; } = string.Empty;
    }
}