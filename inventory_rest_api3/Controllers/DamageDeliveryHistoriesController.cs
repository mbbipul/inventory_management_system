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
    public class DamageDeliveryHistoriesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public DamageDeliveryHistoriesController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/DamageDeliveryHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DamageDeliveryHistory>>> GetDamageDeliveryHistories()
        {
            return await _context.DamageDeliveryHistories.ToListAsync();
        }

        // GET: api/DamageDeliveryHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DamageDeliveryHistory>> GetDamageDeliveryHistory(long id)
        {
            var damageDeliveryHistory = await _context.DamageDeliveryHistories.FindAsync(id);

            if (damageDeliveryHistory == null)
            {
                return NotFound();
            }

            return damageDeliveryHistory;
        }

        // PUT: api/DamageDeliveryHistories/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDamageDeliveryHistory(long id, DamageDeliveryHistory damageDeliveryHistory)
        {
            if (id != damageDeliveryHistory.DamageDeliveryHistoryId)
            {
                return BadRequest();
            }

            _context.Entry(damageDeliveryHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DamageDeliveryHistoryExists(id))
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

        // POST: api/DamageDeliveryHistories
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<DamageDeliveryHistory>> PostDamageDeliveryHistory(DamageDeliveryHistory damageDeliveryHistory)
        {
            _context.DamageDeliveryHistories.Add(damageDeliveryHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDamageDeliveryHistory", new { id = damageDeliveryHistory.DamageDeliveryHistoryId }, damageDeliveryHistory);
        }

        // DELETE: api/DamageDeliveryHistories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DamageDeliveryHistory>> DeleteDamageDeliveryHistory(long id)
        {
            var damageDeliveryHistory = await _context.DamageDeliveryHistories.FindAsync(id);
            if (damageDeliveryHistory == null)
            {
                return NotFound();
            }

            _context.DamageDeliveryHistories.Remove(damageDeliveryHistory);
            await _context.SaveChangesAsync();

            return damageDeliveryHistory;
        }

        private bool DamageDeliveryHistoryExists(long id)
        {
            return _context.DamageDeliveryHistories.Any(e => e.DamageDeliveryHistoryId == id);
        }
    }
}
