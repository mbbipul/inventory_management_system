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

        [HttpGet("snapshot-report")]
        public async Task<ActionResult<Object>> GetStoreSnapReport(){

            long companyPending  = await _context.PurchaseDueProducts
                                        .Include(pdp => pdp.Purchase).SumAsync(pdp =>pdp.Purchase.PurchasePrice);
            var companyDuePaymentQuery  =   from pdp in _context.PurchaseDueProducts
                                        join ppur  in _context.PaymentPurchases
                                            on pdp.PurchaseId equals ppur.PurchaseId
                                        select new {
                                            ppur.PaymentAmount
                                        };
            long companyDuePayments = companyDuePaymentQuery.AsEnumerable().Sum(cp => cp.PaymentAmount);
            long godownStockWithCompanyDue =await _context.ProductPurchaseHistories.SumAsync(pph => (pph.ProductQuantity*pph.PerProductPurchasePrice));
            
            long customerCash = await _context.PaymentSales.SumAsync( s => s.PaymentAmount);
            long dsrCash = await _context.OrderPayments.SumAsync( s => s.PaymentAmount);

            long totalSalesPrice = await _context.Sales.SumAsync(s => s.SalesPrice);
            long totalOrderSalesPrice = await _context.OrderSales.SumAsync(os => os.OrderTotalPrice);            
            var damageQuery =   _context.Damages
                                .Select( d => new {
                                    ProductRate = (d.DamageProductAmount / d.ProductQuantity),
                                    DelDamProQuantity = _context.DamageDeliveryHistories
                                                            .Where(dh => dh.DamageId == d.DamageId)
                                                            .Sum(dh => dh.DeliverProductQuantity),
                                    RecepDamProQuantity = _context.DamageReceptionHistories
                                                            .Where(dh => dh.DamageId == d.DamageId)
                                                            .Sum(dh => dh.RecievedProductQuantity)
                                }).AsEnumerable();
            long damage = damageQuery.Sum(d => (d.DelDamProQuantity-d.RecepDamProQuantity)*d.ProductRate);

            long totalPayments = await _context.PaymentPurchases.SumAsync(pp => pp.PaymentAmount);
            long mainCost = await _context.Costs.SumAsync(c => c.CostAmount);
            long ordersCost = await _context.OrderSales.SumAsync(os => os.Cost);
            long totalCommision = await _context.OrderSales.SumAsync(OrderSales=> OrderSales.Commission);

            StoreSnapshot storeSnapshot = new StoreSnapshot {
                GodownStock = godownStockWithCompanyDue - companyPending,
                CompanyPending = companyPending - companyDuePayments,
                Credit = (totalOrderSalesPrice+totalSalesPrice) - (customerCash+dsrCash),
                Cash = customerCash + dsrCash ,
                Damage = damage,

                PurchasePrice = await _context.Purchases.SumAsync(pur => pur.PurchasePrice),
                TotalPayment = totalPayments,
                TotalCost = mainCost+ordersCost,
                TotalSalary = await _context.Salaries.SumAsync(s => s.SalaryAmount),
                TotalCommision = totalCommision,

            };
            if(companyPending == 0){
                storeSnapshot.CompanyPending = 0;
            }

            return storeSnapshot.GetStoreSnapshot();
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

        [HttpGet("purchase-report-range/{date1}-{date2}")]
        public  ActionResult<Object> GetPurchaseReportByDateRange(string date1,string date2){

            double d1 = double.Parse(date1);
            double d2 = double.Parse(date2);

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
                                        DateLong = long.Parse(purchase.PurchaseDate)
                                    };
            var purQuery = purchaseRateQuery.AsEnumerable().Where(p => p.DateLong >= d1 && p.DateLong < d2)
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

            var pdQuery = from pd in _context.PurchaseDueProducts 
                                                select new {
                                                    PurchaseDateLong = long.Parse(pd.Purchase.PurchaseDate),
                                                    pd.Purchase.ProductId
                                                };
            var report = new {
                TotalProductPurchase  = purQuery.Select(p => p.ProductId).Distinct().Count(),
                TotalPurchasePrice = purQuery.Sum( p => p.PurchasePrice),
                TotalPurchaseProductDue = pdQuery.AsEnumerable().Where(pd => pd.PurchaseDateLong >= d1 && pd.PurchaseDateLong < d2).Select( pd => pd.ProductId).Distinct().Count(),
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
                // TotalProductSales  = _context.Sales.Select( p => p.ProductId).Distinct().Count(),
                TotalSalesPrice = _context.Sales.Sum( p => p.SalesPrice),
                // TotalSalesProductDue = _context.SalesDueProducts.Select( sd => sd.Sales.ProductId).Distinct().Count(),
                TotalSalesPaymentDue = _context.Sales.Where( s => s.SalesPaidStatus == false).Count(),
                SalesRate = salesRateReport,
            };

            return report;
        }

        [HttpGet("sales-report-range/{date1}-{date2}")]
        public  ActionResult<Object> GeSalesReportByDateRange(string date1,string date2){

            double d1 = double.Parse(date1);
            double d2 = double.Parse(date2);

            var salesRateQuery = from sales in _context.Sales
                                    select new {
                                        sales.SalesId,
                                        // sales.ProductId,
                                        // sales.ProductQuantity,
                                        sales.SalesPrice,
                                        sales.SalesPaidStatus,
                                        AppUtils.DateTime(sales.SalesDate).Day,
                                        AppUtils.DateTime(sales.SalesDate).Month,
                                        AppUtils.DateTime(sales.SalesDate).Year,
                                        Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                                        DateLong = long.Parse(sales.SalesDate)
                                    };
            var salesQuery = salesRateQuery.AsEnumerable().Where(s => s.DateLong >= d1 && s.DateLong < d2)
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
            var sdQuery = from sd in _context.SalesDueProducts 
                                                select new {
                                                    DateLong = "long.Parse(s.SalesDate)",
                                                    // sd.Sales.ProductId
                                                };


            var report = new {
                // TotalProductSales  = salesQuery.Select(s => s.ProductId).Distinct().Count(),
                TotalSalesPrice = salesQuery.Sum( s => s.SalesPrice),
                // TotalSalesProductDue = sdQuery.AsEnumerable().Where(sd => sd.DateLong >= d1 && sd.DateLong < d2).Select( sd => sd.ProductId).Distinct().Count(),
                TotalSalesPaymentDue = salesQuery.Where( s => s.SalesPaidStatus == false).Count(),
                SalesRate = salesRateReport,
            };

            return report;
        }


        [HttpGet("sales-report-all")]
        public  ActionResult<Object> GetSaleseForRepo(string date){
            var salesRateQuery = from sales in _context.Sales
                                    select new {
                                        sales.SalesId,
                                        // sales.ProductId,
                                        // sales.ProductQuantity,
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
                TotalSalesProductDue =  _context.SalesDueProducts,
                SalesRate = salesRateReport,
            };
            return report;
        }
        [HttpGet("sales-report/{date}")]
        public  ActionResult<Object> GetSalesReport(string date){

            var salesRateQuery = from sales in _context.Sales
                                    select new {
                                        sales.SalesId,
                                        // sales.ProductId,
                                        // sales.ProductQuantity,
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
                // TotalProductSales  = salesQuery.Select(s => s.ProductId).Distinct().Count(),
                TotalSalesPrice = salesQuery.Sum( s => s.SalesPrice),
                // TotalSalesProductDue = _context.SalesDueProducts.Where(sd => sd.Sales.SalesDate == AppUtils.DateTime(date).ToShortDateString()).Select( sd => sd.Sales.ProductId).Distinct().Count(),
                TotalSalesPaymentDue = salesQuery.Where( s => s.SalesPaidStatus == false).Count(),
                SalesRate = salesRateReport,
            };

            return report;
        }

    }
}