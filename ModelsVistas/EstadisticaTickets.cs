namespace ProyectoGestionTicket.ModelsVistas
{
    public class EstadisticaTickets
    {
        public string? NombreCliente { get; set; }
        public int TicketsTotales { get; set; }
        public int TicketsAbiertos { get; set; }
        public int TicketsCerrados { get; set; }
        public decimal Critico { get; set; }
        public string? FechaUltimoTicketCreado { get; set; }
        public string? FechaUltimoTicketFinalizado { get; set; }
        public List <CategoriaTickets>? Categorias { get; set; }
    }
}