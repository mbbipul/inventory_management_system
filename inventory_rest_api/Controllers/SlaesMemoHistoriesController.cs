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
    public class SlaesMemoHistoriesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public SlaesMemoHistoriesController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/SlaesMemoHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesMemoHistory>>> GetSalesMemoHistories()
        {
            return await _context.SalesMemoHistories.ToListAsync();
        }

        // GET: api/SlaesMemoHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesMemoHistory>> GetSalesMemoHistory(long id)
        {
            var salesMemoHistory = await _context.SalesMemoHistories.FindAsync(id);

            if (salesMemoHistory == null)
            {
                return NotFound();
            }

            return salesMemoHistory;
        }

        // PUT: api/SlaesMemoHistories/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSalesMemoHistory(long id, SalesMemoHistory salesMemoHistory)
        {
            if (id != salesMemoHistory.Id)
            {
                return BadRequest();
            }

            _context.Entry(salesMemoHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesMemoHistoryExists(id))
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

        // POST: api/SlaesMemoHistories
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        
        [HttpPost]
        public async Task<ActionResult<SalesMemoHistory>> PostSalesMemoHistory(SalesMemoHistory salesMemoHistory)
        {
            _context.SalesMemoHistories.Add(salesMemoHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSalesMemoHistory", new { id = salesMemoHistory.Id }, salesMemoHistory);
        }

        // DELETE: api/SlaesMemoHistories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SalesMemoHistory>> DeleteSalesMemoHistory(long id)
        {
            var salesMemoHistory = await _context.SalesMemoHistories.FindAsync(id);
            if (salesMemoHistory == null)
            {
                return NotFound();
            }

            _context.SalesMemoHistories.Remove(salesMemoHistory);
            await _context.SaveChangesAsync();

            return salesMemoHistory;
        }

        private bool SalesMemoHistoryExists(long id)
        {
            return _context.SalesMemoHistories.Any(e => e.Id == id);
        }
    }
}
