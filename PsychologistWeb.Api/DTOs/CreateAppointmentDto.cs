using System.ComponentModel.DataAnnotations;

namespace PsychologistWeb.Api.DTOs
{
    public class CreateAppointmentDto
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


        [Required(ErrorMessage = "Telefon numarası zorunludur.")]
        [StringLength(
            20,
            MinimumLength = 10,
            ErrorMessage = "Geçerli bir telefon numarası giriniz."
        )]
        public string Phone { get; set; } = string.Empty;


        [Required(ErrorMessage = "Randevu tarihi zorunludur.")]
        public DateTime AppointmentDate { get; set; }


        [Required(ErrorMessage = "Görüşme türü zorunludur.")]
        [StringLength(
            50,
            ErrorMessage = "Görüşme türü çok uzun."
        )]
        public string AppointmentType { get; set; } = string.Empty;


        [StringLength(
            1000,
            ErrorMessage = "Mesaj en fazla 1000 karakter olabilir."
        )]
        public string? Message { get; set; }
    }
}