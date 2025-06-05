using System.ComponentModel.DataAnnotations;

namespace ProyectoGestionTicket.Models.General
{
    public class HistorialTicket
    {
        [Key]
        public int HistorialTicketID { get; set; }
        public int TicketID { get; set; }
        public string? CampoModificado { get; set; }
        public string? ValorAnterior { get; set; }
        public string? ValorNuevo { get; set; }
        public DateTime FechaCambio { get; set; }

        public virtual Ticket? Ticket { get; set; }
    }
}