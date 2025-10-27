using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProyectoGestionTicket.Models.General
{
    public class Ticket
    {
        [Key]
        public int TicketID { get; set; }
        public string? Titulo { get; set; }
        public string? Descripcion { get; set; }
        public Estado Estados { get; set; }

        [NotMapped]
        public string EstadoString { get { return Estados.ToString(); } }
        public Prioridad Prioridades { get; set; }

        [NotMapped]
        public string PrioridadString { get { return Prioridades.ToString(); } }
        public DateTime FechaCreacion { get; set; }

        [NotMapped]
        public string FechaCreacionString { get { return FechaCreacion.ToString("dd/MM/yyyy HH:mm"); } }
        public DateTime FechaComienzoRespuesta { get; set; }
        [NotMapped]
        public string FechaComienzoRespuestaString { get { return FechaComienzoRespuesta.ToString("dd/MM/yyyy HH:mm"); }}
        public DateTime FechaCierre { get; set; }
        public string FechaCierreString { get { return FechaCierre.ToString("dd/MM/yyyy HH:mm"); }}
        public string? UsuarioClienteID { get; set; }
        public int CategoriaID { get; set; }
        [NotMapped]
        public string? CategoriaString { get { return Categoria?.Nombre; } }
        public string? UsuarioDesarrolladorID { get; set; }
        public virtual Categoria? Categoria { get; set; }
        public virtual ICollection<HistorialTicket>? HistorialTicket { get; set; }
    }

    public enum Estado
    {
        Abierto = 1,
        EnProceso,
        Cerrado,
        Cancelado
    }

    public enum Prioridad
    {
        Baja = 1,
        Media,
        Alta
    }

    public class FiltroTicket
    {
        public int CategoriaID { get; set; }
        public int Prioridad { get; set; }
        public int Estado { get; set; }
        public string? FechaDesde { get; set; }
        public string? FechaHasta { get; set; }
    }


    public class FiltroTicketCliente
    {
        public int ClienteID { get; set; }
        public string? FechaDesde { get; set; }
        public string? FechaHasta { get; set; }
    }
}