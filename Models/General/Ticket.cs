using System.ComponentModel.DataAnnotations;

namespace ProyectoGestionTicket.Models.General
{
    public class Ticket
    {
        [Key]
        public int TicketID { get; set; }
        public string? Titulo { get; set; }
        public string? Descripcion { get; set; }
        public Estado Estados { get; set; }
        public Prioridad Prioridades { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaCierre { get; set; }
        public int UsuarioClienteID { get; set; }
        public int CategoriaID { get; set; }

        public virtual Categoria? Categoria { get; set; }

        public enum Estado {
            Abierto,
            EnProceso,
            Cerrado,
            Cancelado
        }

        public enum Prioridad {
            Baja,
            Media,
            Alta
        }
    }
}