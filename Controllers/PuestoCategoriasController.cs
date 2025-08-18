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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PuestoCategoriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PuestoCategoriasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PuestoCategorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PuestoCategoria>>> GetPuestoCategoria()
        {
            return await _context.PuestoCategoria.ToListAsync();
        }

        // GET: api/PuestoCategorias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PuestoCategoria>> GetPuestoCategoria(int id)
        {
            var puestoCategoria = await _context.PuestoCategoria.FindAsync(id);

            if (puestoCategoria == null)
            {
                return NotFound();
            }

            return puestoCategoria;
        }

        //para mostrar relaciones
        [HttpGet("por-puesto/{id}")]
        public async Task<IActionResult> GetPorPuesto(int id)
        {
            var relaciones = await _context.PuestoCategoria
                .Where(pc => pc.PuestoLaboralID == id)
                .Include(pc => pc.PuestoLaboral)
                .Include(pc => pc.Categoria)
                .Select(pc => new
                {
                    Id = pc.PuestoCategoriaID,
                    Puesto = pc.PuestoLaboral.Nombre,
                    Categoria = pc.Categoria.Nombre
                })
                .ToListAsync();

            return Ok(relaciones);
        }

        // PUT: api/PuestoCategorias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPuestoCategoria(int id, PuestoCategoria puestoCategoria)
        {
            if (id != puestoCategoria.PuestoCategoriaID)
            {
                return BadRequest();
            }

            _context.Entry(puestoCategoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PuestoCategoriaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/PuestoCategorias
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PuestoCategoria>> PostPuestoCategoria(PuestoCategoria puestoCategoria)
        {
            bool existeRelacion = await _context.PuestoCategoria
                .AnyAsync(pc => pc.PuestoLaboralID == puestoCategoria.PuestoLaboralID && pc.CategoriaID == puestoCategoria.CategoriaID);

            if (existeRelacion)
            {
                return BadRequest("La relacion que intenta agregar ya existe.");
            }

            _context.PuestoCategoria.Add(puestoCategoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPuestoCategoria", new { id = puestoCategoria.PuestoCategoriaID }, puestoCategoria);
        }

        // DELETE: api/PuestoCategorias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePuestoCategoria(int id)
        {
            var puestoCategoria = await _context.PuestoCategoria.FindAsync(id);
            if (puestoCategoria == null)
            {
                return NotFound();
            }

            _context.PuestoCategoria.Remove(puestoCategoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PuestoCategoriaExists(int id)
        {
            return _context.PuestoCategoria.Any(e => e.PuestoCategoriaID == id);
        }
    }
}
