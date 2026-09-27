namespace PsychologistWeb.Api.Models
{
    public class AvailableSlot
    {
        public int Id { get; set; }

        public DateTime StartDateTime { get; set; }

        public bool IsActive { get; set; } = true;
    }
}