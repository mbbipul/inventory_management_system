using System.Collections;
using System.Linq;
using System.Threading.Tasks;
using inventory_rest_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inventory_rest_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly InventoryDbContext _context;
        
        public CompaniesController(InventoryDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable>> GetCompanies(){
            return await _context.Companies.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Company>> GetCompanies(long id)
        {
            var company = await _context.Companies.FindAsync(id);
 
            if (company == null)
            {
                return NotFound();
            }
 
            return company;
        }
 
        // PUT: api/Companies/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCompanies(long id, Company company)
        {
            if (id != company.CompanyId)
            {
                return BadRequest();
            }
 
            _context.Entry(company).State = EntityState.Modified;
 
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompanyExists(id))
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
 
        // POST: api/Companies
        [HttpPost]
        public async Task<ActionResult> PostCompanies(Company company)
        {
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
 
            return CreatedAtAction("GetCompanies", new { id = company.CompanyId }, company);
        }
 
        // DELETE: api/Companies/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Company>> DeleteCompanies(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
            {
                return NotFound();
            }
 
            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();
 
            return company;
        }
 
        private bool CompanyExists(long id)
        {
            return _context.Companies.Any(e => e.CompanyId == id);
        }
        
    }
}