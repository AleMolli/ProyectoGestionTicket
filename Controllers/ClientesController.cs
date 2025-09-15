using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoGestionTicket.Models.General;

namespace ProyectoGestionTicket.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ClientesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetCliente()
        {
            var usuarioLogueadoID = HttpContext.User.Identity.Name;
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var rol = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            return await _context.Cliente.OrderBy(c => c.Nombre).ToListAsync();
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Cliente.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }

        // PUT: api/Clientes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (await _context.Cliente.AnyAsync(c => c.Dni == cliente.Dni && c.ClienteID != id))
            {
                return BadRequest($"El Cliente con DNI: '{cliente.Dni}' ya existe.");
            }

            if (id != cliente.ClienteID)
            {
                return BadRequest();
            }
            
            var clienteemail = await _context.Cliente.FindAsync(id);

            try
            {
                if (clienteemail != null)
                {
                    clienteemail.Nombre = cliente.Nombre;
                    clienteemail.Dni = cliente.Dni;
                    clienteemail.Telefono = cliente.Telefono;
                    clienteemail.Observaciones = cliente.Observaciones;
                }
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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

        // POST: api/Clientes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            if (!String.IsNullOrEmpty(cliente.Nombre) && !String.IsNullOrEmpty(cliente.Dni.ToString()) && !String.IsNullOrEmpty(cliente.Email))
            {
                if (await _context.Cliente.AnyAsync(c => c.Dni == cliente.Dni))
                {
                    return BadRequest($"El Cliente con DNI: '{cliente.Dni}' ya existe.");
                }
                if (await _context.Cliente.AnyAsync(c => c.Email == cliente.Email))
                {
                    return BadRequest($"El Cliente con DNI: '{cliente.Email}' ya existe.");
                }

                _context.Cliente.Add(cliente);
                await _context.SaveChangesAsync();

                var newuser = new ApplicationUser
                {
                    UserName = cliente.Email,
                    Email = cliente.Email,
                    NombreCompleto = cliente.Nombre
                };
                var result = await _userManager.CreateAsync(newuser, "Ezpeleta2025!");

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newuser, "CLIENTE");
                    return Ok(new { Mensaje = "Usuario Registrado", result.Errors });
                }
            }

            return CreatedAtAction("GetCliente", new { id = cliente.ClienteID }, cliente);
        }

        // DELETE: api/Clientes/5
        [Authorize(Roles = "ADMINISTRADOR")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Cliente.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            if (cliente.Eliminado)
            {
                cliente.Eliminado = false;
            }
            else
            {
                cliente.Eliminado = true;
            }

            _context.Cliente.Update(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Cliente.Any(e => e.ClienteID == id);
        }
    }
}
