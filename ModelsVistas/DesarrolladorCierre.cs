using System.ComponentModel.DataAnnotations;

namespace ProyectoGestionTicket.ModelsVistas
{
    public class DesarrolladorCierreTickets
    {
        [Key]
        public int DesarrolladorID { get; set; }
        public string Nombre { get; set; }
        public List<VistaTickets>? Tickets { get; set; }
    }
}