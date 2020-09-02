using System;
using System.Linq;
using System.Threading.Tasks;
using inventory_rest_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace inventory_rest_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public ReportController(InventoryDbContext context)
        {
            _context = context;
        }

        [HttpGet("purchase-report")]
        public  ActionResult<Object> GetPurchaseReport(){

            var report = new {
                TotalProductPurchase  = _context.Purchases.Select( p => p.ProductId).Distinct().Count(),
                TotalPurchasePrice = _context.Purchases.Sum( p => p.PurchasePrice),
                TotalPurchaseProductDue = _context.PurchaseDueProducts.Select( pd => pd.Purchase.ProductId).Distinct().Count()
            };

            return report;
        }



    }
}