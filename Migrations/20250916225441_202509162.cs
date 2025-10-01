using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoGestionTicket.Migrations
{
    /// <inheritdoc />
    public partial class _202509162 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "UsuarioDesarrolladorID",
                table: "Ticket",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioDesarrolladorID",
                table: "Ticket");

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
    }
}
