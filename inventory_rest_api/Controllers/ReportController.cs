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


        [HttpGet("purchase-report-all")]
        public  ActionResult<Object> GetPurchaseForRepo(string date){
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
                TotalPurchaseProductDue =  _context.PurchaseDueProducts.Include(pd => pd.Purchase),
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
                TotalPurchaseProductDue = _context.PurchaseDueProducts.Where(pd => pd.Purchase.PurchaseDate == AppUtils.DateTime(date).ToShortDateString()).Select( pd => pd.Purchase.ProductId).Distinct().Count(),
                TotalPurchasePaymentDue = purQuery.Where( p => p.PurchasePaidStatus == false).Count(),
                PurchaseRate = purRateReport,
            };

            return report;
        }

        [HttpGet("sales-report")]
        public  ActionResult<Object> GetSalesReport(){

            var salesRateQuery = from sales in _context.Sales
                                select new {
                                    sales.SalesId,
                                    sales.ProductId,
                                    sales.ProductQuantity,
                                    AppUtils.DateTime(sales.SalesDate).Day,
                                    AppUtils.DateTime(sales.SalesDate).Month,
                                    AppUtils.DateTime(sales.SalesDate).Year,
                                    Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                                };
            var salesRateReport = salesRateQuery.AsEnumerable()
                        .GroupBy(
                            p => p.Date,
                            (key,g) => new {
                                Date = key ,
                                Count = g.Count(),
                                Data = g.ToList(),
                            }
                        ).ToList();

            var report = new {
                TotalProductSales  = _context.Sales.Select( p => p.ProductId).Distinct().Count(),
                TotalSalesPrice = _context.Sales.Sum( p => p.SalesPrice),
                TotalSalesProductDue = _context.SalesDueProducts.Select( sd => sd.Sales.ProductId).Distinct().Count(),
                TotalSalesPaymentDue = _context.Sales.Where( s => s.SalesPaidStatus == false).Count(),
                SalesRate = salesRateReport,
            };

            return report;
        }


        [HttpGet("sales-report-all")]
        public  ActionResult<Object> GetSaleseForRepo(string date){
            var salesRateQuery = from sales in _context.Sales
                                    select new {
                                        sales.SalesId,
                                        sales.ProductId,
                                        sales.ProductQuantity,
                                        sales.SalesPrice,
                                        sales.SalesPaidStatus,
                                        AppUtils.DateTime(sales.SalesDate).Day,
                                        AppUtils.DateTime(sales.SalesDate).Month,
                                        AppUtils.DateTime(sales.SalesDate).Year,
                                        Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                                    };
            var salesRateReport = salesRateQuery.AsEnumerable()
                        .GroupBy(
                            p => p.Date,
                            (key,g) => new {
                                Date = key ,
                                Count = g.Count(),
                                Data = g.ToList(),
                            }
                        ).ToList();
            var report = new {
                TotalSalesProductDue =  _context.SalesDueProducts.Include(pd => pd.Sales),
                SalesRate = salesRateReport,
            };
            return report;
        }
        [HttpGet("sales-report/{date}")]
        public  ActionResult<Object> GetSalesReport(string date){

            var salesRateQuery = from sales in _context.Sales
                                    select new {
                                        sales.SalesId,
                                        sales.ProductId,
                                        sales.ProductQuantity,
                                        sales.SalesPrice,
                                        sales.SalesPaidStatus,
                                        AppUtils.DateTime(sales.SalesDate).Day,
                                        AppUtils.DateTime(sales.SalesDate).Month,
                                        AppUtils.DateTime(sales.SalesDate).Year,
                                        Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                                    };
            var salesQuery = salesRateQuery.AsEnumerable().Where(p => p.Date == AppUtils.DateTime(date).ToShortDateString() )
                            .ToList();

            var salesRateReport = salesQuery.AsEnumerable()
                        .GroupBy(
                            p => p.Date,
                            (key,g) => new {
                                Date = key ,
                                Count = g.Count(),
                                Data = g.ToList(),
                            }
                        ).ToList();
            var report = new {
                TotalProductSales  = salesQuery.Select(s => s.ProductId).Distinct().Count(),
                TotalSalesPrice = salesQuery.Sum( s => s.SalesPrice),
                TotalSalesProductDue = _context.SalesDueProducts.Where(sd => sd.Sales.SalesDate == AppUtils.DateTime(date).ToShortDateString()).Select( sd => sd.Sales.ProductId).Distinct().Count(),
                TotalSalesPaymentDue = salesQuery.Where( s => s.SalesPaidStatus == false).Count(),
                SalesRate = salesRateReport,
            };

            return report;
        }

    }
}