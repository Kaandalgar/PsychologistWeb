using System.ComponentModel.DataAnnotations;

namespace PsychologistWeb.Api.DTOs
{
    public class CreateContactMessageDto
    {
        [Required(ErrorMessage = "Ad soyad zorunludur.")]
        [StringLength(
            100,
            MinimumLength = 2,
            ErrorMessage = "Ad soyad 2-100 karakter arasında olmalıdır."
        )]
        public string FullName { get; set; } = string.Empty;


        [Required(ErrorMessage = "E-posta adresi zorunludur.")]
        [EmailAddress(
            ErrorMessage = "Geçerli bir e-posta adresi giriniz."
        )]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;


        [StringLength(
            20,
            ErrorMessage = "Telefon numarası en fazla 20 karakter olabilir."
        )]
        public string? Phone { get; set; }


        [Required(ErrorMessage = "Konu zorunludur.")]
        [StringLength(
            150,
            MinimumLength = 3,
            ErrorMessage = "Konu 3-150 karakter arasında olmalıdır."
        )]
        public string Subject { get; set; } = string.Empty;


        [Required(ErrorMessage = "Mesaj zorunludur.")]
        [StringLength(
            2000,
            MinimumLength = 5,
            ErrorMessage = "Mesaj 5-2000 karakter arasında olmalıdır."
        )]
        public string Message { get; set; } = string.Empty;
    }
}