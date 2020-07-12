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