using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory_rest_api.Models;

namespace inventory_rest_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DamageReceptionHistoriesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public DamageReceptionHistoriesController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/DamageReceptionHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DamageReceptionHistory>>> GetDamageReceptionHistories()
        {
            return await _context.DamageReceptionHistories.ToListAsync();
        }

        // GET: api/DamageReceptionHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DamageReceptionHistory>> GetDamageReceptionHistory(long id)
        {
            var damageReceptionHistory = await _context.DamageReceptionHistories.FindAsync(id);

            if (damageReceptionHistory == null)
            {
                return NotFound();
            }

            return damageReceptionHistory;
        }

        // PUT: api/DamageReceptionHistories/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDamageReceptionHistory(long id, DamageReceptionHistory damageReceptionHistory)
        {
            if (id != damageReceptionHistory.DamageReceptionHistoryId)
            {
                return BadRequest();
            }

            _context.Entry(damageReceptionHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DamageReceptionHistoryExists(id))
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

        // POST: api/DamageReceptionHistories
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<DamageReceptionHistory>> PostDamageReceptionHistory(DamageReceptionHistory damageReceptionHistory)
        {
            _context.DamageReceptionHistories.Add(damageReceptionHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDamageReceptionHistory", new { id = damageReceptionHistory.DamageReceptionHistoryId }, damageReceptionHistory);
        }

        // DELETE: api/DamageReceptionHistories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DamageReceptionHistory>> DeleteDamageReceptionHistory(long id)
        {
            var damageReceptionHistory = await _context.DamageReceptionHistories.FindAsync(id);
            if (damageReceptionHistory == null)
            {
                return NotFound();
            }

            _context.DamageReceptionHistories.Remove(damageReceptionHistory);
            await _context.SaveChangesAsync();

            return damageReceptionHistory;
        }

        private bool DamageReceptionHistoryExists(long id)
        {
            return _context.DamageReceptionHistories.Any(e => e.DamageReceptionHistoryId == id);
        }
    }
}
