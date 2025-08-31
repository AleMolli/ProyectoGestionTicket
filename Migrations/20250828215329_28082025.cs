using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoGestionTicket.Migrations
{
    /// <inheritdoc />
    public partial class _28082025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FechaComienzoRespuesta",
                table: "Ticket",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaComienzoRespuesta",
                table: "Ticket");
        }
    }
}
