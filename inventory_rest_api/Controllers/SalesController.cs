using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory_rest_api.Models;
using System.Collections;

namespace inventory_rest_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public SalesController(InventoryDbContext context)
        {
            _context = context;
        }

        [HttpGet("salesIds")]
        public async Task<ActionResult<IEnumerable>> GetSales () {
            return await _context.Sales
                            .Select(s => s.SalesId)
                            .ToListAsync();
        }

        [HttpPost("sales-product-info")]
        public ActionResult<Object> GetSalesWithProInfo (List<long> ids) {

            var query = from sales in _context.Sales
                        join product in _context.Products
                            on sales.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        where ids.Any( id => id == sales.SalesId)
                        select new {
                            sales.SalesId,
                            customer.CustomerContact,
                            customer.CustomerName,
                            customer.CustomerAddress,
                            product.ProductName,
                            sales.ProductQuantity,
                            sales.SalesPrice,
                            sales.SalesPaymentAmount,
                            sales.SalesDueAmount,
                            DueProductQuantity = sales.SalesDueProduct.ProductQuantity,
                            product.ProductId,
                            sales.SalesDate
                        };
            var queryEnum = query.AsEnumerable();
            return new {
                Data = queryEnum.ToList(),
                ToTalProduct = queryEnum.Select(s => s.ProductId).Distinct().Count(),
                TotalProductQuantity = queryEnum.Sum(s => s.ProductQuantity),
                TotalSalesPrice = queryEnum.Sum(s => s.SalesPrice),
                TotalSalesPaymentAmount = queryEnum.Sum(s => s.SalesPaymentAmount),
                TotalDueProductQuantity = queryEnum.Sum(s => s.DueProductQuantity),
                queryEnum.First().CustomerName,
                queryEnum.First().CustomerAddress,
                queryEnum.First().CustomerContact,

            };
        }

        // GET: api/Sales
        [HttpGet]
        public async Task<ActionResult<IEnumerable>> GetSalesProductCustomers(){
            var query = from sales in _context.Sales
                        join product in _context.Products
                            on sales.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        join pph in _context.ProductPurchaseHistories
                            on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                        select new {
                                sales.SalesId,
                                sales.CustomerId,
                                sales.ProductQuantity,
                                sales.SalesDate,
                                sales.SalesPrice,
                                sales.SalesPaymentAmount,
                                sales.SalesDueAmount,
                                sales.SalesPaidStatus,
                                sales.SalesDuePaymentDate,
                                sales.SalesDiscount,

                                ProductDueStatus = sales.SalesDueProduct.SalesId,

                                product.ProductId,
                                product.ProductName,
                                product.ProductCode,
                                product.ProductCategoryId,
                                product.TotalProducts,
                                product.TotalProductInStock,
                                product.ProductPrice,
                                product.SalestPrice,
                                product.ProductDetails,
                                customer.CustomerName,
                                // customer.CustomerEmail,
                                // customer.CustomerContact,
                                // customer.CustomerAddress,
                                // customer.CustomerJoinDate,
                                // customer.CustomerNID,
                                pph.PerProductPurchasePrice,
                                pph.PerProductSalesPrice
                            };
            return await query.ToListAsync();

        }

        [HttpGet("sales-by-range/{date1}-{date2}")]
        public ActionResult<IEnumerable> GetSalesProductCustomersByRange(string date1,string date2){
            var query = from sales in _context.Sales
                        join product in _context.Products
                            on sales.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        join pph in _context.ProductPurchaseHistories
                            on sales.ProductPurchaseHistoryId equals pph.ProductPurchaseHistoryId
                        select new {
                                sales.SalesId,
                                sales.CustomerId,
                                sales.ProductQuantity,
                                sales.SalesDate,
                                sales.SalesPrice,
                                sales.SalesPaymentAmount,
                                sales.SalesDueAmount,
                                sales.SalesPaidStatus,
                                sales.SalesDuePaymentDate,
                                sales.SalesDiscount,

                                ProductDueStatus = sales.SalesDueProduct.SalesId,

                                product.ProductId,
                                product.ProductName,
                                product.ProductCode,
                                product.ProductCategoryId,
                                product.TotalProducts,
                                product.TotalProductInStock,
                                product.ProductPrice,
                                product.SalestPrice,
                                product.ProductDetails,
                                customer.CustomerName,
                                // customer.CustomerEmail,
                                // customer.CustomerContact,
                                // customer.CustomerAddress,
                                // customer.CustomerJoinDate,
                                // customer.CustomerNID,
                                pph.PerProductPurchasePrice,
                                pph.PerProductSalesPrice
                            };
            return  query.AsEnumerable().Where(s => (double.Parse(s.SalesDate) > double.Parse(date1)) && (double.Parse(s.SalesDate) < double.Parse(date2)))
                                    .ToList();

        }

        // GET: api/Sales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sales>> GetSales(long id)
        {
            var sales = await _context.Sales.FindAsync(id);

            if (sales == null)
            {
                return NotFound();
            }

            return sales;
        }

        [HttpGet("total-sales-due-products")]
        public ActionResult<int> GetTotalDueSalesProduct(){
            return _context.SalesDueProducts.Count();
        }

        [HttpGet("total-sales-payment-due")]
        public ActionResult<int> GetTotalDuePayment(){
            return _context.Sales.Where( s => s.SalesPaidStatus == false).Count();
        }
        
        [HttpGet("sales/product-dues")]
        public async Task<ActionResult<IEnumerable>> GetSalesProductDues(long id){
            var query = from salesDueProduct in _context.SalesDueProducts
                        join sales in _context.Sales
                            on salesDueProduct.SalesId equals sales.SalesId
                        join product in _context.Products
                            on sales.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        select new {
                            salesDueProduct.SalesDueProductId,
                            sales.SalesId,
                            sales.ProductId,
                            sales.CustomerId,
                            sales.ProductQuantity,
                            sales.SalesDate,
                            sales.SalesDiscount,
                            sales.SalesDuePaymentDate,
                            sales.SalesPaidStatus,
                            sales.SalesPaymentAmount,
                            sales.SalesPrice,

                            product.ProductName,
                            customer.CustomerName,

                            SalesDueProductsQuantity = salesDueProduct.ProductQuantity

                        };

            return await query.ToListAsync();
        }

        [HttpGet("sales-payment-due")]
        public async Task<ActionResult<IEnumerable>> GetSalesPaymentDue(long id){

            var query = from sales in _context.Sales where sales.SalesPaidStatus == false
                        join product in _context.Products
                            on sales.ProductId equals product.ProductId
                        join customer in _context.Customers
                            on sales.CustomerId equals customer.CustomerId
                        select new {
                            sales.SalesId,
                            sales.ProductId,
                            customer.CustomerId,
                            sales.ProductQuantity,
                            sales.SalesDate,
                            sales.SalesDiscount,
                            sales.SalesDuePaymentDate,
                            sales.SalesPaidStatus,

                            SalesPaymentDue = sales.SalesPrice - sales.SalesPaymentAmount,
                           
                            sales.SalesPrice,

                            product.ProductName,
                            customer.CustomerName,

                        }; 
            return await query.ToListAsync();
            
        }


       
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSales(long id, Sales sales)
        {
            if (id != sales.SalesId)
            {
                return BadRequest();
            }

            _context.Entry(sales).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSales",  sales);
;
        }

        [HttpPut("sales-payment-due/{id}-{amount}-{date}")]
        public async Task<ActionResult<string>> PutSalesPaymentDue(long id,long amount,string date){
            Sales sales = await _context.Sales.Where( s => s.SalesId == id).FirstAsync();

            if (amount == (sales.SalesPrice - sales.SalesPaymentAmount)){
                sales.SalesPaidStatus = true;
               
            }
            sales.SalesPaymentAmount += amount;
            sales.SalesDuePaymentDate = date;

            _context.Sales.Update(sales);

            await _context.SaveChangesAsync(); 
            return "Successfully update";


        }

        [HttpPost("sales/update-sales-due/{id}")]
        public async Task<ActionResult<SalesDueProduct>> PutPurchaseDueProduct(long id,SalesDueProduct salesDueProduct){
            if (id != salesDueProduct.SalesDueProductId)
            {
                return BadRequest();
            }

            bool query = _context.SalesDueProducts.Any(p => p.SalesDueProductId == salesDueProduct.SalesDueProductId);

            if(query){
                SalesDueProduct res = _context.SalesDueProducts.First(p => p.SalesDueProductId == salesDueProduct.SalesDueProductId);

                if( res.ProductQuantity == salesDueProduct.ProductQuantity){
                    _context.SalesDueProducts.Remove(res);
                    await _context.SaveChangesAsync();
                    return res;
                }
                res.ProductQuantity -= salesDueProduct.ProductQuantity;
                _context.SalesDueProducts.Update(res);
                await _context.SaveChangesAsync();

            }
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Sales>> PostSales(Sales sales)
        {
            _context.Sales.Add(sales);

            ProductPurchaseHistory proPurHis = await _context.ProductPurchaseHistories
                                .FirstAsync( pph => pph.ProductPurchaseHistoryId == sales.ProductPurchaseHistoryId);
            
            proPurHis.ProductQuantity -= sales.ProductQuantity;

            _context.ProductPurchaseHistories.Update(proPurHis);

            await _context.SaveChangesAsync();

            var PaymentSaleseHis = new PaymentSales (){
                            SalesId = sales.SalesId,
                            PaymentSalesDate = DateTime.Now.ToString(),
                            PaymentAmount =  sales.SalesPaymentAmount,
                        };

            _context.PaymentSales.Add(PaymentSaleseHis);
            
            SalesDueProduct salesDueProduct = new SalesDueProduct {
                SalesId = sales.SalesId,
                ProductQuantity = sales.ProductQuantity
            };

            _context.SalesDueProducts.Add(salesDueProduct);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSales", new { id = sales.SalesId }, sales);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult<Sales>> DeleteSales(long id)
        {
            var sales = await _context.Sales.FindAsync(id);
            if (sales == null)
            {
                return NotFound();
            }

            _context.Sales.Remove(sales);
            await _context.SaveChangesAsync();

            return sales;
        }

        [HttpDelete("delete-multiple")] 
        public async Task<ActionResult<string>> DeleteMultiplePurchases(List<Sales> sales) {
            _context.Sales.RemoveRange(sales);
            await _context.SaveChangesAsync();
            return "successfully deleted " + sales.Count() + " Sales";
        }

        private bool SalesExists(long id)
        {
            return _context.Sales.Any(e => e.SalesId == id);
        }
    }
}
