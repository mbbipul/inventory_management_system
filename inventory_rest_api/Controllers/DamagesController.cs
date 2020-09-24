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
    public class DamagesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public DamagesController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/Damages
        [HttpGet("filter/{status}")]
        public async Task<ActionResult<IEnumerable>> GetDamages(string status)
        {
            return await _context.Damages
                                .Include(d => d.Product)
                                .Include(d => d.Customer)
                                .Include(d => d.Supplier)
                                .Include(d => d.Employee)
                                .Select( d => new {
                                    d.DamageId,

                                    d.ProductId,
                                    d.Product.ProductName,

                                    d.CustomerId,
                                    d.Customer.CustomerName,

                                    d.EmployeeId,
                                    d.Employee.EmployeeName,

                                    d.SupplierId,
                                    d.Supplier.SupplierName,
                                    
                                    d.DamageRetDate,
                                    d.ProductQuantity,
                                    d.DamageProductAmount,
                                    d.DamageSentToCompanyStatus,
                                    d.DamageSentToCompanyDate,
                                    d.DamageRetFromCompanyDate,
                                    d.DamageRetFromComAmount,
                                    d.DamageRetComProQuantity,
                                    d.DamageRetComProQuantityDueStatus,
                                    d.DamgeReturnCompanyDueAmount,
                                    d.DamgeReturnCompanyDuePaymentStatus,
                                    d.DamgeReturnCompanyDueDate
                                })
                                .Where( d => d.DamageSentToCompanyStatus == status)
                                .ToListAsync();
        }

        // GET: api/Damages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Damage>> GetDamage(long id)
        {
            var damage = await _context.Damages.FindAsync(id);

            if (damage == null)
            {
                return NotFound();
            }

            return damage;
        }

        // PUT: api/Damages/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDamage(long id, Damage damage)
        {
            if (id != damage.DamageId)
            {
                return BadRequest();
            }

            _context.Entry(damage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DamageExists(id))
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

        // POST: api/Damages
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Damage>> PostDamage(Damage damage)
        {
            _context.Damages.Add(damage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDamage", new { id = damage.DamageId }, damage);
        }

        // DELETE: api/Damages/5
        [HttpDelete("filter/{status}/{id}")]
        public async Task<ActionResult<Damage>> DeleteDamage(string status,long id)
        {
            var damage = await _context.Damages.FindAsync(id);
            if (damage == null)
            {
                return NotFound();
            }
    
            _context.Damages.Remove(damage);
            await _context.SaveChangesAsync();

            return damage;
        }

        private bool DamageExists(long id)
        {
            return _context.Damages.Any(e => e.DamageId == id);
        }
    }
}
