using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using ProyectoGestionTicket.Models.General;
using static ProyectoGestionTicket.Models.General.Ticket;

namespace ProyectoGestionTicket.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Tickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTicket()
        {
            var tickets = await _context.Ticket.Include(x => x.Categoria).ToListAsync();
            return tickets;
        }

        // GET: api/Tickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(int id)
        {
            var ticket = await _context.Ticket
                .Include(t => t.Categoria)
                .FirstOrDefaultAsync(t => t.TicketID == id);

            var usuarioCreador = await _context.Users
                .Where(u => u.Id == ticket.UsuarioClienteID)
                .Select(u => new { u.NombreCompleto, u.Email })
                .FirstOrDefaultAsync();

            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                Ticket = ticket,
                UsuarioCreador = usuarioCreador
            });
            ;
        }

        [HttpPost("Filtrar")]
        public async Task<ActionResult<IEnumerable<VistaTickets>>> FiltrarTickets([FromBody] FiltroTicket filtro)
        {
            List<VistaTickets> vista = new List<VistaTickets>();

            var tickets = _context.Ticket.Include(t => t.Categoria).AsQueryable();

            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;

            if (rol == "CLIENTE")
            {
                tickets = tickets.Where(t => t.UsuarioClienteID == userId);
            }

            if (filtro.CategoriaID > 0)
                tickets = tickets.Where(t => t.CategoriaID == filtro.CategoriaID);

            if (filtro.Prioridad > 0)
                tickets = tickets.Where(t => (int)t.Prioridades == filtro.Prioridad);

            if (filtro.Estado > 0)
                tickets = tickets.Where(t => (int)t.Estados == filtro.Estado);

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
                    Estados = ticket.Estados,
                    CategoriaString = ticket.CategoriaString,
                    PrioridadString = ticket.PrioridadString
                };
                vista.Add(ticketMostrar);
            }

            return vista.ToList();
        }

        // PUT: api/Tickets/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTicket(int id, Ticket ticket)
        {
            if (id != ticket.TicketID)
            {
                return BadRequest();
            }

            var ticketexistente = await _context.Ticket.FindAsync(id);

            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //corroborar si algunos de los campos(titulo, descripcion, prioridad o categoria) modifico su valor.
            //guardar el valor viejo

            var historial = new List<HistorialTicket>();

            try
            {

                if (ticketexistente.Titulo != ticket.Titulo)
                {
                    historial.Add(new HistorialTicket
                    {
                        TicketID = ticket.TicketID,
                        CampoModificado = "Titulo",
                        ValorAnterior = ticketexistente.Titulo,
                        ValorNuevo = ticket.Titulo,
                        FechaCambio = DateTime.Now
                    });
                }
                if (ticketexistente.Prioridades != ticket.Prioridades)
                {
                    historial.Add(new HistorialTicket
                    {
                        TicketID = ticket.TicketID,
                        CampoModificado = "Prioridad",
                        ValorAnterior = ticketexistente.Prioridades.ToString(),
                        ValorNuevo = ticket.Prioridades.ToString(),
                        FechaCambio = DateTime.Now
                    });
                }
                if (ticketexistente.Descripcion != ticket.Descripcion)
                {
                    historial.Add(new HistorialTicket
                    {
                        TicketID = ticket.TicketID,
                        CampoModificado = "Descripcion",
                        ValorAnterior = ticketexistente.Descripcion,
                        ValorNuevo = ticket.Descripcion,
                        FechaCambio = DateTime.Now
                    });
                }
                if (ticketexistente.CategoriaID != ticket.CategoriaID)
                {
                    historial.Add(new HistorialTicket
                    {
                        TicketID = ticket.TicketID,
                        CampoModificado = "Categoria",
                        ValorAnterior = ticketexistente.CategoriaID.ToString(),
                        ValorNuevo = ticket.CategoriaID.ToString(),
                        FechaCambio = DateTime.Now
                    });
                }
                if (ticketexistente.UsuarioClienteID != ticket.UsuarioClienteID)
                {
                    historial.Add(new HistorialTicket
                    {
                        TicketID = ticket.TicketID,
                        CampoModificado = "Usuario",
                        ValorAnterior = ticketexistente.UsuarioClienteID,
                        ValorNuevo = userId,
                        FechaCambio = DateTime.Now
                    });
                }

                if (historial.Any())
                {
                    _context.HistorialTicket.AddRange(historial);
                    await _context.SaveChangesAsync();
                }

                if (ticketexistente != null)
                {
                    ticketexistente.Titulo = ticket.Titulo;
                    ticketexistente.Prioridades = ticket.Prioridades;
                    ticketexistente.Descripcion = ticket.Descripcion;
                    ticketexistente.CategoriaID = ticket.CategoriaID;
                    ticket.UsuarioClienteID = userId;

                    await _context.SaveChangesAsync();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // POST: api/Tickets
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "ADMINISTRADOR, CLIENTE")]
        [HttpPost]
        public async Task<ActionResult<Ticket>> PostTicket(Ticket ticket)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            ticket.FechaCreacion = DateTime.Now;
            ticket.FechaCierre = Convert.ToDateTime("01/01/2025");
            ticket.UsuarioClienteID = userId;
            ticket.Estados = Estado.Abierto;

            _context.Ticket.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTicket", new { id = ticket.TicketID }, ticket);
        }

        // DELETE: api/Tickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Ticket.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }
            if (ticket.Estados != Estado.Abierto)
            {
                return BadRequest("No se puede eliminar un Ticket que esta en proceso o ya ha sido contestado.");
            }

            _context.Ticket.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TicketExists(int id)
        {
            return _context.Ticket.Any(e => e.TicketID == id);
        }
    }
}
