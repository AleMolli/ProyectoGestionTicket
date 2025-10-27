namespace ProyectoGestionTicket.ModelsVistas
{
    public class InformeTicketxFecha
    {
        public string? FechaCreacion { get; set; }
        public List<TicketsxPrioridad>? Prioridades { get; set; }
    }

    public class TicketsxPrioridad
    {
        public string? Prioridad { get; set; }
        public List<VistaTickets>? Tickets { get; set; }
    }
}