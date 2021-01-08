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
    public class OrderPaymentsController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public OrderPaymentsController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderPayments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderPayment>>> GetOrderPayments()
        {
            return await _context.OrderPayments.ToListAsync();
        }

        [HttpGet("regarding-customer")]
        public ActionResult<Object> GetSalesOrdersRegardCustomer()
        {
            var query = from opay in _context.OrderPayments 
                        join s in _context.OrderSales
                            on opay.OrderSalesId equals s.OrderSalesId
                        join c in _context.Employees 
                            on s.EmployeeId equals c.EmployeeId
                        select new { 
                            opay.OrderPaymentId,
                            s.OrderTotalPrice,
                            s.OrderSalesId,
                            opay.PaymentOrderSalesDate,
                            opay.PaymentAmount,
                            c.EmployeeName,
                        } ;
            return query.AsEnumerable().GroupBy(
                ps => ps.EmployeeName ,
                (key,g) => new {
                    Key = key,
                    Headers = new List<string> {
                        key,
                        g.Count().ToString(),
                        g.GroupBy(ps => ps.OrderSalesId).Select(g => g.First()).Sum(ps => ps.OrderTotalPrice).ToString(),
                        g.Sum(ps => ps.PaymentAmount).ToString(),
                    },
                    Data = g.ToList()
                }
            ).ToList();
        }

        // GET: api/OrderPayments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderPayment>> GetOrderPayment(long id)
        {
            var orderPayment = await _context.OrderPayments.FindAsync(id);

            if (orderPayment == null)
            {
                return NotFound();
            }

            return orderPayment;
        }

        // PUT: api/OrderPayments/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderPayment(long id, OrderPayment orderPayment)
        {
            if (id != orderPayment.OrderPaymentId)
            {
                return BadRequest();
            }

            _context.Entry(orderPayment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderPaymentExists(id))
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

        // POST: api/OrderPayments
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<OrderPayment>> PostOrderPayment(OrderPayment orderPayment)
        {
            _context.OrderPayments.Add(orderPayment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrderPayment", new { id = orderPayment.OrderPaymentId }, orderPayment);
        }

        // DELETE: api/OrderPayments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<OrderPayment>> DeleteOrderPayment(long id)
        {
            var orderPayment = await _context.OrderPayments.FindAsync(id);
            if (orderPayment == null)
            {
                return NotFound();
            }

            _context.OrderPayments.Remove(orderPayment);
            await _context.SaveChangesAsync();

            return orderPayment;
        }

        private bool OrderPaymentExists(long id)
        {
            return _context.OrderPayments.Any(e => e.OrderPaymentId == id);
        }
    }
}
