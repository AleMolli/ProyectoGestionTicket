using System.ComponentModel.DataAnnotations;

namespace ProyectoGestionTicket.Models.General
{
    public class Categoria
    {
        [Key]
        public int CategoriaID { get; set;}
        public string? Nombre { get; set; }
        public bool Eliminado { get; set; }

        public virtual ICollection<Ticket>? Ticket { get; set; }
    }
}