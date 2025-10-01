using System.ComponentModel.DataAnnotations;

namespace ProyectoGestionTicket.ModelsVistas
{
    public class DesarrolladorTickets
    {
        [Key]
        public int DesarrolladorID { get; set; }
        public string Nombre { get; set; }
        public List<CategoriaDesarrolladorTickets>? Categorias { get; set; }
    }

    public class CategoriaDesarrolladorTickets
    {
        [Key]
        public int CategoriaID { get; set; }
        public string Nombre { get; set; }
        public List<ClienteTicket>? Clientes { get; set; }
    }
}