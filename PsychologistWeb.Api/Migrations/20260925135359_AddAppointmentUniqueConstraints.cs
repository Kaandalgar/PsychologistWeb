using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PsychologistWeb.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAppointmentUniqueConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AvailableSlots_StartDateTime",
                table: "AvailableSlots",
                column: "StartDateTime",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_AppointmentDate",
                table: "Appointments",
                column: "AppointmentDate",
                unique: true,
                filter: "[Status] <> 2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AvailableSlots_StartDateTime",
                table: "AvailableSlots");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_AppointmentDate",
                table: "Appointments");
        }
    }
}
