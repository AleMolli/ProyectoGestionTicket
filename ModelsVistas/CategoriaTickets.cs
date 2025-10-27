using System.ComponentModel.DataAnnotations;

namespace ProyectoGestionTicket.ModelsVistas
{
    public class CategoriaTickets
    {
        [Key]
        public int CategoriaID { get; set; }
        public string? Nombre { get; set; }
        public int CantidadAbiertos { get; set; }
        public int CantidadenProceso { get; set; }
        public int CantidadCerrados { get; set; }
        public int TicketsTotales { get; set; }
        public decimal Critico { get; set; }
        public string? FechaUltimoTicketCreado { get; set; }
        public string? FechaUltimoTicketFinalizado { get; set; }
        public List<VistaTickets>? Tickets { get; set; }
    }
}