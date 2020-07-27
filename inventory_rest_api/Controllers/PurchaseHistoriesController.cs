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
    public class PurchaseHistoriesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public PurchaseHistoriesController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/PurchaseHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductPurchaseHistory>>> GetProductPurchaseHistory()
        {
            return await _context.ProductPurchaseHistories.ToListAsync();
        }

        // GET: api/PurchaseHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductPurchaseHistory>> GetProductPurchaseHistory(long id)
        {
            var productPurchaseHistory = await _context.ProductPurchaseHistories.FindAsync(id);

            if (productPurchaseHistory == null)
            {
                return NotFound();
            }

            return productPurchaseHistory;
        }

        [HttpGet("product/{id}")]
        public async Task<ActionResult<IEnumerable<ProductPurchaseHistory>>> GetPurchaseHistoryByProduct(long id)
        {
            var productPurchaseHistory = await _context.ProductPurchaseHistories
                                                    .Where( phr => phr.ProductId == id).ToListAsync();

            if (productPurchaseHistory.Count() <= 0)
            {
                return NotFound();
            }

            return productPurchaseHistory;
        }
        // PUT: api/PurchaseHistories/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductPurchaseHistory(long id, ProductPurchaseHistory productPurchaseHistory)
        {
            if (id != productPurchaseHistory.ProductPurchaseHistoryId)
            {
                return BadRequest();
            }

            _context.Entry(productPurchaseHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductPurchaseHistoryExists(id))
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

        // POST: api/PurchaseHistories
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ProductPurchaseHistory>> PostProductPurchaseHistory(ProductPurchaseHistory productPurchaseHistory)
        {
            _context.ProductPurchaseHistories.Add(productPurchaseHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductPurchaseHistory", new { id = productPurchaseHistory.ProductPurchaseHistoryId }, productPurchaseHistory);
        }

        // DELETE: api/PurchaseHistories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ProductPurchaseHistory>> DeleteProductPurchaseHistory(long id)
        {
            var productPurchaseHistory = await _context.ProductPurchaseHistories.FindAsync(id);
            if (productPurchaseHistory == null)
            {
                return NotFound();
            }

            _context.ProductPurchaseHistories.Remove(productPurchaseHistory);
            await _context.SaveChangesAsync();

            return productPurchaseHistory;
        }

        private bool ProductPurchaseHistoryExists(long id)
        {
            return _context.ProductPurchaseHistories.Any(e => e.ProductPurchaseHistoryId == id);
        }
    }
}
