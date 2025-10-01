using System.Runtime.Intrinsics.X86;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using ProyectoGestionTicket.Models.General;
using ProyectoGestionTicket.ModelsVistas;

namespace ProyectoGestionTicket.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InformesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public InformesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("Filtrar")]
        public async Task<ActionResult<IEnumerable<VistaTickets>>> FiltrarTickets([FromBody] FiltroTicket filtro)
        {
            List<VistaTickets> vista = new List<VistaTickets>();

            var tickets = new List<Ticket>();

            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var desId = HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

            if (rol == "DESARROLLADOR") //preguntamos si el rol es desarrollador
            {
                //buscamos que desarrollador es
                var puestoLaboralID = await _context.Desarrollador
                .Where(d => d.Email == desId)
                .Select(d => d.PuestoLaboralID)
                .FirstOrDefaultAsync();
                //del puesto laboral que tiene el desarrollador, buscamos en la tabla intermedia
                //PuestoCategoria, que categorias tiene asignadas.
                var categories = await _context.PuestoCategoria
                .Where(p => p.PuestoLaboralID == puestoLaboralID)
                .Select(p => p.CategoriaID)
                .ToListAsync();
                //creamos una lista vacia
                //var ticketsFiltrados = new List<Ticket>();
                //recorremos la variable categories
                foreach (var catid in categories)
                {
                    //filtramos los tickets que tengan esas categorias encontradas
                    var filtrados = _context.Ticket.Include(t => t.Categoria).Where(t => t.CategoriaID == catid).ToList();
                    tickets.AddRange(filtrados);
                }
                //tickets = ticketsFiltrados.AsQueryable();
            }
            else if (rol == "CLIENTE")
            {
                tickets.AddRange(_context.Ticket.Include(t => t.Categoria).Where(t => t.UsuarioClienteID == userId).ToList());
            }
            else
            {
                tickets.AddRange(_context.Ticket.Include(t => t.Categoria).ToList());
            }

            if (filtro.CategoriaID > 0)
                tickets = tickets.Where(t => t.CategoriaID == filtro.CategoriaID).ToList();

            if (filtro.Prioridad > 0)
                tickets = tickets.Where(t => (int)t.Prioridades == filtro.Prioridad).ToList();

            if (filtro.Estado > 0)
                tickets = tickets.Where(t => (int)t.Estados == filtro.Estado).ToList();

            DateTime fechaDesde = new DateTime();
            bool fechaDesdeValida = DateTime.TryParse(filtro.FechaDesde, out fechaDesde);

            DateTime fechaHasta = new DateTime();
            bool fechaHastaValida = DateTime.TryParse(filtro.FechaHasta, out fechaHasta);

            if (fechaDesdeValida && fechaHastaValida)
            {
                fechaHasta = fechaHasta.AddHours(23);
                fechaHasta = fechaHasta.AddMinutes(59);
                fechaHasta = fechaHasta.AddSeconds(59);
                tickets = [.. tickets.Where(t => t.FechaCreacion >= fechaDesde && t.FechaCreacion <= fechaHasta)];
            }

            foreach (var ticket in tickets.OrderByDescending(t => t.FechaCreacion))
            {
                var ticketMostrar = new VistaTickets
                {
                    TicketID = ticket.TicketID,
                    Titulo = ticket.Titulo,
                    Descripcion = ticket.Descripcion,
                    FechaCreacionString = ticket.FechaCreacionString,
                    Prioridades = ticket.Prioridades,
                    EstadoString = ticket.EstadoString,

                    CategoriaString = ticket.CategoriaString,
                    PrioridadString = ticket.PrioridadString
                };
                vista.Add(ticketMostrar);
            }

            return vista.ToList();
        }

        [HttpPost("FiltrarCliente")] //Para Administrador: filtra los tickets del cliente seleccionado
        public async Task<ActionResult<IEnumerable<VistaTickets>>> FiltroTicketCliente([FromBody] FiltroTicketCliente filtro)
        {
            List<VistaTickets> vistacliente = new List<VistaTickets>();

            var tickets = new List<Ticket>();

            var emailUsuario = await _context.Cliente.Where(c => c.ClienteID == filtro.ClienteID).Select(c => c.Email).FirstOrDefaultAsync();
            var clienteuserId = await _context.Users.Where(u => u.Email == emailUsuario).Select(u => u.Id).FirstOrDefaultAsync();

            if (filtro.ClienteID > 0)
                tickets.AddRange(_context.Ticket.Include(t => t.Categoria).Where(t => t.UsuarioClienteID == clienteuserId).ToList());

            DateTime fechaDesde = new DateTime();
            bool fechaDesdeValida = DateTime.TryParse(filtro.FechaDesde, out fechaDesde);

            DateTime fechaHasta = new DateTime();
            bool fechaHastaValida = DateTime.TryParse(filtro.FechaHasta, out fechaHasta);

            if (fechaDesdeValida && fechaHastaValida)
            {
                fechaHasta = fechaHasta.AddHours(23);
                fechaHasta = fechaHasta.AddMinutes(59);
                fechaHasta = fechaHasta.AddSeconds(59);
                tickets = [.. tickets.Where(t => t.FechaCreacion >= fechaDesde && t.FechaCreacion <= fechaHasta)];
            }

            foreach (var ticket in tickets.OrderByDescending(t => t.FechaCreacion))
            {
                var ticketMostrar = new VistaTickets
                {
                    TicketID = ticket.TicketID,
                    Titulo = ticket.Titulo,
                    Descripcion = ticket.Descripcion,
                    FechaCreacionString = ticket.FechaCreacionString,
                    Prioridades = ticket.Prioridades,
                    EstadoString = ticket.EstadoString,

                    CategoriaString = ticket.CategoriaString,
                    PrioridadString = ticket.PrioridadString
                };
                vistacliente.Add(ticketMostrar);
            }
            Console.WriteLine(vistacliente);
            return vistacliente.ToList();
        }

        [HttpPost("graficoCategoria")] // Grafico de Tickets por Categoria
        public async Task<ActionResult<IEnumerable<TicketsPorCategoria>>> TicketsPorCategoria([FromBody] FiltroTicket filtro)
        {
            List<TicketsPorCategoria> listadoCategoria = new List<TicketsPorCategoria>();

            var tickets = _context.Ticket.Include(t => t.Categoria).AsQueryable();

            DateTime fechaDesde = new DateTime();
            bool fechaDesdeValida = DateTime.TryParse(filtro.FechaDesde, out fechaDesde);

            DateTime fechaHasta = new DateTime();
            bool fechaHastaValida = DateTime.TryParse(filtro.FechaHasta, out fechaHasta);

            if (fechaDesdeValida && fechaHastaValida)
            {
                fechaHasta = fechaHasta.AddHours(23);
                fechaHasta = fechaHasta.AddMinutes(59);
                fechaHasta = fechaHasta.AddSeconds(59);
                tickets = tickets.Where(t => t.FechaCreacion >= fechaDesde && t.FechaCreacion <= fechaHasta);
            }

            if (filtro.Prioridad > 0)
            {
                tickets = tickets.Where(t => (int)t.Prioridades == filtro.Prioridad);
            }

            if (filtro.Estado > 0)
            {
                tickets = tickets.Where(t => (int)t.Estados == filtro.Estado);
            }

            var resumenPorCategoria = await tickets
                .GroupBy(t => new { t.CategoriaID, Nombre = t.Categoria.Nombre })
                .Select(g => new TicketsPorCategoria
                {
                    CategoriaID = g.Key.CategoriaID,
                    Nombre = g.Key.Nombre,
                    Cantidad = g.Count()
                })
            .ToListAsync();

            return resumenPorCategoria;
        }

        [HttpGet("graficoticketscerrados")] // Grafico de Tickets por Categoria
        public async Task<ActionResult<IEnumerable<GraficoTicketsCerrados>>> TicketsCerrados()
        {
            List<GraficoTicketsCerrados> ticketspormes = new List<GraficoTicketsCerrados>();

            for (int i = 3; i >= 0; i--)
            {
                var fechaComparar = DateTime.Now.AddMonths(-i);
                var ticketsdelMes = await _context.Ticket
                .Where(t => t.FechaCierre.Month == fechaComparar.Month && t.Estados == Estado.Cerrado)
                .ToListAsync();
                var mesMostrar = new GraficoTicketsCerrados
                {
                    Mes = fechaComparar.ToString("MMM"),
                    Cantidad = ticketsdelMes.Count(),
                };
                ticketspormes.Add(mesMostrar);
            }

            return ticketspormes;
        }

        [HttpGet("ticketscreadosycerradospormes")] // Grafico de Tickets por creados y cerrados por mes
        public async Task<ActionResult<IEnumerable<GraficoTicketscreadosycerrados>>> TicketsCreadosyCerrados()
        {
            List<GraficoTicketscreadosycerrados> ticketsCreadosyCerradospormes = new List<GraficoTicketscreadosycerrados>();

            for (int i = 5; i >= 0; i--)
            {
                var fechaComparar = DateTime.Now.AddMonths(-i);
                var ticketsCreadosdelMes = await _context.Ticket
                .Where(t => t.FechaCreacion.Month == fechaComparar.Month)
                .ToListAsync();
                var ticketsCerradosdelMes = await _context.Ticket
                .Where(t => t.FechaCierre.Month == fechaComparar.Month && t.Estados == Estado.Cerrado)
                .ToListAsync();
                var mesMostrar = new GraficoTicketscreadosycerrados
                {
                    Mes = fechaComparar.ToString("MMM"),
                    CantidadCreados = ticketsCreadosdelMes.Count(),
                    CantidadCerrados = ticketsCerradosdelMes.Count()
                };
                ticketsCreadosyCerradospormes.Add(mesMostrar);
            }

            return ticketsCreadosyCerradospormes;
        }

        [HttpPost("ticketsporcategoria")] //Informe de 2 niveles por Categoria
        public async Task<ActionResult<IEnumerable<CategoriaTickets>>> InformePorCategoria([FromBody] FiltroTicket filtro)
        {
            List<CategoriaTickets> categoriasMostrar = new List<CategoriaTickets>();

            var tickets = _context.Ticket.Include(t => t.Categoria).AsQueryable();

            DateTime fechaDesde = new DateTime();
            bool fechaDesdeValida = DateTime.TryParse(filtro.FechaDesde, out fechaDesde);

            DateTime fechaHasta = new DateTime();
            bool fechaHastaValida = DateTime.TryParse(filtro.FechaHasta, out fechaHasta);

            if (fechaDesdeValida && fechaHastaValida)
            {
                fechaHasta = fechaHasta.AddHours(23);
                fechaHasta = fechaHasta.AddMinutes(59);
                fechaHasta = fechaHasta.AddSeconds(59);
                tickets = tickets.Where(t => t.FechaCreacion >= fechaDesde && t.FechaCreacion <= fechaHasta);
            }

            if (filtro.CategoriaID > 0)
                tickets = tickets.Where(t => t.CategoriaID == filtro.CategoriaID);

            if (filtro.Prioridad > 0)
            {
                tickets = tickets.Where(t => (int)t.Prioridades == filtro.Prioridad);
            }

            if (filtro.Estado > 0)
            {
                tickets = tickets.Where(t => (int)t.Estados == filtro.Estado);
            }

            foreach (var ticket in tickets.OrderByDescending(t => t.FechaCreacion))
            {
                //POR CADA TICKETS VAMOS A BUSCAR LA CATEGORIA  
                var categoriaMostrar = categoriasMostrar.Where(c => c.CategoriaID == ticket.CategoriaID).SingleOrDefault();
                if (categoriaMostrar == null)
                {
                    categoriaMostrar = new CategoriaTickets
                    {
                        CategoriaID = ticket.CategoriaID,
                        Nombre = ticket.CategoriaString,
                        Tickets = new List<VistaTickets>()
                    };
                    categoriasMostrar.Add(categoriaMostrar);
                }

                var ticketMostrar = new VistaTickets
                {
                    TicketID = ticket.TicketID,
                    Titulo = ticket.Titulo,
                    FechaCreacionString = ticket.FechaCreacionString,
                    Prioridades = ticket.Prioridades,
                    EstadoString = ticket.EstadoString,
                    CategoriaString = ticket.CategoriaString,
                    PrioridadString = ticket.PrioridadString
                };
                categoriaMostrar.Tickets.Add(ticketMostrar);
            }

            return categoriasMostrar.ToList();
        }

        [HttpPost("ticketsporClientes")] //Informe de 2 niveles por clientes
        public async Task<ActionResult<IEnumerable<ClienteTicket>>> InformePorClientes([FromBody] FiltroTicket filtro)
        {
            List<ClienteTicket> clientesMostrar = new List<ClienteTicket>();

            var tickets = _context.Ticket.Include(t => t.Categoria).AsQueryable();

            //VER DE ACUERDO AL ROL QUE TIENE SI DEBE FILTRAR POR USUARIO O NO
            //var usuarioLogueadoID = HttpContext.User.Identity.Name;
            // var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;

            // if (rol == "CLIENTE")
            // {
            //     tickets = tickets.Where(t => t.UsuarioClienteID == userId);
            // }

            DateTime fechaDesde = new DateTime();
            bool fechaDesdeValida = DateTime.TryParse(filtro.FechaDesde, out fechaDesde);

            DateTime fechaHasta = new DateTime();
            bool fechaHastaValida = DateTime.TryParse(filtro.FechaHasta, out fechaHasta);

            if (fechaDesdeValida && fechaHastaValida)
            {
                fechaHasta = fechaHasta.AddHours(23);
                fechaHasta = fechaHasta.AddMinutes(59);
                fechaHasta = fechaHasta.AddSeconds(59);
                tickets = tickets.Where(t => t.FechaCreacion >= fechaDesde && t.FechaCreacion <= fechaHasta);
            }

            if (filtro.CategoriaID > 0)
                tickets = tickets.Where(t => t.CategoriaID == filtro.CategoriaID);

            if (filtro.Prioridad > 0)
            {
                tickets = tickets.Where(t => (int)t.Prioridades == filtro.Prioridad);
            }

            if (filtro.Estado > 0)
            {
                tickets = tickets.Where(t => (int)t.Estados == filtro.Estado);
            }

            var clientes = await tickets
                .Join(_context.Users,
                    ticket => ticket.UsuarioClienteID,
                    user => user.Id,
                    (ticket, user) => new { ticket, user })
                .Join(_context.Cliente,
                    tu => tu.user.UserName,
                    cliente => cliente.Email,
                    (tu, cliente) => new { tu.ticket, cliente })
                .GroupBy(x => new { x.cliente.ClienteID, x.cliente.Nombre, x.cliente.Email })
                .Select(g => new ClienteTicket
                {
                    ClienteID = g.Key.ClienteID,
                    Nombre = g.Key.Nombre,
                    Email = g.Key.Email,
                    Tickets = g.Select(x => new VistaTickets
                    {
                        TicketID = x.ticket.TicketID,
                        Titulo = x.ticket.Titulo,
                        Prioridades = x.ticket.Prioridades,
                        PrioridadString = x.ticket.PrioridadString,
                        EstadoString = x.ticket.EstadoString,
                        FechaCreacionString = x.ticket.FechaCreacionString,
                        CategoriaString = x.ticket.CategoriaString
                    }).ToList()
                })
                .ToListAsync();

            return clientes;
        }

        [HttpPost("ticketsporDesarrolladores")] //4niveles
        public async Task<ActionResult<IEnumerable<DesarrolladorTickets>>> InformePorDesCliCat([FromBody] FiltroTicket filtro)
        {
            List<DesarrolladorTickets> desarrolladormostrar = new List<DesarrolladorTickets>();

            var tickets = _context.Ticket.Include(t => t.Categoria).AsQueryable();

            DateTime fechaDesde = new DateTime();
            bool fechaDesdeValida = DateTime.TryParse(filtro.FechaDesde, out fechaDesde);

            DateTime fechaHasta = new DateTime();
            bool fechaHastaValida = DateTime.TryParse(filtro.FechaHasta, out fechaHasta);

            if (fechaDesdeValida && fechaHastaValida)
            {
                fechaHasta = fechaHasta.AddHours(23);
                fechaHasta = fechaHasta.AddMinutes(59);
                fechaHasta = fechaHasta.AddSeconds(59);
                tickets = tickets.Where(t => t.FechaCreacion >= fechaDesde && t.FechaCreacion <= fechaHasta);
            }

            if (filtro.CategoriaID > 0)
                tickets = tickets.Where(t => t.CategoriaID == filtro.CategoriaID);

            if (filtro.Prioridad > 0)
            {
                tickets = tickets.Where(t => (int)t.Prioridades == filtro.Prioridad);
            }

            if (filtro.Estado > 0)
            {
                tickets = tickets.Where(t => (int)t.Estados == filtro.Estado);
            }

            var clientes = tickets
                .Join(_context.Users,
                    ticket => ticket.UsuarioClienteID,
                    user => user.Id,
                    (ticket, user) => new { ticket, user })
                .Join(_context.Cliente,
                    tu => tu.user.UserName,
                    cliente => cliente.Email,
                    (tu, cliente) => new { tu.ticket, cliente });

            var desarrolladores = _context.Desarrollador
                .Include(d => d.PuestoLaboral)
                .ToList();
            var PuestoCategoria = _context.PuestoCategoria
                .Include(pc => pc.PuestoLaboral)
                .Include(pc => pc.Categoria)
                .ToList();

            var informe = desarrolladores.Select(d => new DesarrolladorTickets
            {
                DesarrolladorID = d.DesarrolladorID,
                Nombre = d.NombreCompleto,
                Categorias = PuestoCategoria
                    .Where(pc => pc.PuestoLaboralID == d.PuestoLaboralID && (filtro.CategoriaID == 0 || pc.CategoriaID == filtro.CategoriaID))
                    .GroupBy(pc => pc.Categoria)
                    .Select(gCat => new CategoriaDesarrolladorTickets
                    {
                        CategoriaID = gCat.Key.CategoriaID,
                        Nombre = gCat.Key.Nombre,
                        Clientes = clientes
                            .Where(tc => tc.ticket.CategoriaID == gCat.Key.CategoriaID)
                            .GroupBy(tc => tc.cliente)
                            .Select(gCli => new ClienteTicket
                            {
                                ClienteID = gCli.Key.ClienteID,
                                Nombre = gCli.Key.Nombre,
                                Email = gCli.Key.Email,
                                Tickets = gCli.Select(tc => new VistaTickets
                                {
                                    TicketID = tc.ticket.TicketID,
                                    Titulo = tc.ticket.Titulo,
                                    Prioridades = tc.ticket.Prioridades,
                                    PrioridadString = tc.ticket.PrioridadString,
                                    EstadoString = tc.ticket.EstadoString,
                                    FechaCreacionString = tc.ticket.FechaCreacionString,
                                    CategoriaString = tc.ticket.CategoriaString
                                }).ToList()
                            }).ToList()
                    }).ToList()
            }).ToList();

            return informe;
        }

        [HttpPost("ticketsporfechacierre")]
        public async Task<ActionResult<IEnumerable<DesarrolladorCierreTickets>>> InformePorCierreTicket([FromBody] FiltroTicket filtro)
        {
            List<DesarrolladorCierreTickets> desarroladormostrar = new List<DesarrolladorCierreTickets>();

            var tickets = _context.Ticket.Include(t => t.Categoria).Where(t => t.Estados == Estado.Cerrado).AsQueryable();

            DateTime fechaDesde = new DateTime();
            bool fechaDesdeValida = DateTime.TryParse(filtro.FechaDesde, out fechaDesde);

            DateTime fechaHasta = new DateTime();
            bool fechaHastaValida = DateTime.TryParse(filtro.FechaHasta, out fechaHasta);

            if (fechaDesdeValida && fechaHastaValida)
            {
                fechaHasta = fechaHasta.AddHours(23);
                fechaHasta = fechaHasta.AddMinutes(59);
                fechaHasta = fechaHasta.AddSeconds(59);
                tickets = tickets.Where(t => t.FechaCierre >= fechaDesde && t.FechaCierre <= fechaHasta);
            }

            var desarrolladores = await tickets
                .Join(_context.Users,
                    ticket => ticket.UsuarioDesarrolladorID,
                    user => user.Id,
                    (ticket, user) => new { ticket, user })
                .Join(_context.Desarrollador,
                    tu => tu.user.UserName,
                    desarrollador => desarrollador.Email,
                    (tu, desarrollador) => new { tu.ticket, desarrollador })
                .GroupBy(x => new { x.desarrollador.DesarrolladorID, x.desarrollador.NombreCompleto, x.desarrollador.Email })
                .Select(g => new DesarrolladorCierreTickets
                {
                    DesarrolladorID = g.Key.DesarrolladorID,
                    Nombre = g.Key.NombreCompleto,
                    Tickets = g.Select(x => new VistaTickets
                    {
                        TicketID = x.ticket.TicketID,
                        Titulo = x.ticket.Titulo,
                        Prioridades = x.ticket.Prioridades,
                        PrioridadString = x.ticket.PrioridadString,
                        EstadoString = x.ticket.EstadoString,
                        FechaCreacionString = x.ticket.FechaCreacionString,
                        CategoriaString = x.ticket.CategoriaString,
                        FechaCierreString = x.ticket.FechaCierreString
                    }).ToList()
                })
                .ToListAsync();

            return desarrolladores;
        }
    }
}