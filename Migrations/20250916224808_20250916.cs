using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoGestionTicket.Migrations
{
    /// <inheritdoc />
    public partial class _20250916 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DesarrolladorID",
                table: "Ticket",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_DesarrolladorID",
                table: "Ticket",
                column: "DesarrolladorID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ticket_Desarrollador_DesarrolladorID",
                table: "Ticket",
                column: "DesarrolladorID",
                principalTable: "Desarrollador",
                principalColumn: "DesarrolladorID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ticket_Desarrollador_DesarrolladorID",
                table: "Ticket");

            migrationBuilder.DropIndex(
                name: "IX_Ticket_DesarrolladorID",
                table: "Ticket");

            migrationBuilder.DropColumn(
                name: "DesarrolladorID",
                table: "Ticket");
        }
    }
}
