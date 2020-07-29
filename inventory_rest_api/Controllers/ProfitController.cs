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

        [HttpGet("isexists/{id}")]
        public ActionResult<string> GetExists(long id){
            var pHis = _context.ProductPurchaseHistories
                            .Any( pph => pph.ProductId == id && pph.PerProductPurchasePrice == 60);
            if(pHis){
                return "exists";
            }
            return "no";
        }

        [HttpGet("sales")]
        public ActionResult<long> GetSalesAmount(long id){

            return GetAllSalesAmount();
        }

        [HttpGet("sales-bydate/{date}")]
        public ActionResult<long> GetSalesByDate(long date){
            return GetSalesAmountByDate(date);
        }
        
        [HttpGet("profit-details")]
        public async Task<ActionResult<IEnumerable>> GetProfitData(){
            
            var query = from sales in _context.Sales
                        join pph in _context.ProductPurchaseHistories
                            on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                        select new {
                            sales.SalesPrice,
                            AppUtils.DateTime(sales.SalesDate).Day,
                            AppUtils.DateTime(sales.SalesDate).Month,
                            AppUtils.DateTime(sales.SalesDate).Year,
                            sales.ProductQuantity,
                            pph.PerProductPurchasePrice,
                            // pph.PerProductSalesPrice
                        };

            return await query.ToListAsync();
        }

        public long GetAllSalesAmount(){

            var amount = _context.Sales.Sum(s => s.SalesPrice);

            return amount;
        }

        public long GetSalesAmountByDate(long dt){
            
            DateTime dateTime = AppUtils.DateTime(dt);
            
            var query = _context.Sales.AsEnumerable();
            return query.Where( s => 
                            AppUtils.DateTime(s.SalesDate).Day  == AppUtils.DateTime(dt).Day &&
                            AppUtils.DateTime(s.SalesDate).Month  == AppUtils.DateTime(dt).Month
                    ).Sum(s => s.SalesPrice);
        }



    }
}