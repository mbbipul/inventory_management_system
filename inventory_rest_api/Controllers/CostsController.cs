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
    public class CostsController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public CostsController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/Costs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cost>>> GetCosts()
        {
            return await _context.Costs.ToListAsync();
        }

        // GET: api/Costs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cost>> GetCosts(long id)
        {
            var costs = await _context.Costs.FindAsync(id);

            if (costs == null)
            {
                return NotFound();
            }

            return costs;
        }

        // PUT: api/Costs/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCosts(long id, Cost costs)
        {
            if (id != costs.CostId)
            {
                return BadRequest();
            }

            _context.Entry(costs).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CostsExists(id))
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

        // POST: api/Costs
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Cost>> PostCosts(Cost costs)
        {
            _context.Costs.Add(costs);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCosts", new { id = costs.CostId }, costs);
        }

        // DELETE: api/Costs/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Cost>> DeleteCosts(long id)
        {
            var costs = await _context.Costs.FindAsync(id);
            if (costs == null)
            {
                return NotFound();
            }

            _context.Costs.Remove(costs);
            await _context.SaveChangesAsync();

            return costs;
        }

        [HttpDelete("delete-multiple")] 
        public async Task<ActionResult<string>> DeleteMultiplePurchases(List<Cost> cost) {
            _context.Costs.RemoveRange(cost);
            await _context.SaveChangesAsync();
            return "successfully deleted " + cost.Count() + " Cost";
        }

        private bool CostsExists(long id)
        {
            return _context.Costs.Any(e => e.CostId == id);
        }
    }
}
