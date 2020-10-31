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
    public class PaymentsalesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public PaymentsalesController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/Paymentsales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentSales>>> GetPaymentSales()
        {
            return await _context.PaymentSales.ToListAsync();
        }

        [HttpGet("regarding-customer")]
        public ActionResult<Object> GetSalesPurchasesRegardCustomer()
        {
            var query = from ps in _context.PaymentSales 
                        join s in _context.Sales
                            on ps.SalesId equals s.SalesId
                        join c in _context.Customers 
                            on s.CustomerId equals c.CustomerId
                        select new { 
                            ps.PaymentSalesId,
                            s.Product.ProductName,
                            s.SalesPrice,
                            s.SalesId,
                            ps.PaymentSalesDate,
                            ps.PaymentAmount,
                            c.CustomerName,
                        } ;
            return query.AsEnumerable().GroupBy(
                ps => ps.CustomerName ,
                (key,g) => new {
                    Key = key,
                    Headers = new List<string> {
                        key,
                        g.Count().ToString(),
                        g.GroupBy(ps => ps.SalesId).Select(g => g.First()).Sum(ps => ps.SalesPrice).ToString(),
                        g.Sum(ps => ps.PaymentAmount).ToString(),
                    },
                    Data = g.ToList()
                }
            ).ToList();
        }
        // GET: api/Paymentsales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentSales>> GetPaymentSales(long id)
        {
            var paymentSales = await _context.PaymentSales.FindAsync(id);

            if (paymentSales == null)
            {
                return NotFound();
            }

            return paymentSales;
        }

        // PUT: api/Paymentsales/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymentSales(long id, PaymentSales paymentSales)
        {
            if (id != paymentSales.PaymentSalesId)
            {
                return BadRequest();
            }

            _context.Entry(paymentSales).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentSalesExists(id))
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

        // POST: api/Paymentsales
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<PaymentSales>> PostPaymentSales(PaymentSales paymentSales)
        {
            _context.PaymentSales.Add(paymentSales);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymentSales", new { id = paymentSales.PaymentSalesId }, paymentSales);
        }

        // DELETE: api/Paymentsales/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PaymentSales>> DeletePaymentSales(long id)
        {
            var paymentSales = await _context.PaymentSales.FindAsync(id);
            if (paymentSales == null)
            {
                return NotFound();
            }

            _context.PaymentSales.Remove(paymentSales);
            await _context.SaveChangesAsync();

            return paymentSales;
        }

        private bool PaymentSalesExists(long id)
        {
            return _context.PaymentSales.Any(e => e.PaymentSalesId == id);
        }
    }
}
