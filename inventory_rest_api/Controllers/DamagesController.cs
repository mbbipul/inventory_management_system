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

        [HttpGet]
        public async Task<ActionResult<IEnumerable>> GetAllDamages()
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
                                .ToListAsync();
        }

        // GET: api/Damages
        [HttpGet("filter/{status}")]
        public ActionResult<IEnumerable> GetDamages(string status)
        {
            var query =   _context.Damages
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
                                    d.DamgeReturnCompanyDueDate,
                                    DelDamProQuantity = _context.DamageDeliveryHistories
                                                            .Where(dh => dh.DamageId == d.DamageId)
                                                            .Sum(dh => dh.DeliverProductQuantity),
                                    RecepDamProQuantity = _context.DamageReceptionHistories
                                                            .Where(dh => dh.DamageId == d.DamageId)
                                                            .Sum(dh => dh.RecievedProductQuantity)
                                }).AsEnumerable();
            // if (status == "addedWithSendings") {
            //     return  query
            //                 .Where( d => d.DamageSentToCompanyStatus == "sendingToCompany" || d.DamageSentToCompanyStatus == "added")
            //                 .ToList();
            // }
            // if (status == "sendedWithSendings") {
            //     return  query
            //                 .Where( d => d.DamageSentToCompanyStatus == "sendingToCompany" || d.DamageSentToCompanyStatus == "sentToCompany" || d.DamageSentToCompanyStatus == "recievingFromCompany")
            //                 .ToList();
            // }
            // if (status == "receivedWithSendings"){
            //     return  query
            //                 .Where( d => d.DamageSentToCompanyStatus == "recievingFromCompany" || d.DamageSentToCompanyStatus == "returnFromCompany")
            //                 .ToList();
            // }
            if (status == "damageNewTab"){
                return  query
                            .Where( d => 
                                d.DamageSentToCompanyStatus == "added" || 
                                d.DamageSentToCompanyStatus == "sendingToCompany" ||
                                d.DamageSentToCompanyStatus == "recievingFromCompanyWithSendings" 
                            )
                            .ToList();
            }
            if (status == "damageSendToCompanyTab"){
                return  query
                            .Where( d => 
                                d.DamageSentToCompanyStatus == "sentToCompany" || 
                                d.DamageSentToCompanyStatus == "sendingToCompany" ||
                                d.DamageSentToCompanyStatus == "recievingFromCompany"  ||
                                d.DamageSentToCompanyStatus == "recievingFromCompanyWithSendings" 

                            )
                            .ToList();
            }
            if (status == "damageReturnFromCompanyTab"){
                return  query
                            .Where( d => 
                                d.DamageSentToCompanyStatus == "returnFromCompany" || 
                                d.DamageSentToCompanyStatus == "recievingFromCompany"  ||
                                d.DamageSentToCompanyStatus == "recievingFromCompanyWithSendings" 

                            )
                            .ToList();
            }
            return   query
                        .Where( d => d.DamageSentToCompanyStatus == status)
                        .ToList();
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

        [HttpGet("by-date-range/{date1}-{date2}")]
        public ActionResult<IEnumerable> GetDamagesByDateRange(string date1,string date2){
            
            double d1 = double.Parse(date1);
            double d2 = double.Parse(date2);

            return  _context.Damages
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
                                    DamageRetDateLong = double.Parse(d.DamageRetDate),

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
                                .AsEnumerable()
                                .Where( d => d.DamageRetDateLong >= d1 && d.DamageRetDateLong < d2 )
                                .ToList();
        }

        [HttpGet("by-date/{date}")]
        public ActionResult<IEnumerable> GetDamagesByDate(string date){
    
            return  _context.Damages
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
                            .AsEnumerable()
                            .Where( d => AppUtils.DateTime(d.DamageRetDate).ToShortDateString() == AppUtils.DateTime(date).ToShortDateString())
                            .ToList();
        }

        [HttpGet("by-days/{days}")]
        public ActionResult<IEnumerable> GetDamagesByDays(int days){
            
            List<String> valDate = new List<string>();
            for (int i = 0; i < days; i++)
            {
                long milliseconds = DateTimeOffset.Now.ToUnixTimeMilliseconds();

                string dateTime =  AppUtils.DateTime(milliseconds-86400000*i ).ToShortDateString();
                valDate.Add(dateTime);
            }
            return  _context.Damages
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
                                .AsEnumerable()
                                .Where( d => valDate.Contains( AppUtils.DateTime(d.DamageRetDate).ToShortDateString()) )
                                .ToList();
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

            if(damage.ProductQuantity == damage.DamageRetComProQuantity){
                damage.DamageRetComProQuantityDueStatus = true;
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

        [HttpPut("receiveFromCompany/{id}")]
        public async Task<IActionResult> PutDamageToReception(long id, Damage damage)
        {
            if (id != damage.DamageId)
            {
                return BadRequest();
            }

            // int damageDeliveryProQuan = _context.DamageDeliveryHistories.Where( dh => dh.DamageId == damage.DamageId ).Sum(dh => dh.DeliverProductQuantity); 
            int damageReceptionProQuan = _context.DamageReceptionHistories.Where( dh => dh.DamageId == damage.DamageId ).Sum(dh => dh.RecievedProductQuantity);

            if (damage.ProductQuantity == damageReceptionProQuan){
                damage.DamageSentToCompanyStatus = "returnFromCompany";
            }
             if(damage.ProductQuantity == damage.DamageRetComProQuantity){
                damage.DamageRetComProQuantityDueStatus = true;
            }

            Console.WriteLine(damage.DamageSentToCompanyStatus);
            // if (damage.ProductQuantity == damageDeliveryProQuan){
            //     damage.DamageSentToCompanyStatus = "returnFromCompany";
            // }
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

        [HttpPut("sentToCompany/{id}")]
        public async Task<IActionResult> PutDamageToDeliver(long id, Damage damage)
        {
            if (id != damage.DamageId)
            {
                return BadRequest();
            }

            int damageDeliveryProQuan = _context.DamageDeliveryHistories.Where( dh => dh.DamageId == damage.DamageId ).Sum(dh => dh.DeliverProductQuantity);

            if(damage.ProductQuantity == damageDeliveryProQuan){
                if (damage.DamageSentToCompanyStatus != "recievingFromCompanyWithSendings"){
                    damage.DamageSentToCompanyStatus = "sentToCompany";
                }
            }
            
            if(damage.ProductQuantity == damage.DamageRetComProQuantity){
                damage.DamageRetComProQuantityDueStatus = true;
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
            if(damage.ProductQuantity == damage.DamageRetComProQuantity){
                damage.DamageRetComProQuantityDueStatus = true;
            }
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

        [HttpDelete("filter/{status}/delete-multiple")]
        public async Task<ActionResult<String>> DeleteCustomers(string status,IEnumerable<Damage> damages)
        {

            _context.Damages.RemoveRange(damages);
            await _context.SaveChangesAsync();

            return "Successfully remove datas";
        }

        private bool DamageExists(long id)
        {
            return _context.Damages.Any(e => e.DamageId == id);
        }
    }
}
