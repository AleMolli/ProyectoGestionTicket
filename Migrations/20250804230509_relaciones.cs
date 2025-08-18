using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoGestionTicket.Migrations
{
    /// <inheritdoc />
    public partial class relaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_PuestoCategoria_CategoriaID",
                table: "PuestoCategoria",
                column: "CategoriaID");

            migrationBuilder.CreateIndex(
                name: "IX_PuestoCategoria_PuestoLaboralID",
                table: "PuestoCategoria",
                column: "PuestoLaboralID");

            migrationBuilder.AddForeignKey(
                name: "FK_PuestoCategoria_Categoria_CategoriaID",
                table: "PuestoCategoria",
                column: "CategoriaID",
                principalTable: "Categoria",
                principalColumn: "CategoriaID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PuestoCategoria_PuestoLaboral_PuestoLaboralID",
                table: "PuestoCategoria",
                column: "PuestoLaboralID",
                principalTable: "PuestoLaboral",
                principalColumn: "PuestoLaboralID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PuestoCategoria_Categoria_CategoriaID",
                table: "PuestoCategoria");

            migrationBuilder.DropForeignKey(
                name: "FK_PuestoCategoria_PuestoLaboral_PuestoLaboralID",
                table: "PuestoCategoria");

            migrationBuilder.DropIndex(
                name: "IX_PuestoCategoria_CategoriaID",
                table: "PuestoCategoria");

            migrationBuilder.DropIndex(
                name: "IX_PuestoCategoria_PuestoLaboralID",
                table: "PuestoCategoria");
        }
    }
}
