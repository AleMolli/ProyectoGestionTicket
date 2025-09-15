using System.ComponentModel.DataAnnotations;

namespace ProyectoGestionTicket.ModelsVistas
{
    public class ClienteTicket
    {
        [Key]
        public int? ClienteID { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public List<VistaTickets>? Tickets { get; set; }
    }
}