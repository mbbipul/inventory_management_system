using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using inventory_rest_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inventory_rest_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public CustomersController(InventoryDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable>> GetCustomers(){
            return await _context.Customers.ToListAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomers(long id)
        {
            var customer = await _context.Customers.FindAsync(id);
 
            if (customer == null)
            {
                return NotFound();
            }
 
            return customer;
        }
 
        [HttpGet("find/{name}")]
        public ActionResult<bool> IsCustomersExists(string name)
        {
            if(_context.Customers
                            .Any(c => c.CustomerName == name)){
                return true;
            }

            return false;

        }

        [HttpGet("credit-customer")]
        public ActionResult<IEnumerable> GetCreditCustomers(long id)
        {
            var query = from sales in _context.Sales
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        where sales.SalesPaidStatus == false 
                        select new {
                            customer.CustomerId,
                            customer.CustomerName,
                            customer.CustomerAddress,
                            customer.CustomerContact,
                            sales.SalesPrice,
                            sales.SalesPaymentAmount,
                            CustomerDueAmount = sales.SalesPrice - sales.SalesPaymentAmount,
                        };
 
            return query.AsEnumerable().GroupBy(
                s => s.CustomerId,
                (key,g) => new {
                        
                        g.First().CustomerName,
                        g.First().CustomerAddress,
                        g.First().CustomerContact,
                        SalesPrice = g.Sum( s => s.SalesPrice),
                        SalesPaymentAmount = g.Sum(s => s.SalesPaymentAmount),
                        CustomerDueAmount = g.Sum( s => s.CustomerDueAmount)
                        
                }
            ).ToList();
        }

        [HttpGet("paid-customer")]
        public ActionResult<IEnumerable> GetPaidCustomers(long id)
        {
            var query = from sales in _context.Sales
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        where sales.SalesPaidStatus == true 
                        select new {
                            customer.CustomerId,
                            customer.CustomerName,
                            customer.CustomerAddress,
                            customer.CustomerContact,
                            sales.SalesPrice,
                            sales.SalesPaymentAmount,
                            CustomerDueAmount = sales.SalesPrice - sales.SalesPaymentAmount,
                        };
 
            return query.AsEnumerable().GroupBy(
                s => s.CustomerId,
                (key,g) => new {
                        
                        g.First().CustomerName,
                        g.First().CustomerAddress,
                        g.First().CustomerContact,
                        SalesPrice = g.Sum( s => s.SalesPrice),
                        SalesPaymentAmount = g.Sum(s => s.SalesPaymentAmount),
                        CustomerDueAmount = g.Sum( s => s.CustomerDueAmount)
                        
                }
            ).ToList();
        }

        [HttpGet("credit-customer/by-date/{date}")]
        public ActionResult<IEnumerable> GetCreditCustomersByDate(string date)
        {
            var query = from sales in _context.Sales
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        where sales.SalesPaidStatus == false 
                        select new {
                            customer.CustomerId,
                            customer.CustomerName,
                            customer.CustomerAddress,
                            customer.CustomerContact,
                            sales.SalesPrice,
                            sales.SalesPaymentAmount,
                            sales.SalesDuePaymentDate,
                            CustomerDueAmount = sales.SalesPrice - sales.SalesPaymentAmount,
                        };
 
            return query.AsEnumerable()
            .Where( s => AppUtils.DateTime(s.SalesDuePaymentDate).ToShortDateString() == AppUtils.DateTime(date).ToShortDateString())
            .GroupBy(
                s => s.CustomerId,
                (key,g) => new {
                        
                        g.First().CustomerName,
                        g.First().CustomerAddress,
                        g.First().CustomerContact,
                        SalesPrice = g.Sum( s => s.SalesPrice),
                        SalesPaymentAmount = g.Sum(s => s.SalesPaymentAmount),
                        CustomerDueAmount = g.Sum( s => s.CustomerDueAmount)
                        
                }
            ).ToList();
        }

        [HttpGet("credit-customer/by-days/{days}")]
        public ActionResult<IEnumerable> GetCreditCustomersByDays(int days)
        {
            List<String> valDate = new List<string>();
            for (int i = 0; i < days; i++)
            {
                long milliseconds = DateTimeOffset.Now.ToUnixTimeMilliseconds();

                string dateTime =  AppUtils.DateTime(milliseconds-86400000*i ).ToShortDateString();
                valDate.Add(dateTime);
            }
            var query = from sales in _context.Sales
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        where sales.SalesPaidStatus == false 
                        select new {
                            customer.CustomerId,
                            customer.CustomerName,
                            customer.CustomerAddress,
                            customer.CustomerContact,
                            sales.SalesPrice,
                            sales.SalesPaymentAmount,
                            sales.SalesDuePaymentDate,
                            CustomerDueAmount = sales.SalesPrice - sales.SalesPaymentAmount,
                        };
 
            return query.AsEnumerable()
            .Where( s => valDate.Contains( AppUtils.DateTime(s.SalesDuePaymentDate).ToShortDateString()) )
            .GroupBy(
                s => s.CustomerId,
                (key,g) => new {
                        
                        g.First().CustomerName,
                        g.First().CustomerAddress,
                        g.First().CustomerContact,
                        SalesPrice = g.Sum( s => s.SalesPrice),
                        SalesPaymentAmount = g.Sum(s => s.SalesPaymentAmount),
                        CustomerDueAmount = g.Sum( s => s.CustomerDueAmount)
                        
                }
            ).ToList();
        }

        [HttpGet("credit-customer/by-date-range/{date1}-{date2}")]
        public ActionResult<IEnumerable> GetCreditCustomersByDateRange(string date1,string date2)
        {
            double d1 = double.Parse(date1);
            double d2 = double.Parse(date2);

            var query = from sales in _context.Sales
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        where sales.SalesPaidStatus == false 
                        select new {
                            customer.CustomerId,
                            customer.CustomerName,
                            customer.CustomerAddress,
                            customer.CustomerContact,
                            sales.SalesPrice,
                            sales.SalesPaymentAmount,
                            SalesDuePaymentDate = double.Parse(sales.SalesDuePaymentDate),
                            CustomerDueAmount = sales.SalesPrice - sales.SalesPaymentAmount,
                        };
 
            return query.AsEnumerable()
            .Where( s => s.SalesDuePaymentDate >= d1 && s.SalesDuePaymentDate < d2 )

            .GroupBy(
                s => s.CustomerId,
                (key,g) => new {
                        
                        g.First().CustomerName,
                        g.First().CustomerAddress,
                        g.First().CustomerContact,
                        SalesPrice = g.Sum( s => s.SalesPrice),
                        SalesPaymentAmount = g.Sum(s => s.SalesPaymentAmount),
                        CustomerDueAmount = g.Sum( s => s.CustomerDueAmount)
                        
                }
            ).ToList();
        }

        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomers(long id, Customer customer)
        {
            if (id != customer.CustomerId)
            {
                return BadRequest();
            }
 
            _context.Entry(customer).State = EntityState.Modified;
 
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
 
            return CreatedAtAction("GetCustomers", new { id = customer.CustomerId }, customer);
        }
 
        // POST: api/Customers
        [HttpPost]
        public async Task<ActionResult> PostCustomers(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
 
            return CreatedAtAction("GetCustomers", new { id = customer.CustomerId }, customer);
        }
 
        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Customer>> DeleteCustomer(long id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }
 
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
 
            return customer;
        }
 
        [HttpDelete("delete-multiple")]
        public async Task<ActionResult<String>> DeleteCustomers(IEnumerable<Customer> customers)
        {

            _context.Customers.RemoveRange(customers);
            await _context.SaveChangesAsync();

            return "Successfully remove datas";
        }
        private bool CustomersExists(long id)
        {
            return _context.Customers.Any(e => e.CustomerId == id);
        }

    }
}