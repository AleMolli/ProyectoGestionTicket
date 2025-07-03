using System.ComponentModel.DataAnnotations;

namespace ProyectoGestionTicket.Models.General
{
    public class Desarrollador
    {
        [Key]
        public int DesarrolladorID { get; set; }
        public string? NombreCompleto { get; set; }
        public string? Email { get; set; }
        public long DNI { get; set; }
        public string? Telefono { get; set; }
        public int PuestoLaboralID { get; set; }
        public string? Observaciones { get; set; }

        public virtual PuestoLaboral? PuestoLaboral { get; set; }
    }
}