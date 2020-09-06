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

        [HttpGet("report-details/{filter}-{date}")]
        public ActionResult<Object> GetReportDetails(int filter,string date){
            var query = new {
                Customer = GetCustomerNumber(),
                TotalProduct = GetTotalProductNumber(),
                TotalSupplier = _context.Suppliers.Count(),
                TodaysSales = GetSalesAmountByDate(filter,date),
                TodaysPurchase = GetPurchaseAmountByDate(filter,date),
                Categories = GetCategoriesReport()
            };

            return query;
        }

        [HttpGet("report-details_range/{date1}-{date2}")]
        public ActionResult<Object> GetReportDetailsRange(string date1,string date2){
             var query = new {
                Customer = GetCustomerNumber(),
                TotalProduct = GetTotalProductNumber(),
                TotalSupplier = _context.Suppliers.Count(),
                TodaysSales = _context.Sales.AsEnumerable()
                                .Where(s => (double.Parse(s.SalesDate) > double.Parse(date1)) && (double.Parse(s.SalesDate) < double.Parse(date2)))
                                .Sum(s => s.SalesPrice),
                                
                TodaysPurchase = _context.Purchases.AsEnumerable()
                                .Where(p => (double.Parse(p.PurchaseDate) > double.Parse(date1)) && (double.Parse(p.PurchaseDate) < double.Parse(date2)))
                                .Sum(s => s.PurchasePrice),
                Categories = GetCategoriesReport()
            };

            return query;
        }

        [HttpGet("isexists/{id}")]
        public ActionResult<string> GetExists(long id){
            var pHis = _context.ProductPurchaseHistories
                            .Any( pph => pph.ProductId == id && pph.PerProductPurchasePrice == 60);
            if(pHis){
                return "exists";
            }
            return "no";
        }

        [HttpGet("sales-amount")]
        public ActionResult<long> GetSalesAmount(long id){

            return GetAllSalesAmount();
        }

        [HttpGet("sales-bydate/{date}")]
        public  IEnumerable GetSalesByDate(long date){
            return  GetSalesDetailsByDate(date);
        }
        
        [HttpGet("profit-details_range/{date1}-{date2}")]
        public ActionResult<IEnumerable> GetProfitByDateRange(string date1,string date2){
             var query = from sales in _context.Sales 
                        join pph in _context.ProductPurchaseHistories
                            on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                        select new {
                            sales.SalesPrice,
                            SalesDate = double.Parse(sales.SalesDate) ,
                            Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                            PurchasePrice = pph.PerProductPurchasePrice * sales.ProductQuantity,
                            // pph.PerProductSalesPrice
                        };

            double d1 = double.Parse(date1);
            double d2 = double.Parse(date2);

            return query.AsEnumerable()
                    .Where(s => 
                        s.SalesDate > d1 && s.SalesDate < d2
                    )
                   
                    .GroupBy( 
                        s => s.Date,
                        (key,g) => new { 
                            Date = key , 
                            TotalSalesAmount = g.Sum(s => s.SalesPrice)  ,
                            TotalPurchaseAmount = g.Sum( s => s.PurchasePrice),
                        }
            ).ToList();

        }
        
        [HttpGet("profit-details/{filter}-{date}")]
        public ActionResult<IEnumerable> GetAllProfitData(int filter,string date){
            
            var query = from sales in _context.Sales 
                        join pph in _context.ProductPurchaseHistories
                            on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                        select new {
                            sales.SalesPrice,
                            AppUtils.DateTime(sales.SalesDate).Day,
                            AppUtils.DateTime(sales.SalesDate).Month,
                            AppUtils.DateTime(sales.SalesDate).Year,
                            Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                            PurchasePrice = pph.PerProductPurchasePrice * sales.ProductQuantity,
                            // pph.PerProductSalesPrice
                        };


            if(filter==0){
                return query.AsEnumerable()
                        .GroupBy( 
                            s => s.Date,
                            (key,g) => new { 
                                Date = key , 
                                TotalSalesAmount = g.Sum(s => s.SalesPrice)  ,
                                TotalPurchaseAmount = g.Sum( s => s.PurchasePrice),
                            }
                ).ToList();
            }else if(filter==1){
                DateTime qd = AppUtils.DateTime(date);
                
                return query.AsEnumerable()
                        .Where(s => s.Day >= qd.Day && s.Month == qd.Month && s.Year == qd.Year )
                        .GroupBy( 
                            s => s.Date,
                            (key,g) => new { 
                                Date = key , 
                                TotalSalesAmount = g.Sum(s => s.SalesPrice)  ,
                                TotalPurchaseAmount = g.Sum( s => s.PurchasePrice),
                            }
                ).ToList();
            }
            
            DateTime qDate = AppUtils.DateTime(date);

            return query.AsEnumerable()
                        .Where(s => s.Day == qDate.Day && s.Month == qDate.Month && s.Year == qDate.Year )
                        .GroupBy( 
                            s => s.Date,
                            (key,g) => new { 
                                Date = key , 
                                TotalSalesAmount = g.Sum(s => s.SalesPrice)  ,
                                TotalPurchaseAmount = g.Sum( s => s.PurchasePrice),
                            }
            ).ToList();

        }

        public long GetAllSalesAmount(){

            var amount = _context.Sales.Sum(s => s.SalesPrice);

            return amount;
        }

        public  IEnumerable GetSalesDetailsByDate(long dt){
            
            DateTime dateTime = AppUtils.DateTime(dt);
            
            var query = from sales in _context.Sales
                        join pph in _context.ProductPurchaseHistories
                            on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                        select new {
                            sales.SalesPrice,
                            AppUtils.DateTime(sales.SalesDate).Day,
                            AppUtils.DateTime(sales.SalesDate).Month,
                            AppUtils.DateTime(sales.SalesDate).Year,
                            Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                            PurchasePrice = pph.PerProductPurchasePrice * sales.ProductQuantity,
                            // pph.PerProductSalesPrice
                        };
            
            return query.AsEnumerable().Where( s => 
                            s.Day  == AppUtils.DateTime(dt).Day &&
                            s.Month  == AppUtils.DateTime(dt).Month &&
                            s.Year  == AppUtils.DateTime(dt).Year
                    ).ToList();
        }

        public int GetCustomerNumber() {
            return _context.Customers.Count();
        }

         public int GetTotalProductNumber() {
            return _context.Products.Count();
        }

        public long GetSalesAmountByDate(int filter,string d){

            var query = from sales in _context.Sales 
                        select new {
                            sales.SalesPrice,
                            AppUtils.DateTime(sales.SalesDate).Day,
                            AppUtils.DateTime(sales.SalesDate).Month,
                            AppUtils.DateTime(sales.SalesDate).Year,
                        };

            if(filter == 0){
                return query.Sum(s => s.SalesPrice);
            }else if(filter == 1){
                DateTime dt = AppUtils.DateTime(d);

                return query.AsEnumerable().Where( s => 
                            s.Day  >= dt.Day &&
                            s.Month  == dt.Month &&
                            s.Year  == dt.Year
                    ).Sum(s => s.SalesPrice);
            }

            DateTime date = AppUtils.DateTime(d);

            return query.AsEnumerable().Where( s => 
                            s.Day  == date.Day &&
                            s.Month  == date.Month &&
                            s.Year  == date.Year
                    ).Sum(s => s.SalesPrice);
        }

        public long GetPurchaseAmountByDate(int filter,string d){

            var query = from purchase in _context.Purchases 
                        select new {
                            purchase.PurchasePrice,
                            purchase.ProductQuantity,
                            AppUtils.DateTime(purchase.PurchaseDate).Day,
                            AppUtils.DateTime(purchase.PurchaseDate).Month,
                            AppUtils.DateTime(purchase.PurchaseDate).Year,
                        };
            if(filter==0){
                return query.Sum(p => p.PurchasePrice);
            }else if(filter==1){
                  DateTime dt = AppUtils.DateTime(d);

                return query.AsEnumerable().Where( p => 
                            p.Day  >= dt.Day &&
                            p.Month  == dt.Month &&
                            p.Year  == dt.Year
                    ).Sum(p => p.PurchasePrice);
            }

            DateTime date = AppUtils.DateTime(d);

            return query.AsEnumerable().Where( p => 
                            p.Day  == date.Day &&
                            p.Month  == date.Month &&
                            p.Year  == date.Year
                    ).Sum(p => p.PurchasePrice);
        }

        public IEnumerable GetCategoriesReport(){
            var query = _context.ProductCategories.Include(p=>p.Products).AsEnumerable()
                            .Select((c,i) => new { name = c.ProductCategoryName , count = c.Products.Count() }) 
                            .ToList()  ;
            return query;
        }


    }
}