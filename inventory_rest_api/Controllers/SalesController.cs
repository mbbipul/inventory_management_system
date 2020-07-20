using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory_rest_api.Models;
using System.Collections;

namespace inventory_rest_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public SalesController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/Sales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sales>>> GetSales()
        {
            return await _context.Sales
                            .OrderBy( sales => sales.SalesDate)
                            .ToListAsync();
        }

        // GET: api/Sales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sales>> GetSales(long id)
        {
            var sales = await _context.Sales.FindAsync(id);

            if (sales == null)
            {
                return NotFound();
            }

            return sales;
        }

        [HttpGet("sales-product-customer")]
        public async Task<ActionResult<IEnumerable>> GetSalesProductCustomers(){
            var query = from sales in _context.Sales
                        join product in _context.Products
                            on sales.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        select new {
                                sales.SalesId,
                                sales.CustomerId,
                                sales.ProductQuantity,
                                sales.SalesDate,
                                sales.SalesPrice,
                                sales.SalesPaymentAmount,
                                sales.SalesDueAmount,
                                sales.SalesPaidStatus,
                                sales.SalesDuePaymentDate,
                                sales.SalesDiscount,
                                product.ProductId,
                                product.ProductName,
                                product.ProductCode,
                                product.ProductCategoryId,
                                product.TotalProducts,
                                product.TotalProductInStock,
                                product.ProductPrice,
                                product.SalestPrice,
                                product.ProductDetails,
                                customer.CustomerName,
                                customer.CustomerEmail,
                                customer.CustomerContact,
                                customer.CustomerAddress,
                                customer.CustomerJoinDate,
                                customer.CustomerNID
                            };
            return await query.ToListAsync();

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSales(long id, Sales sales)
        {
            if (id != sales.SalesId)
            {
                return BadRequest();
            }

            _context.Entry(sales).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesExists(id))
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

        [HttpPost]
        public async Task<ActionResult<Sales>> PostSales(Sales sales)
        {
            _context.Sales.Add(sales);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSales", new { id = sales.SalesId }, sales);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult<Sales>> DeleteSales(long id)
        {
            var sales = await _context.Sales.FindAsync(id);
            if (sales == null)
            {
                return NotFound();
            }

            _context.Sales.Remove(sales);
            await _context.SaveChangesAsync();

            return sales;
        }

        private bool SalesExists(long id)
        {
            return _context.Sales.Any(e => e.SalesId == id);
        }
    }
}
