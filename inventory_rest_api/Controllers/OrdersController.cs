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
    public class OrdersController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public OrdersController(InventoryDbContext context)
        {
            _context = context;
        }

        [HttpGet("just-all")]
        public ActionResult<IEnumerable> GetAlls(){
            return _context.Orders.ToList();
        }
        [HttpGet("all-orders")]
        public ActionResult<IEnumerable> GetOrdersLl(){

            var query =from order in _context.Orders
                        join product in _context.Products
                            on order.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on order.CustomerId equals customer.CustomerId
                        where order.OrderStaus ==  "orderPlace"
                        select new {
                            order.OrderId,
                            order.SalesId,
                            order.ProductId,
                            order.CustomerId,
                            order.OrderProductQuantity,
                            order.OrderDate,
                            order.OrderStaus,
                            order.MiscellaneousCost,

                            ProductQuantity = 0,
                            SalesDate = "",
                            SalesDiscount = 0,
                            SalesDuePaymentDate = "",
                            SalesPaidStatus = "",
                            SalesPaymentAmount = 0,
                            SalesPrice = 0,

                            product.ProductName,
                            customer.CustomerName,

                        };
          
            return  query.AsEnumerable().ToList();
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable>> GetOrders()
        {
            var query =from order in _context.Orders
                        join sales in _context.Sales
                            on order.SalesId equals sales.SalesId
                        join product in _context.Products
                            on order.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on order.CustomerId equals customer.CustomerId
                        select new {
                            order.OrderId,
                            order.SalesId,
                            order.ProductId,
                            order.CustomerId,
                            order.OrderProductQuantity,
                            order.OrderDate,
                            order.OrderStaus,
                            order.MiscellaneousCost,

                            sales.ProductQuantity,
                            sales.SalesDate,
                            sales.SalesDiscount,
                            sales.SalesDuePaymentDate,
                            sales.SalesPaidStatus,
                            sales.SalesPaymentAmount,
                            sales.SalesPrice,

                            product.ProductName,
                            customer.CustomerName,

                        };

            return await query.ToListAsync();
        }

        [HttpGet("by-date-range/{date1}-{date2}")]
        public ActionResult<IEnumerable> GetOrdersByDateRange(string date1,string date2){
            
            double d1 = double.Parse(date1);
            double d2 = double.Parse(date2);

            var query = from order in _context.Orders
                        join sales in _context.Sales
                            on order.SalesId equals sales.SalesId
                        join product in _context.Products
                            on order.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on order.CustomerId equals customer.CustomerId
                        select new {
                            order.OrderId,
                            order.SalesId,
                            order.ProductId,
                            order.CustomerId,
                            order.OrderProductQuantity,
                            order.OrderDate,
                            order.OrderStaus,
                            order.MiscellaneousCost,

                            OrderDateLong = long.Parse(order.OrderDate),

                            sales.ProductQuantity,
                            sales.SalesDate,
                            sales.SalesDiscount,
                            sales.SalesDuePaymentDate,
                            sales.SalesPaidStatus,
                            sales.SalesPaymentAmount,
                            sales.SalesPrice,

                            product.ProductName,
                            customer.CustomerName,

                        };
                        
            return  query.AsEnumerable()
                        .Where( o => o.OrderDateLong >= d1 && o.OrderDateLong < d2 )
                        .ToList();
                                
        }

        [HttpGet("place-order-by-date-range/{date1}-{date2}")]
        public ActionResult<IEnumerable> GetPlaceOrdersByDateRange(string date1,string date2){
            
            double d1 = double.Parse(date1);
            double d2 = double.Parse(date2);

            var query = from order in _context.Orders
                       
                        join product in _context.Products
                            on order.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on order.CustomerId equals customer.CustomerId
                        where order.OrderStaus ==  "orderPlace"
                        select new {
                            order.OrderId,
                            order.SalesId,
                            order.ProductId,
                            order.CustomerId,
                            order.OrderProductQuantity,
                            order.OrderDate,
                            order.OrderStaus,
                            order.MiscellaneousCost,

                            OrderDateLong = long.Parse(order.OrderDate),

                            ProductQuantity = 0,
                            SalesDate = "",
                            SalesDiscount = 0,
                            SalesDuePaymentDate = "",
                            SalesPaidStatus = "",
                            SalesPaymentAmount = 0,
                            SalesPrice = 0,

                            product.ProductName,
                            customer.CustomerName,

                        };
                        
            return  query.AsEnumerable()
                        .Where( o => o.OrderDateLong >= d1 && o.OrderDateLong < d2 )
                        .ToList();
                                
        }

        [HttpGet("place-order-by-date/{date}")]
        public ActionResult<IEnumerable> GetPlaceOrdersByDate(string date){
    
            var query = from order in _context.Orders
                        join product in _context.Products
                            on order.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on order.CustomerId equals customer.CustomerId
                        where order.OrderStaus ==  "orderPlace"
                        select new {
                            order.OrderId,
                            order.SalesId,
                            order.ProductId,
                            order.CustomerId,
                            order.OrderProductQuantity,
                            order.OrderDate,
                            order.OrderStaus,
                            order.MiscellaneousCost,

                            ProductQuantity = 0,
                            SalesDate = "",
                            SalesDiscount = 0,
                            SalesDuePaymentDate = "",
                            SalesPaidStatus = "",
                            SalesPaymentAmount = 0,
                            SalesPrice = 0,

                            product.ProductName,
                            customer.CustomerName,

                        };

            return query.AsEnumerable()
                        .Where( o => AppUtils.DateTime(o.OrderDate).ToShortDateString() == AppUtils.DateTime(date).ToShortDateString())
                        .ToList();
        }

        [HttpGet("by-date/{date}")]
        public ActionResult<IEnumerable> GetOrdersByDate(string date){
    
            var query = from order in _context.Orders
                        join sales in _context.Sales
                            on order.SalesId equals sales.SalesId
                        join product in _context.Products
                            on order.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on order.CustomerId equals customer.CustomerId
                        select new {
                            order.OrderId,
                            order.SalesId,
                            order.ProductId,
                            order.CustomerId,
                            order.OrderProductQuantity,
                            order.OrderDate,
                            order.OrderStaus,
                            order.MiscellaneousCost,

                            sales.ProductQuantity,
                            sales.SalesDate,
                            sales.SalesDiscount,
                            sales.SalesDuePaymentDate,
                            sales.SalesPaidStatus,
                            sales.SalesPaymentAmount,
                            sales.SalesPrice,

                            product.ProductName,
                            customer.CustomerName,

                        };

            return query.AsEnumerable()
                        .Where( o => AppUtils.DateTime(o.OrderDate).ToShortDateString() == AppUtils.DateTime(date).ToShortDateString())
                        .ToList();
        }

        [HttpGet("place-orders-by-days/{days}")]
        public ActionResult<IEnumerable> GetPlaceOrdersByDays(int days){
            
            List<String> valDate = new List<string>();
            for (int i = 0; i < days; i++)
            {
                long milliseconds = DateTimeOffset.Now.ToUnixTimeMilliseconds();

                string dateTime =  AppUtils.DateTime(milliseconds-86400000*i ).ToShortDateString();
                valDate.Add(dateTime);
            }
            var query = from order in _context.Orders
                        join product in _context.Products
                            on order.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on order.CustomerId equals customer.CustomerId
                        where order.OrderStaus ==  "orderPlace"
                        select new {
                            order.OrderId,
                            order.SalesId,
                            order.ProductId,
                            order.CustomerId,
                            order.OrderProductQuantity,
                            order.OrderDate,
                            order.OrderStaus,
                            order.MiscellaneousCost,

                            ProductQuantity = 0,
                            SalesDate = "",
                            SalesDiscount = 0,
                            SalesDuePaymentDate = "",
                            SalesPaidStatus = "",
                            SalesPaymentAmount = 0,
                            SalesPrice = 0,

                            product.ProductName,
                            customer.CustomerName,

                        };

            return query.AsEnumerable()
                        .Where( o => valDate.Contains( AppUtils.DateTime(o.OrderDate).ToShortDateString()) )
                        .ToList();
        }

        [HttpGet("by-days/{days}")]
        public ActionResult<IEnumerable> GetOrdersByDays(int days){
            
            List<String> valDate = new List<string>();
            for (int i = 0; i < days; i++)
            {
                long milliseconds = DateTimeOffset.Now.ToUnixTimeMilliseconds();

                string dateTime =  AppUtils.DateTime(milliseconds-86400000*i ).ToShortDateString();
                valDate.Add(dateTime);
            }
            var query = from order in _context.Orders
                        join sales in _context.Sales
                            on order.SalesId equals sales.SalesId
                        join product in _context.Products
                            on order.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on order.CustomerId equals customer.CustomerId
                        select new {
                            order.OrderId,
                            order.SalesId,
                            order.ProductId,
                            order.CustomerId,
                            order.OrderProductQuantity,
                            order.OrderDate,
                            order.OrderStaus,
                            order.MiscellaneousCost,

                            sales.ProductQuantity,
                            sales.SalesDate,
                            sales.SalesDiscount,
                            sales.SalesDuePaymentDate,
                            sales.SalesPaidStatus,
                            sales.SalesPaymentAmount,
                            sales.SalesPrice,

                            product.ProductName,
                            customer.CustomerName,

                        };

            return query.AsEnumerable()
                        .Where( o => valDate.Contains( AppUtils.DateTime(o.OrderDate).ToShortDateString()) )
                        .ToList();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(long id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(long id, Order order)
        {
            if (id != order.OrderId)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
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

        // POST: api/Orders
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.OrderId }, order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Order>> DeleteOrder(long id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return order;
        }

        [HttpDelete("delete-multiple")] 
        public async Task<ActionResult<string>> DeleteMultiplePurchases(List<Order> order) {
            _context.Orders.RemoveRange(order);
            await _context.SaveChangesAsync();
            return "successfully deleted " + order.Count() + " Orders";
        }

        private bool OrderExists(long id)
        {
            return _context.Orders.Any(e => e.OrderId == id);
        }
    }
}
