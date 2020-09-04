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

            var purchaseRateQuery = from purchase in _context.Purchases
                                select new {
                                    purchase.PurchaseId,
                                    purchase.ProductId,
                                    purchase.ProductQuantity,
                                    AppUtils.DateTime(purchase.PurchaseDate).Day,
                                    AppUtils.DateTime(purchase.PurchaseDate).Month,
                                    AppUtils.DateTime(purchase.PurchaseDate).Year,
                                    Date = AppUtils.DateTime(purchase.PurchaseDate).ToShortDateString(),
                                };
            var purRateReport = purchaseRateQuery.AsEnumerable()
                        .GroupBy( 
                            p => p.Date,
                            (key,g) => new { 
                                Date = key , 
                                Count = g.Count(),
                                Data = g.ToList(),
                            }
                        ).ToList();      

            var report = new {
                TotalProductPurchase  = _context.Purchases.Select( p => p.ProductId).Distinct().Count(),
                TotalPurchasePrice = _context.Purchases.Sum( p => p.PurchasePrice),
                TotalPurchaseProductDue = _context.PurchaseDueProducts.Select( pd => pd.Purchase.ProductId).Distinct().Count(),
                TotalPurchasePaymentDue = _context.Purchases.Where( p => p.PurchasePaidStatus == false).Count(),
                PurchaseRate = purRateReport,
            };

            return report;
        }

        [HttpGet("purchase-report/{date}")]
        public  ActionResult<Object> GetPurchaseReport(string date){

            var purchaseRateQuery = from purchase in _context.Purchases
                                    select new {
                                        purchase.PurchaseId,
                                        purchase.ProductId,
                                        purchase.ProductQuantity,
                                        purchase.PurchasePrice,
                                        purchase.PurchasePaidStatus,
                                        AppUtils.DateTime(purchase.PurchaseDate).Day,
                                        AppUtils.DateTime(purchase.PurchaseDate).Month,
                                        AppUtils.DateTime(purchase.PurchaseDate).Year,
                                        Date = AppUtils.DateTime(purchase.PurchaseDate).ToShortDateString(),
                                    };
            var purQuery = purchaseRateQuery.AsEnumerable().Where(p => p.Date == AppUtils.DateTime(date).ToShortDateString() )
                        .ToList();  

            var purRateReport = purchaseRateQuery.AsEnumerable()
                        .GroupBy( 
                            p => p.Date,
                            (key,g) => new { 
                                Date = key , 
                                Count = g.Count(),
                                Data = g.ToList(),
                            }
                        ).ToList();  
            var report = new {
                TotalProductPurchase  = purQuery.Select(p => p.ProductId).Distinct().Count(),
                TotalPurchasePrice = purQuery.Sum( p => p.PurchasePrice),
                TotalPurchaseProductDue = purQuery.Select( pd => pd.ProductId).Distinct().Count(),
                TotalPurchasePaymentDue = purQuery.Where( p => p.PurchasePaidStatus == false).Count(),
                PurchaseRate = purRateReport,
            };

            return report;
        }




    }
}