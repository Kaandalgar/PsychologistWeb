using System.ComponentModel.DataAnnotations;

namespace PsychologistWeb.Api.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "E-posta adresi zorunludur.")]
        [EmailAddress(
            ErrorMessage = "Geçerli bir e-posta adresi giriniz."
        )]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;


        [Required(ErrorMessage = "Şifre zorunludur.")]
        [StringLength(
            100,
            MinimumLength = 8,
            ErrorMessage = "Şifre 8-100 karakter arasında olmalıdır."
        )]
        public string Password { get; set; } = string.Empty;
    }
}