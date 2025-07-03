using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoGestionTicket.Migrations
{
    /// <inheritdoc />
    public partial class puesto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UsuarioClienteID",
                table: "HistorialTicket",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PuestoLaboral",
                columns: table => new
                {
                    PuestoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Eliminado = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PuestoLaboral", x => x.PuestoID);
                });

            migrationBuilder.CreateTable(
                name: "Desarrollador",
                columns: table => new
                {
                    DesarrolladorID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreCompleto = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DNI = table.Column<long>(type: "bigint", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PuestoLaboralID = table.Column<int>(type: "int", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Desarrollador", x => x.DesarrolladorID);
                    table.ForeignKey(
                        name: "FK_Desarrollador_PuestoLaboral_PuestoLaboralID",
                        column: x => x.PuestoLaboralID,
                        principalTable: "PuestoLaboral",
                        principalColumn: "PuestoID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Desarrollador_PuestoLaboralID",
                table: "Desarrollador",
                column: "PuestoLaboralID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Desarrollador");

            migrationBuilder.DropTable(
                name: "PuestoLaboral");

            migrationBuilder.DropColumn(
                name: "UsuarioClienteID",
                table: "HistorialTicket");
        }
    }
}
