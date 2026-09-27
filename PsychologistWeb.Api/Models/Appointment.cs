namespace PsychologistWeb.Api.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public DateTime AppointmentDate { get; set; }

        public string AppointmentType { get; set; } = string.Empty;

        public string? Message { get; set; }

        public AppointmentStatus Status { get; set; }
            = AppointmentStatus.Pending;

        public DateTime CreatedDate { get; set; }
            = DateTime.UtcNow;
    }
}