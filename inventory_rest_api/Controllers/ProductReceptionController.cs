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
    public class ProductReceptionController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public ProductReceptionController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductReception
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseHistory>>> GetPurchaseHistories()
        {
            return await _context.PurchaseHistories.ToListAsync();
        }

        [HttpGet("regarding-purchaseId")]
        public ActionResult<Object> GetProductReceptionByPurId()
        {
            var query = from ph in _context.PurchaseHistories 
                        join p in _context.Purchases
                            on ph.PurchaseId equals p.PurchaseId
                        join s in _context.Suppliers 
                            on p.SupplierId equals s.SupplierId
                        select new { 
                            ph.PurchaseHistoryId,
                            p.PurchaseId,
                            p.Product.ProductName,
                            TotalProQuan = p.ProductQuantity,
                            ph.ProductQuantity,
                            ph.ReceptionDate,
                            s.SupplierName,
                            s.Company.CompanyName
                        } ;
            return query.AsEnumerable().GroupBy(
                ph => ph.PurchaseId ,
                (key,g) => new {
                    Key = key,
                    Headers = new List<string> {
                        key.ToString(),
                        g.First().ProductName,
                        g.First().TotalProQuan.ToString(),
                        g.Sum(ph => ph.ProductQuantity).ToString(),
                    },
                    Data = g.ToList()
                }
            ).ToList();
        }
        // GET: api/ProductReception/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseHistory>> GetPurchaseHistory(long id)
        {
            var purchaseHistory = await _context.PurchaseHistories.FindAsync(id);

            if (purchaseHistory == null)
            {
                return NotFound();
            }

            return purchaseHistory;
        }

        // PUT: api/ProductReception/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPurchaseHistory(long id, PurchaseHistory purchaseHistory)
        {
            if (id != purchaseHistory.PurchaseHistoryId)
            {
                return BadRequest();
            }

            _context.Entry(purchaseHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PurchaseHistoryExists(id))
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

        // POST: api/ProductReception
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<PurchaseHistory>> PostPurchaseHistory(PurchaseHistory purchaseHistory)
        {
            _context.PurchaseHistories.Add(purchaseHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPurchaseHistory", new { id = purchaseHistory.PurchaseHistoryId }, purchaseHistory);
        }

        // DELETE: api/ProductReception/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PurchaseHistory>> DeletePurchaseHistory(long id)
        {
            var purchaseHistory = await _context.PurchaseHistories.FindAsync(id);
            if (purchaseHistory == null)
            {
                return NotFound();
            }

            _context.PurchaseHistories.Remove(purchaseHistory);
            await _context.SaveChangesAsync();

            return purchaseHistory;
        }

        private bool PurchaseHistoryExists(long id)
        {
            return _context.PurchaseHistories.Any(e => e.PurchaseHistoryId == id);
        }
    }
}
