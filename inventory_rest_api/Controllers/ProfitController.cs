using System.Collections;
using System.Linq;
using System.Threading.Tasks;
using inventory_rest_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace inventory_rest_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfitController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public ProfitController(InventoryDbContext context) => _context = context ;

        [HttpGet]
        public ActionResult<long> GetProfit(){

            var totalDebit = _context.Sales.Sum(sales => sales.SalesPrice);

            var totalCredit = _context.Purchases.Sum( purchase => purchase.PurchasePrice)
                                + _context.Costs.Sum(cost => cost.CostAmount)
                                + _context.Salaries.Sum(s => s.SalaryAmount);
                                
            return  totalDebit-totalCredit;         
        }
    }
}