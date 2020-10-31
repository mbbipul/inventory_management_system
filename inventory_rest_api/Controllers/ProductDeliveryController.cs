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
    public class ProductDeliveryController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public ProductDeliveryController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductDelivery
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesHistory>>> GetSalesHistories()
        {
            return await _context.SalesHistories.ToListAsync();
        }

        [HttpGet("regarding-salesId")]
        public ActionResult<Object> GetProductReceptionByPurId()
        {
            var query = from sh in _context.SalesHistories 
                        join s in _context.Sales
                            on sh.SalesId equals s.SalesId
                        join c in _context.Customers 
                            on s.CustomerId equals c.CustomerId
                        select new { 
                            sh.SalesHistoryId,
                            s.SalesId,
                            s.Product.ProductName,
                            TotalProQuan = s.ProductQuantity,
                            sh.ProductQuantity,
                            sh.DeliveryDate,
                            c.CustomerName,
                        } ;
            return query.AsEnumerable().GroupBy(
                sh => sh.SalesId ,
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
        // GET: api/ProductDelivery/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesHistory>> GetSalesHistory(long id)
        {
            var salesHistory = await _context.SalesHistories.FindAsync(id);

            if (salesHistory == null)
            {
                return NotFound();
            }

            return salesHistory;
        }

        // PUT: api/ProductDelivery/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSalesHistory(long id, SalesHistory salesHistory)
        {
            if (id != salesHistory.SalesHistoryId)
            {
                return BadRequest();
            }

            _context.Entry(salesHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesHistoryExists(id))
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

        // POST: api/ProductDelivery
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<SalesHistory>> PostSalesHistory(SalesHistory salesHistory)
        {
            _context.SalesHistories.Add(salesHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSalesHistory", new { id = salesHistory.SalesHistoryId }, salesHistory);
        }

        // DELETE: api/ProductDelivery/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SalesHistory>> DeleteSalesHistory(long id)
        {
            var salesHistory = await _context.SalesHistories.FindAsync(id);
            if (salesHistory == null)
            {
                return NotFound();
            }

            _context.SalesHistories.Remove(salesHistory);
            await _context.SaveChangesAsync();

            return salesHistory;
        }

        private bool SalesHistoryExists(long id)
        {
            return _context.SalesHistories.Any(e => e.SalesHistoryId == id);
        }
    }
}
