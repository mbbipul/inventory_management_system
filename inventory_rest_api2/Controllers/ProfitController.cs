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
            var purAmount = GetPurchaseAmountByDate(filter,date);
            var costAmount = GetTotalCostByDate(filter,date);
            var salaryAmount = GetTotalSalaryAmountByDate(filter,date);
            var damageAmount = GetTotalDamgeAmountByDate(filter,date);
            var damageComAmount = GetTotalDamgeReturnFromCompanyAmount(filter,date);

            var salesAmount =  GetSalesAmountByDate(filter,date);

            var query = new {
                Customer = GetCustomerNumber(),
                TotalProduct = GetTotalProductNumber(),
                TotalSupplier = _context.Suppliers.Count(),
                TodaysSales = salesAmount,
                TodaysPurchase = purAmount,
                salesPurAmount = GetSalesPurchaseAmountByDate(filter,date),
                TotalCostAmount = costAmount,
                TotalSalaryAmount = salaryAmount,
                TotalDamageReturnAmount = damageAmount,
                TotalDamgeReturnFromCompanyAmount = damageComAmount,
                Profit =  CalculateProfit(GetSalesPurchaseAmountByDate(filter,date),costAmount,salaryAmount,damageAmount,salesAmount,damageComAmount) , 
            };

            return query;
        }

        [HttpGet("profit-report-details-all")]
        public ActionResult<Object> GetProfitReportDetailsALl(){

            var purchaseQuery = from purchase in _context.Purchases
                                select new {
                                    Date = AppUtils.DateTime(purchase.PurchaseDate).ToShortDateString(),
                                    purchase.PurchasePrice
                                };

            var costsQuery =    from costs in _context.Costs
                                select new {
                                    Date = AppUtils.DateTime(costs.Date).ToShortDateString(),
                                    costs.CostAmount
                                };
            
            var salaryQuery =   from salary in _context.Salaries
                                select new {
                                    Date = AppUtils.DateTime(salary.SalaryPaymentDate).ToShortDateString(),
                                    salary.SalaryAmount
                                };

            var damageReturnQuery = from damage in _context.Damages
                                    select new {
                                        Date = AppUtils.DateTime(damage.DamageRetDate).ToShortDateString(),
                                        damage.DamageProductAmount
                                    };
            var damgeReturnFromCompanyAmountQuery = from damage in _context.Damages
                                                    select new {
                                                        Date = AppUtils.DateTime(damage.DamageRetFromCompanyDate).ToShortDateString(),
                                                        damage.DamageRetFromComAmount
                                                    };

            var salesPurchaseQuery =    from sales in _context.Sales 
                                        // join pph in _context.ProductPurchaseHistories
                                        //     on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                                        select new {
                                            sales.SalesPrice,
                                            Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                                            // PurchasePrice = pph.PerProductPurchasePrice * sales.ProductQuantity,
                                            // pph.PerProductSalesPrice

                                        };

            // var purAmount = salesPurchaseQuery.AsEnumerable().Sum( s => s.PurchasePrice);
            var costAmount = _context.Costs.Sum(c => c.CostAmount);
            var salaryAmount = _context.Salaries.Sum(s => s.SalaryAmount);
            var damageAmount = _context.Damages.Sum( d => d.DamageProductAmount);
            var damageComAmount = _context.Damages.Sum(d => d.DamageRetFromComAmount);

            var salesAmount =  salesPurchaseQuery.AsEnumerable().Sum(s => s.SalesPrice);


            var query = new {
                Customer = GetCustomerNumber(),
                TotalProduct = GetTotalProductNumber(),
                TotalSupplier = _context.Suppliers.Count(),
                TotalSalesPurchase =   salesPurchaseQuery.AsEnumerable().GroupBy( 
                                    s => s.Date,
                                    (key,g) => new { 
                                        Date = key , 
                                        TotalSalesAmount = g.Sum(s => s.SalesPrice),
                                        // TotalPurchaseAmount = g.Sum(p => p.PurchasePrice),
                                        TotalPurchaseAmountAll = purchaseQuery.AsEnumerable().Where(p => p.Date == key).Sum(p => p.PurchasePrice),
                                        TotalCostAmount = costsQuery.AsEnumerable().Where(c => c.Date == key).Sum(c => c.CostAmount),
                                        TotalSalaryAmount = salaryQuery.AsEnumerable().Where(s => s.Date == key).Sum( s => s.SalaryAmount),
                                        TotalDamageReturnAmount = damageReturnQuery.AsEnumerable().Where(d => d.Date == key).Sum(d => d.DamageProductAmount),
                                        TotalDamgeReturnFromCompanyAmount = damgeReturnFromCompanyAmountQuery.AsEnumerable().Where(d => d.Date == key).Sum(d => d.DamageRetFromComAmount),
                                }),
                // salesPurAmount = purAmount,
                // Profit =  CalculateProfit(purAmount,costAmount,salaryAmount,damageAmount,salesAmount,damageComAmount) , 
                
            };

            return query;
        }


        [HttpGet("report-details_range/{date1}-{date2}")]
        public ActionResult<Object> GetReportDetailsRange(string date1,string date2){
            
            var purAmount = _context.Purchases.AsEnumerable()
                                .Where(p => (double.Parse(p.PurchaseDate) > double.Parse(date1)) && (double.Parse(p.PurchaseDate) < double.Parse(date2)))
                                .Sum(s => s.PurchasePrice);
            var costAmount = _context.Costs.AsEnumerable().Where(c => (double.Parse(c.Date) > double.Parse(date1)) && (double.Parse(c.Date) < double.Parse(date2)))
                                    .Sum(c => c.CostAmount);
            var salaryAmount = _context.Salaries.AsEnumerable().Where(s => (s.SalaryPaymentDate > double.Parse(date1)) && s.SalaryPaymentDate < double.Parse(date2))
                                    .Sum(s => s.SalaryAmount);
            var damageAmount = _context.Damages.AsEnumerable().Where(d => (double.Parse(d.DamageRetDate) > double.Parse(date1)) && (double.Parse(d.DamageRetDate) < double.Parse(date2)))
                                    .Sum(d => d.DamageProductAmount);
            var damageComAmount = _context.Damages.AsEnumerable().Where(d => (double.Parse(d.DamageRetFromCompanyDate) > double.Parse(date1)) && (double.Parse(d.DamageRetFromCompanyDate) < double.Parse(date2)))
                                    .Sum(d => d.DamageRetFromComAmount);

            var salesAmount =  _context.Sales.AsEnumerable()
                                .Where(s => (double.Parse(s.SalesDate) > double.Parse(date1)) && (double.Parse(s.SalesDate) < double.Parse(date2)))
                                .Sum(s => s.SalesPrice);
            var salesPurQuery =    from sales in _context.Sales 
                                        // join pph in _context.ProductPurchaseHistories
                                        //     on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                                        select new {
                                            sales.SalesPrice,
                                            sales.SalesDate,
                                            // PurchasePrice = pph.PerProductPurchasePrice * sales.ProductQuantity,
                                            // pph.PerProductSalesPrice

                                        };
            // var salesPurAmount = salesPurQuery.AsEnumerable().Where(d => (double.Parse(d.SalesDate) > double.Parse(date1)) && (double.Parse(d.SalesDate) < double.Parse(date2)))
            //                         .Sum(d => d.PurchasePrice);
            var query = new {
                Customer = GetCustomerNumber(),
                TotalProduct = GetTotalProductNumber(),
                TotalSupplier = _context.Suppliers.Count(),
                TodaysSales = salesAmount,
                                
                TodaysPurchase = purAmount,
                TotalCostAmount = costAmount,
                TotalSalaryAmount = salaryAmount,
                TotalDamageReturnAmount = damageAmount,
                TotalDamgeReturnFromCompanyAmount = damageComAmount,
                // salesPurAmount = salesPurAmount,
                // Profit =  CalculateProfit(salesPurAmount,costAmount,salaryAmount,damageAmount,salesAmount,damageComAmount) , 
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
            var purchaseQuery = from purchase in _context.Purchases
                            select new {
                                Date = AppUtils.DateTime(purchase.PurchaseDate).ToShortDateString(),
                                purchase.PurchasePrice
                            };

            var query  =    from sales in _context.Sales 
                            // join pph in _context.ProductPurchaseHistories
                            //     on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                            select new {
                                sales.SalesPrice,
                                SalesDate = double.Parse(sales.SalesDate) ,
                                Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                                // PurchasePrice = pph.PerProductPurchasePrice * sales.ProductQuantity,
                                // pph.PerProductSalesPrice
                            };

            double d1 = double.Parse(date1);
            double d2 = double.Parse(date2);

            return query.AsEnumerable()
                    .Where(s => 
                        s.SalesDate >= d1 && s.SalesDate < d2
                    )
                    .GroupBy( 
                        s => s.Date,
                        (key,g) => new { 
                            Date = key , 
                            TotalPurchaseAmountAll = purchaseQuery.AsEnumerable().Where(p => p.Date == key).Sum(p => p.PurchasePrice),
                            TotalSalesAmount = g.Sum(s => s.SalesPrice)  ,
                            // TotalPurchaseAmount = g.Sum( s => s.PurchasePrice),
                            
                            TotalCostAmount = _context.Costs.AsEnumerable()
                                    .Where(c => (double.Parse(c.Date) > double.Parse(date1)) && (double.Parse(c.Date) < double.Parse(date2)))
                                    .Sum(c => c.CostAmount),
                            TotalSalaryAmount = _context.Salaries.AsEnumerable()
                                    .Where(s => (s.SalaryPaymentDate > double.Parse(date1)) && (s.SalaryPaymentDate < double.Parse(date2)))
                                    .Sum(s => s.SalaryAmount),
                            TotalDamageReturnAmount = _context.Damages.AsEnumerable()
                                .Where(d => (long.Parse(d.DamageRetDate) > double.Parse(date1)) && (long.Parse(d.DamageRetDate) < double.Parse(date2)))
                                .Sum(d => d.DamageProductAmount),
                            TotalDamgeReturnFromCompanyAmount = _context.Damages.AsEnumerable()
                                    .Where(d => (long.Parse(d.DamageRetFromCompanyDate) > double.Parse(date1)) && (long.Parse(d.DamageRetFromCompanyDate) < double.Parse(date2)))
                                    .Sum(d => d.DamageRetFromComAmount),
                        }
            ).ToList();

        }
        
        [HttpGet("profit-details/{filter}-{date}")]
        public ActionResult<IEnumerable> GetAllProfitData(int filter,string date){
            
            var purchaseQuery = from purchase in _context.Purchases
                                select new {
                                    Date = AppUtils.DateTime(purchase.PurchaseDate).ToShortDateString(),
                                    purchase.PurchasePrice
                                };

            var query = from sales in _context.Sales 
                        // join pph in _context.ProductPurchaseHistories
                        //     on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                        select new {
                            sales.SalesPrice,
                            AppUtils.DateTime(sales.SalesDate).Day,
                            AppUtils.DateTime(sales.SalesDate).Month,
                            AppUtils.DateTime(sales.SalesDate).Year,
                            Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                            // PurchasePrice = pph.PerProductPurchasePrice * sales.ProductQuantity,
                            // pph.PerProductSalesPrice
                        };
            var costsQuery =    from costs in _context.Costs
                                select new {
                                    Date = AppUtils.DateTime(costs.Date).ToShortDateString(),
                                    costs.CostAmount
                                };
            
            var salaryQuery =   from salary in _context.Salaries
                                select new {
                                    Date = AppUtils.DateTime(salary.SalaryPaymentDate).ToShortDateString(),
                                    salary.SalaryAmount
                                };

            var damageReturnQuery = from damage in _context.Damages
                                    select new {
                                        Date = AppUtils.DateTime(damage.DamageRetDate).ToShortDateString(),
                                        damage.DamageProductAmount
                                    };
            var damgeReturnFromCompanyAmountQuery = from damage in _context.Damages
                                                    select new {
                                                        Date = AppUtils.DateTime(damage.DamageRetFromCompanyDate).ToShortDateString(),
                                                        damage.DamageRetFromComAmount
                                                    };


            if(filter==0){
                return query.AsEnumerable()
                        .GroupBy( 
                            s => s.Date,
                            (key,g) => new { 
                                Date = key , 
                                TotalPurchaseAmountAll = purchaseQuery.AsEnumerable().Where(p => p.Date == key).Sum(p => p.PurchasePrice),
                                TotalSalesAmount = g.Sum(s => s.SalesPrice)  ,
                                // TotalPurchaseAmount = g.Sum( s => s.PurchasePrice),
                                
                                TotalCostAmount = costsQuery.AsEnumerable().Where(c => c.Date == key).Sum(c => c.CostAmount),
                                TotalSalaryAmount = salaryQuery.AsEnumerable().Where(s => s.Date == key).Sum( s => s.SalaryAmount),
                                TotalDamageReturnAmount = damageReturnQuery.AsEnumerable().Where(d => d.Date == key).Sum(d => d.DamageProductAmount),
                                TotalDamgeReturnFromCompanyAmount = damgeReturnFromCompanyAmountQuery.AsEnumerable().Where(d => d.Date == key).Sum(d => d.DamageRetFromComAmount),
   
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
                                TotalPurchaseAmountAll = purchaseQuery.AsEnumerable().Where(p => p.Date == key).Sum(p => p.PurchasePrice),
                                TotalSalesAmount = g.Sum(s => s.SalesPrice)  ,
                                // TotalPurchaseAmount = g.Sum( s => s.PurchasePrice),
                                TotalCostAmount = costsQuery.AsEnumerable().Where(c => c.Date == key).Sum(c => c.CostAmount),
                                TotalSalaryAmount = salaryQuery.AsEnumerable().Where(s => s.Date == key).Sum( s => s.SalaryAmount),
                                TotalDamageReturnAmount = damageReturnQuery.AsEnumerable().Where(d => d.Date == key).Sum(d => d.DamageProductAmount),
                                TotalDamgeReturnFromCompanyAmount = damgeReturnFromCompanyAmountQuery.AsEnumerable().Where(d => d.Date == key).Sum(d => d.DamageRetFromComAmount),
   

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
                                TotalPurchaseAmountAll = purchaseQuery.AsEnumerable().Where(p => p.Date == key).Sum(p => p.PurchasePrice),
                                TotalSalesAmount = g.Sum(s => s.SalesPrice)  ,
                                // TotalPurchaseAmount = g.Sum( s => s.PurchasePrice),
                                TotalCostAmount = costsQuery.AsEnumerable().Where(c => c.Date == key).Sum(c => c.CostAmount),
                                TotalSalaryAmount = salaryQuery.AsEnumerable().Where(s => s.Date == key).Sum( s => s.SalaryAmount),
                                TotalDamageReturnAmount = damageReturnQuery.AsEnumerable().Where(d => d.Date == key).Sum(d => d.DamageProductAmount),
                                TotalDamgeReturnFromCompanyAmount = damgeReturnFromCompanyAmountQuery.AsEnumerable().Where(d => d.Date == key).Sum(d => d.DamageRetFromComAmount),
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
                        // join pph in _context.ProductPurchaseHistories
                        //     on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                        select new {
                            sales.SalesPrice,
                            AppUtils.DateTime(sales.SalesDate).Day,
                            AppUtils.DateTime(sales.SalesDate).Month,
                            AppUtils.DateTime(sales.SalesDate).Year,
                            Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                            // PurchasePrice = pph.PerProductPurchasePrice * sales.ProductQuantity,
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

        public long GetTotalDamgeReturnFromCompanyAmount(int filter,string d){
            var query = from damages in _context.Damages 
                        select new {
                            damages.DamageRetFromComAmount,
                            AppUtils.DateTime(damages.DamageRetFromCompanyDate).Day,
                            AppUtils.DateTime(damages.DamageRetFromCompanyDate).Month,
                            AppUtils.DateTime(damages.DamageRetFromCompanyDate).Year,
                        };

            if(filter == 0){
                return query.Sum(d => d.DamageRetFromComAmount);
            }else if(filter == 1){
                DateTime dt = AppUtils.DateTime(d);

                return query.AsEnumerable().Where( d => 
                            d.Day  >= dt.Day &&
                            d.Month  == dt.Month &&
                            d.Year  == dt.Year
                    ).Sum(d => d.DamageRetFromComAmount);
            }

            DateTime date = AppUtils.DateTime(d);

            return query.AsEnumerable().Where( d => 
                            d.Day  == date.Day &&
                            d.Month  == date.Month &&
                            d.Year  == date.Year
                    ).Sum(d => d.DamageRetFromComAmount);
        }
        public long GetTotalDamgeAmountByDate(int filter, string d){
            
            var query = from damages in _context.Damages 
                        select new {
                            damages.DamageProductAmount,
                            AppUtils.DateTime(damages.DamageRetDate).Day,
                            AppUtils.DateTime(damages.DamageRetDate).Month,
                            AppUtils.DateTime(damages.DamageRetDate).Year,
                        };

            if(filter == 0){
                return query.Sum(d => d.DamageProductAmount);
            }else if(filter == 1){
                DateTime dt = AppUtils.DateTime(d);

                return query.AsEnumerable().Where( d => 
                            d.Day  >= dt.Day &&
                            d.Month  == dt.Month &&
                            d.Year  == dt.Year
                    ).Sum(d => d.DamageProductAmount);
            }

            DateTime date = AppUtils.DateTime(d);

            return query.AsEnumerable().Where( d => 
                            d.Day  == date.Day &&
                            d.Month  == date.Month &&
                            d.Year  == date.Year
                    ).Sum(d => d.DamageProductAmount);
        }

        public long GetTotalSalaryAmountByDate(int filter,string d){
            
            var query = from salary in _context.Salaries 
                        select new {
                            salary.SalaryAmount,
                            AppUtils.DateTime(salary.SalaryAmount).Day,
                            AppUtils.DateTime(salary.SalaryAmount).Month,
                            AppUtils.DateTime(salary.SalaryAmount).Year,
                        };

            if(filter == 0){
                return query.Sum(s => s.SalaryAmount);
            }else if(filter == 1){
                DateTime dt = AppUtils.DateTime(d);

                return query.AsEnumerable().Where( s => 
                            s.Day  >= dt.Day &&
                            s.Month  == dt.Month &&
                            s.Year  == dt.Year
                    ).Sum(s => s.SalaryAmount);
            }

            DateTime date = AppUtils.DateTime(d);

            return query.AsEnumerable().Where( s => 
                            s.Day  == date.Day &&
                            s.Month  == date.Month &&
                            s.Year  == date.Year
                    ).Sum(s => s.SalaryAmount);
        }
        public long GetTotalCostByDate(int filter,string d){
            var query = from costs in _context.Costs 
                        select new {
                            costs.CostAmount,
                            AppUtils.DateTime(costs.Date).Day,
                            AppUtils.DateTime(costs.Date).Month,
                            AppUtils.DateTime(costs.Date).Year,
                        };

            if(filter == 0){
                return query.Sum(s => s.CostAmount);
            }else if(filter == 1){
                DateTime dt = AppUtils.DateTime(d);

                return query.AsEnumerable().Where( c => 
                            c.Day  >= dt.Day &&
                            c.Month  == dt.Month &&
                            c.Year  == dt.Year
                    ).Sum(c => c.CostAmount);
            }

            DateTime date = AppUtils.DateTime(d);

            return query.AsEnumerable().Where( c => 
                            c.Day  == date.Day &&
                            c.Month  == date.Month &&
                            c.Year  == date.Year
                    ).Sum(c => c.CostAmount);
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

        public long GetSalesPurchaseAmountByDate(int filter,string d){

            var query = from sales in _context.Sales 
                                        // join pph in _context.ProductPurchaseHistories
                                        //     on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                                        select new {
                                            sales.SalesPrice,
                                            Date = AppUtils.DateTime(sales.SalesDate).ToShortDateString(),
                                            Day =  AppUtils.DateTime(sales.SalesDate).Day,
                                            Month =  AppUtils.DateTime(sales.SalesDate).Month,
                                            Year =  AppUtils.DateTime(sales.SalesDate).Year,
                                            // PurchasePrice = pph.PerProductPurchasePrice * sales.ProductQuantity,
                                            // pph.PerProductSalesPrice

                                        };
            if(filter==0){
                // return query.Sum(p => p.PurchasePrice);
            }else if(filter==1){
                  DateTime dt = AppUtils.DateTime(d);

                // return query.AsEnumerable().Where( p => 
                //             p.Day  >= dt.Day &&
                //             p.Month  == dt.Month &&
                //             p.Year  == dt.Year
                //     ).Sum(p => p.PurchasePrice);
            }

            // DateTime date = AppUtils.DateTime(d);

            // return query.AsEnumerable().Where( p => 
            //                 p.Day  == date.Day &&
            //                 p.Month  == date.Month &&
            //                 p.Year  == date.Year
            //         ).Sum(p => p.PurchasePrice);
            return 0;
        }

        private long CalculateProfit(long purAmount,long costAmount,long salaryAmount,long damageAmount,long salesAmount,long damageComAmount){
            long profit =  (salesAmount+damageComAmount) - (purAmount + costAmount + salaryAmount + damageAmount) ; 
            return profit;
        }


    }
}