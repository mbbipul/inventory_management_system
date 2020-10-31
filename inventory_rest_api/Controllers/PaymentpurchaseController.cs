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
    public class PaymentpurchaseController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public PaymentpurchaseController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/Paymentpurchase
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentPurchase>>> GetPaymentPurchases()
        {
            return await _context.PaymentPurchases.ToListAsync();
        }

        [HttpGet("regarding-supplier")]
        public ActionResult<Object> GetPaymentPurchasesRegardSupplier()
        {
            var query = from pp in _context.PaymentPurchases 
                        from p in _context.Purchases
                        join s in _context.Suppliers 
                            on p.SupplierId equals s.SupplierId
                        select new { 
                            pp.PaymentPurchaseId,
                            p.Product.ProductName,
                            pp.PaymentPurchaseDate,
                            pp.PaymentAmount,
                            s.SupplierName,
                            s.Company.CompanyName
                        } ;
            return query.AsEnumerable().GroupBy(
                pp => pp.SupplierName ,
                (key,g) => new {
                    Key = key,
                    Headers = new List<string> {
                        key,
                        g.Count().ToString(),
                        g.Sum(pp => pp.PaymentAmount).ToString(),
                    },
                    Data = g.ToList()
                }
            ).ToList();
        }

        // GET: api/Paymentpurchase/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentPurchase>> GetPaymentPurchase(long id)
        {
            var paymentPurchase = await _context.PaymentPurchases.FindAsync(id);

            if (paymentPurchase == null)
            {
                return NotFound();
            }

            return paymentPurchase;
        }

        // PUT: api/Paymentpurchase/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymentPurchase(long id, PaymentPurchase paymentPurchase)
        {
            if (id != paymentPurchase.PaymentPurchaseId)
            {
                return BadRequest();
            }

            _context.Entry(paymentPurchase).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentPurchaseExists(id))
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

        // POST: api/Paymentpurchase
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<PaymentPurchase>> PostPaymentPurchase(PaymentPurchase paymentPurchase)
        {
            _context.PaymentPurchases.Add(paymentPurchase);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymentPurchase", new { id = paymentPurchase.PaymentPurchaseId }, paymentPurchase);
        }

        // DELETE: api/Paymentpurchase/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PaymentPurchase>> DeletePaymentPurchase(long id)
        {
            var paymentPurchase = await _context.PaymentPurchases.FindAsync(id);
            if (paymentPurchase == null)
            {
                return NotFound();
            }

            _context.PaymentPurchases.Remove(paymentPurchase);
            await _context.SaveChangesAsync();

            return paymentPurchase;
        }

        private bool PaymentPurchaseExists(long id)
        {
            return _context.PaymentPurchases.Any(e => e.PaymentPurchaseId == id);
        }
    }
}
