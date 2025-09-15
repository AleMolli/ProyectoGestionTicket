using ProyectoGestionTicket.Models.General;

namespace ProyectoGestionTicket.ModelsVistas
{
    public class VistaTickets
    {
        public int TicketID { get; set; }
        public string Titulo { get; set; }
        public string? Descripcion { get; set; }
        public Prioridad Prioridades { get; set; }
        public string PrioridadString { get; set; }
        public string EstadoString { get; set; }
        public string FechaCreacionString { get; set; }
        public string FechaComienzoRespuestaString { get; set; }
        public string? CategoriaString { get; set; }
    }
}