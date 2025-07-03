using ProyectoGestionTicket.Models.General;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext (DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Categoria> Categoria { get; set; } = default!;

        public DbSet<Ticket> Ticket { get; set; } = default!;

public DbSet<ProyectoGestionTicket.Models.General.HistorialTicket> HistorialTicket { get; set; } = default!;

public DbSet<ProyectoGestionTicket.Models.General.Cliente> Cliente { get; set; } = default!;

public DbSet<ProyectoGestionTicket.Models.General.PuestoLaboral> PuestoLaboral { get; set; } = default!;

public DbSet<ProyectoGestionTicket.Models.General.Desarrollador> Desarrollador { get; set; } = default!;
    }
