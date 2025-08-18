using System.ComponentModel.DataAnnotations;

namespace ProyectoGestionTicket.Models.General
{
    public class PuestoCategoria
    {
        [Key]
        public int PuestoCategoriaID { get; set; }
        public int PuestoLaboralID { get; set; }
        public int CategoriaID { get; set; }
        public virtual PuestoLaboral? PuestoLaboral { get; set; }
        public virtual Categoria? Categoria { get; set; }
    }
}