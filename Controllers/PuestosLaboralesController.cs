using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoGestionTicket.Models.General;

namespace ProyectoGestionTicket.Controllers
{
    [Authorize(Roles = "ADMINISTRADOR")]
    [Route("api/[controller]")]
    [ApiController]
    public class PuestosLaboralesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PuestosLaboralesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PuestosLaborales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PuestoLaboral>>> GetPuestoLaboral()
        {
            return await _context.PuestoLaboral.OrderBy(p => p.Nombre).ToListAsync();
        }

        // GET: api/PuestosLaborales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PuestoLaboral>> GetPuestoLaboral(int id)
        {
            var puestoLaboral = await _context.PuestoLaboral.FindAsync(id);

            if (puestoLaboral == null)
            {
                return NotFound();
            }

            return puestoLaboral;
        }

        // PUT: api/PuestosLaborales/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPuestoLaboral(int id, PuestoLaboral puestoLaboral)
        {
            if (await _context.PuestoLaboral.AnyAsync(p => p.Nombre.ToLower() == puestoLaboral.Nombre.ToLower() && p.PuestoID != id))
            {
                return BadRequest($"El Puesto: '{puestoLaboral.Nombre}' ya existe.");
            }

            if (id != puestoLaboral.PuestoID)
            {
                return BadRequest();
            }

            _context.Entry(puestoLaboral).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PuestoLaboralExists(id))
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

        // POST: api/PuestosLaborales
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PuestoLaboral>> PostPuestoLaboral(PuestoLaboral puestoLaboral)
        {
            if (await _context.PuestoLaboral.AnyAsync(p => p.Nombre.ToLower() == puestoLaboral.Nombre.ToLower()))
            {
                return BadRequest($"El Puesto: '{puestoLaboral.Nombre}' ya existe.");
            }
            _context.PuestoLaboral.Add(puestoLaboral);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPuestoLaboral", new { id = puestoLaboral.PuestoID }, puestoLaboral);
        }

        // DELETE: api/PuestosLaborales/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePuestoLaboral(int id)
        {
            var puestoLaboral = await _context.PuestoLaboral.FindAsync(id);
            if (puestoLaboral == null)
            {
                return NotFound();
            }

            //_context.PuestoLaboral.Remove(puestoLaboral);
            if (puestoLaboral.Eliminado)
            {
                puestoLaboral.Eliminado = false;
            }
            else
            {
                puestoLaboral.Eliminado = true;
            }

            _context.PuestoLaboral.Update(puestoLaboral);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PuestoLaboralExists(int id)
        {
            return _context.PuestoLaboral.Any(e => e.PuestoID == id);
        }
    }
}
