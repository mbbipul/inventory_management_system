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
    public class EmployeesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public EmployeesController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployee()
        {
            return await _context.Employees.ToListAsync();
        }

        [HttpGet("credit-employees")]
        public ActionResult<IEnumerable> GetCreditEmployees(long id)
        {
            var query = from sales in _context.OrderSales
                        join emp in _context.Employees
                            on sales.EmployeeId equals emp.EmployeeId
                        where sales.OrderPaidStatus == false 
                        select new {
                            sales.OrderSalesId,
                            emp.EmployeeId,
                            emp.EmployeeName,
                            emp.EmployeeAddress,
                            emp.EmployeeContact,
                            sales.OrderTotalPrice,
                            sales.OrderPaymentAmount,
                            OrderDueAmount = sales.OrderTotalPrice - sales.OrderPaymentAmount,
                        };
 
            return query.AsEnumerable().GroupBy(
                s => s.EmployeeId,
                (key,g) => new {
                        g.First().EmployeeName,
                        g.First().EmployeeAddress,
                        g.First().EmployeeContact,
                        OrderSalesPrice = g.Sum( s => s.OrderTotalPrice),
                        OrderSalesPaymentAmount = g.Sum(s => s.OrderPaymentAmount),
                        EmployeeDueAmount = g.Sum( s => s.OrderDueAmount),
                        OrderSalesIds = g.Select(s => s.OrderSalesId).ToList()
                }
            ).ToList();
        }

        [HttpGet("paid-employees")]
        public ActionResult<IEnumerable> GetPaidEmployees(long id)
        {
            var query = from sales in _context.OrderSales
                        join emp in _context.Employees
                            on sales.EmployeeId equals emp.EmployeeId
                        where sales.OrderPaidStatus == true 
                        select new {
                            emp.EmployeeId,
                            emp.EmployeeName,
                            emp.EmployeeAddress,
                            emp.EmployeeContact,
                            sales.OrderTotalPrice,
                            sales.OrderPaymentAmount,
                            OrderDueAmount = sales.OrderTotalPrice - sales.OrderPaymentAmount,
                        };
 
            return query.AsEnumerable().GroupBy(
                s => s.EmployeeId,
                (key,g) => new {
                        
                        g.First().EmployeeName,
                        g.First().EmployeeAddress,
                        g.First().EmployeeContact,
                        OrderSalesPrice = g.Sum( s => s.OrderTotalPrice),
                        OrderSalesPaymentAmount = g.Sum(s => s.OrderPaymentAmount),
                        EmployeeDueAmount = g.Sum( s => s.OrderDueAmount)
                        
                }
            ).ToList();
        }

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(long id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        // PUT: api/Employees/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(long id, Employee employee)
        {
            if (id != employee.EmployeeId)
            {
                return BadRequest();
            }

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
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

        // POST: api/Employees
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEmployee", new { id = employee.EmployeeId }, employee);
        }

        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Employee>> DeleteEmployee(long id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return employee;
        }

        [HttpDelete("delete-multiple")] 
        public async Task<ActionResult<string>> DeleteMultiplePurchases(List<Employee> employees) {
            _context.Employees.RemoveRange(employees);
            await _context.SaveChangesAsync();
            return "successfully deleted " + employees.Count() + " Employee";
        }

        private bool EmployeeExists(long id)
        {
            return _context.Employees.Any(e => e.EmployeeId == id);
        }
    }
}
