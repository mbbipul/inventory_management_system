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
    public class SalesMemoController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public SalesMemoController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/SalesMemo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesMemo>>> GetSalesMemos()
        {
            return await _context.SalesMemos.ToListAsync();
        }

        // GET: api/SalesMemo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesMemo>> GetSalesMemo(long id)
        {
            var salesMemo = await _context.SalesMemos.FindAsync(id);

            if (salesMemo == null)
            {
                return NotFound();
            }

            return salesMemo;
        }

        // PUT: api/SalesMemo/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSalesMemo(long id, SalesMemo salesMemo)
        {
            if (id != salesMemo.SalesMemoId)
            {
                return BadRequest();
            }

            _context.Entry(salesMemo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesMemoExists(id))
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

        // POST: api/SalesMemo
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<SalesMemo>> PostSalesMemo(List<long> salesIds)
        {
            SalesMemo salesMemo = new SalesMemo { MemoDate = DateTime.Now.ToString() } ;
            _context.SalesMemos.Add(salesMemo);
            await _context.SaveChangesAsync();

            foreach (var id in salesIds)
            {
                MemoWithSales memo = new MemoWithSales {
                    SalesId = id,
                    SalesMemoId = salesMemo.SalesMemoId
                };
                _context.MemoWithSales.Add(memo);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSalesMemo", new { id = salesMemo.SalesMemoId }, salesMemo);
        }


        // DELETE: api/SalesMemo/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SalesMemo>> DeleteSalesMemo(long id)
        {
            var salesMemo = await _context.SalesMemos.FindAsync(id);
            if (salesMemo == null)
            {
                return NotFound();
            }

            _context.SalesMemos.Remove(salesMemo);
            await _context.SaveChangesAsync();

            return salesMemo;
        }

        private bool SalesMemoExists(long id)
        {
            return _context.SalesMemos.Any(e => e.SalesMemoId == id);
        }
    }
}
