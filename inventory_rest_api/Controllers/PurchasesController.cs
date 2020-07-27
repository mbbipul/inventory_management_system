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
    public class PurchasesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public PurchasesController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/Purchase
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Purchase>>> GetPurchases()
        {
            return await _context.Purchases
                            .OrderBy( purchase => purchase.PurchaseDate)
                            .ToListAsync();
        }

        // GET: api/Purchase/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Purchase>> GetPurchase(long id)
        {
            var purchases = await _context.Purchases.FindAsync(id);

            if (purchases == null)
            {
                return NotFound();
            }

            return purchases;
        }

        // [HttpGet("by-productId/{productId}")]
        // public async Task<ActionResult<IEnumerable<Purchase>>> GetPurchasesByProductId(long productId){
        //     var purchases = await _context.Purchases
        //                                 .Where(p => p.ProductId == productId)
        //                                 .OrderBy(p => p.PurchaseDate)
        //                                 .ToListAsync();

        //     return purchases;
        // }

        // PUT: api/Purchase/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPurchases(long id, Purchase purchase)
        {
            if (id != purchase.PurchaseId)
            {
                return BadRequest();
            }

            _context.Entry(purchase).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PurchasesExists(id))
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

        // POST: api/Purchase
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Purchase>> PostPurchases(Purchase purchase)
        {
            _context.Purchases.Add(purchase);

            ProductPurchaseHistory productPurchaseHistory = new ProductPurchaseHistory {
                ProductId = purchase.ProductId,
                ProductQuantity = purchase.ProductQuantity,
                PerProductPurchasePrice = purchase.PurchasePrice / purchase.ProductQuantity,
                PerProductSalesPrice = purchase.SalesPrice,
                Date = DateTime.Now.ToUniversalTime().ToString()
            };

            var pHis = _context.ProductPurchaseHistories
                            .Any( pph => pph.ProductId == productPurchaseHistory.ProductId && pph.PerProductPurchasePrice == productPurchaseHistory.PerProductPurchasePrice);
            if(pHis){
                ProductPurchaseHistory purHistory = await _context.ProductPurchaseHistories
                            .FirstAsync( pph => pph.ProductId == productPurchaseHistory.ProductId && pph.PerProductPurchasePrice == productPurchaseHistory.PerProductPurchasePrice);
                
                purHistory.ProductQuantity += productPurchaseHistory.ProductQuantity;

                purHistory.PerProductSalesPrice = 
                    purHistory.PerProductSalesPrice < productPurchaseHistory.PerProductSalesPrice ? productPurchaseHistory.PerProductSalesPrice :  purHistory.PerProductSalesPrice;

                _context.ProductPurchaseHistories.Update(purHistory);
            }else{
                _context.ProductPurchaseHistories.Add(productPurchaseHistory);
            }

            await _context.SaveChangesAsync();
            
            return CreatedAtAction("GetPurchase", new { id = purchase.PurchaseId }, purchase);
        }

        // DELETE: api/Purchase/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Purchase>> DeletePurchases(long id)
        {
            var purchase = await _context.Purchases.FindAsync(id);
            if (purchase == null)
            {
                return NotFound();
            }

            _context.Purchases.Remove(purchase);
            await _context.SaveChangesAsync();

            return purchase;
        }

        private bool PurchasesExists(long id)
        {
            return _context.Purchases.Any(e => e.PurchaseId == id);
        }
    }
}
