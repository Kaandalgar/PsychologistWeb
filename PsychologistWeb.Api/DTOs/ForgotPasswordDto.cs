using System.ComponentModel.DataAnnotations;

namespace PsychologistWeb.Api.DTOs
{
    public class ForgotPasswordDto
    {
        [Required(ErrorMessage = "E-posta adresi zorunludur.")]
        [EmailAddress(
            ErrorMessage = "Geçerli bir e-posta adresi giriniz."
        )]
        [StringLength(
            150,
            ErrorMessage = "E-posta adresi çok uzun."
        )]
        public string Email { get; set; } = string.Empty;
    }
}