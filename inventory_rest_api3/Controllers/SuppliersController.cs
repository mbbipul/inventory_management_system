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
    public class SuppliersController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public SuppliersController(InventoryDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable>> GetSuppliers(){
            return await _context.Suppliers.ToListAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Supplier>> GetSuppliers(long id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
 
            if (supplier == null)
            {
                return NotFound();
            }
 
            return supplier;
        }
 
        [HttpGet("find/{name}")]
        public ActionResult<bool> IsSupplierExists(string name)
        {
            if(_context.Suppliers
                            .Any(c => c.SupplierName == name)){
                return true;
            }

            return false;

        }

        // PUT: api/Supplier/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSuppliers(long id, Supplier supplier)
        {
            if (id != supplier.SupplierId)
            {
                return BadRequest();
            }
 
            _context.Entry(supplier).State = EntityState.Modified;
 
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SupplierExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
 
            return CreatedAtAction("GetSuppliers", new { id = supplier.SupplierId }, supplier);
        }
 
        // POST: api/Suppliers
        [HttpPost]
        public async Task<ActionResult> PostSuppliers(Supplier supplier)
        {
            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();
 
            return CreatedAtAction("GetSuppliers", new { id = supplier.SupplierId }, supplier);
        }
 
        // DELETE: api/Suppliers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Supplier>> DeleteSuppliers(long id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null)
            {
                return NotFound();
            }
 
            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();
 
            return supplier;
        }
 
        [HttpDelete("delete-multiple")]
        public async Task<ActionResult<String>> DeleteSuppliers(IEnumerable<Supplier> suppliers)
        {

            _context.Suppliers.RemoveRange(suppliers);
            await _context.SaveChangesAsync();

            return "Successfully remove datas";
        }
        private bool SupplierExists(long id)
        {
            return _context.Suppliers.Any(e => e.SupplierId == id);
        }

    }
}