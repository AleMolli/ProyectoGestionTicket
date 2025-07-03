using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoGestionTicket.Models.General;

namespace ProyectoGestionTicket.Controllers
{
    [Authorize(Roles = "ADMINISTRADOR")]
    [Route("api/[controller]")]
    [ApiController]
    public class DesarrolladoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DesarrolladoresController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Desarrolladores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Desarrollador>>> GetDesarrollador()
        {
            var desarrollador = await _context.Desarrollador.Include(x => x.PuestoLaboral).ToListAsync();

            var usuarioLogueadoID = HttpContext.User.Identity.Name;
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;

            return desarrollador;
        }

        // GET: api/Desarrolladores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Desarrollador>> GetDesarrollador(int id)
        {
            var desarrollador = await _context.Desarrollador.FindAsync(id);

            if (desarrollador == null)
            {
                return NotFound();
            }

            return desarrollador;
        }

        // PUT: api/Desarrolladores/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDesarrollador(int id, Desarrollador desarrollador)
        {
            if (await _context.Desarrollador.AnyAsync(d => d.DNI == desarrollador.DNI && d.DesarrolladorID != id))
            {
                return BadRequest($"El Desarrollador con DNI: '{desarrollador.DNI}' ya existe.");
            }

            if (id != desarrollador.DesarrolladorID)
            {
                return BadRequest();
            }

            //_context.Entry(desarrollador).State = EntityState.Modified;

            var desarrolladoremail = await _context.Desarrollador.FindAsync(id);

            try
            {
                if (desarrolladoremail != null)
                {
                    desarrolladoremail.NombreCompleto = desarrollador.NombreCompleto;
                    desarrolladoremail.DNI = desarrollador.DNI;
                    desarrolladoremail.Telefono = desarrollador.Telefono;
                    desarrolladoremail.PuestoLaboralID = desarrollador.PuestoLaboralID;
                    desarrolladoremail.Observaciones = desarrollador.Observaciones;
                }
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DesarrolladorExists(id))
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

        // POST: api/Desarrolladores
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Desarrollador>> PostDesarrollador(Desarrollador desarrollador)
        {
            if (!String.IsNullOrEmpty(desarrollador.NombreCompleto) && !String.IsNullOrEmpty(desarrollador.DNI.ToString()) && !String.IsNullOrEmpty(desarrollador.Email))
            {
                if (await _context.Desarrollador.AnyAsync(d => d.DNI == desarrollador.DNI))
                {
                    return BadRequest($"El Desarrollador con DNI: '{desarrollador.DNI}' ya existe.");
                }
                if (await _context.Desarrollador.AnyAsync(d => d.Email == desarrollador.Email))
                {
                    return BadRequest($"El Desarrollador con DNI: '{desarrollador.Email}' ya existe.");
                }

                _context.Desarrollador.Add(desarrollador);
                await _context.SaveChangesAsync();

                var newduser = new ApplicationUser
                {
                    UserName = desarrollador.Email,
                    Email = desarrollador.Email,
                    NombreCompleto = desarrollador.NombreCompleto
                };
                var result = await _userManager.CreateAsync(newduser, "Ezpeleta2025!");

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newduser, "DESARROLLADOR");
                    return Ok(new { Mensaje = "Usuario Registrado", result.Errors });
                }
            }
            
            return CreatedAtAction("GetDesarrollador", new { id = desarrollador.DesarrolladorID }, desarrollador);
        }

        // DELETE: api/Desarrolladores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDesarrollador(int id)
        {
            var desarrollador = await _context.Desarrollador.FindAsync(id);
            if (desarrollador == null)
            {
                return NotFound();
            }

            _context.Desarrollador.Remove(desarrollador);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DesarrolladorExists(int id)
        {
            return _context.Desarrollador.Any(e => e.DesarrolladorID == id);
        }
    }
}
