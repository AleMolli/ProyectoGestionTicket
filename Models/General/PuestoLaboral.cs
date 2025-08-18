using System.ComponentModel.DataAnnotations;

namespace ProyectoGestionTicket.Models.General
{
    public class PuestoLaboral
    {
        [Key]
        public int PuestoLaboralID { get; set; }
        public string? Nombre { get; set; }
        public bool Eliminado { get; set; }
        
        public virtual ICollection<Desarrollador>? Desarrollador { get; set; }
    }
}