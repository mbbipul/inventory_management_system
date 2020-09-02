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
    public class PurchasesController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public PurchasesController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/Purchase
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Purchase>>> GetPurchases()
        {
            return await _context.Purchases
                            .OrderBy( purchase => purchase.PurchaseDate)
                            .ToListAsync();
        }

        // GET: api/Purchase/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Purchase>> GetPurchase(long id)
        {
            var purchases = await _context.Purchases.FindAsync(id);

            if (purchases == null)
            {
                return NotFound();
            }

            return purchases;
        }

        [HttpGet("purchase-product")]
        public async Task<ActionResult<IEnumerable>> GetPurchaseWithProduct(long id)
        {
            var query = from purchase in _context.Purchases
                        join product in _context.Products
                            on purchase.ProductId equals product.ProductId
                        join supplier in _context.Suppliers
                            on purchase.SupplierId equals supplier.SupplierId
                        select new {

                            purchase.PurchaseId,
                            purchase.ProductId,
                            supplier.SupplierId,
                            purchase.ProductQuantity,
                            purchase.PurchaseDate,
                            purchase.PurchaseDiscount,
                            purchase.PurchaseDuePaymentDate,
                            purchase.PurchasePaidStatus,
                            purchase.PurchasePaymentAmount,
                            purchase.PurchasePrice,
                            purchase.SalesPrice,

                            product.ProductName,
                            supplier.SupplierName

                        };

            return await query.ToListAsync();
        }
        
        [HttpGet("total-purchase-due-products")]
        public ActionResult<int> GetTotalDueProducts(){
            return _context.PurchaseDueProducts.Count();
        }
        
        [HttpGet("total-purchase-payment-due")]
        public ActionResult<int> GetTotalDuePayment(){
            return _context.Purchases.Where( p => p.PurchasePaidStatus == false).Count();
        }

        [HttpGet("purchase/product-dues")]
        public async Task<ActionResult<IEnumerable>> GetPurcahseProductDues(long id){
            var query = from purchaseDueProducts in _context.PurchaseDueProducts
                        join purchase in _context.Purchases
                            on purchaseDueProducts.PurchaseId equals purchase.PurchaseId
                        join product in _context.Products
                            on purchase.ProductId equals product.ProductId
                        join supplier in _context.Suppliers
                            on purchase.SupplierId equals supplier.SupplierId
                        select new {
                            purchaseDueProducts.PurchaseDueProductId,
                            purchase.PurchaseId,
                            purchase.ProductId,
                            supplier.SupplierId,
                            purchase.ProductQuantity,
                            purchase.PurchaseDate,
                            purchase.PurchaseDiscount,
                            purchase.PurchaseDuePaymentDate,
                            purchase.PurchasePaidStatus,
                            purchase.PurchasePaymentAmount,
                            purchase.PurchasePrice,
                            purchase.SalesPrice,

                            product.ProductName,
                            supplier.SupplierName,

                            PurchaseDueProductsQuantity = purchaseDueProducts.ProductQuantity

                        };

            return await query.ToListAsync();
        }


        [HttpGet("purchase-payment-due")]
        public async Task<ActionResult<IEnumerable>> GetPurcahsePaymentDue(long id){

            var query = from purchase in _context.Purchases where purchase.PurchasePaidStatus == false
                        join product in _context.Products
                            on purchase.ProductId equals product.ProductId
                        join supplier in _context.Suppliers
                            on purchase.SupplierId equals supplier.SupplierId
                        select new {
                            purchase.PurchaseId,
                            purchase.ProductId,
                            supplier.SupplierId,
                            purchase.ProductQuantity,
                            purchase.PurchaseDate,
                            purchase.PurchaseDiscount,
                            purchase.PurchaseDuePaymentDate,
                            purchase.PurchasePaidStatus,

                            PurchasePaymentDue = purchase.PurchasePrice - purchase.PurchasePaymentAmount,
                           
                            purchase.PurchasePrice,
                            purchase.SalesPrice,

                            product.ProductName,
                            supplier.SupplierName,

                        }; 
            return await query.ToListAsync();
            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPurchases(long id, Purchase purchase)
        {
            if (id != purchase.PurchaseId)
            {
                return BadRequest();
            }

            _context.Entry(purchase).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PurchasesExists(id))
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

        [HttpPut("purchase-payment-due/{id}-{amount}-{date}")]
        public async Task<ActionResult<string>> PutPurchasePaymentDue(long id,long amount,string date){
            Purchase purchase = await _context.Purchases.Where( p => p.PurchaseId == id).FirstAsync();

            if (amount == (purchase.PurchasePrice - purchase.PurchasePaymentAmount)){
                purchase.PurchasePaidStatus = true;
               
            }
            purchase.PurchasePaymentAmount += amount;
            purchase.PurchaseDuePaymentDate = date;

            _context.Purchases.Update(purchase);

            await _context.SaveChangesAsync(); 
            return "Successfully update";


        }

        [HttpPost("purchase/update-purchase-due/{id}")]
        public async Task<ActionResult<PurchaseDueProduct>> PutPurchaseDueProduct(long id,PurchaseDueProduct purchaseDueProduct){
            if (id != purchaseDueProduct.PurchaseDueProductId)
            {
                return BadRequest();
            }

            bool query = _context.PurchaseDueProducts.Any(p => p.PurchaseDueProductId == purchaseDueProduct.PurchaseDueProductId);

            if(query){
                PurchaseDueProduct res = _context.PurchaseDueProducts.First(p => p.PurchaseDueProductId == purchaseDueProduct.PurchaseDueProductId);

                if( res.ProductQuantity == purchaseDueProduct.ProductQuantity){
                    _context.PurchaseDueProducts.Remove(res);
                    await _context.SaveChangesAsync();
                    return res;
                }
                res.ProductQuantity -= purchaseDueProduct.ProductQuantity;
                _context.PurchaseDueProducts.Update(res);
                await _context.SaveChangesAsync();

            }
            return NoContent();
        }
 
        // POST: api/Purchase
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Purchase>> PostPurchases(Purchase purchase)
        {
            _context.Purchases.Add(purchase);

            ProductPurchaseHistory productPurchaseHistory = new ProductPurchaseHistory {
                ProductId = purchase.ProductId,
                ProductQuantity = purchase.ProductQuantity,
                PerProductPurchasePrice = purchase.PurchasePrice / purchase.ProductQuantity,
                PerProductSalesPrice = purchase.SalesPrice,
                Date = DateTime.Now.ToUniversalTime().ToString()
            };

            var pHis = _context.ProductPurchaseHistories
                            .Any( pph => pph.ProductId == productPurchaseHistory.ProductId && pph.PerProductPurchasePrice == productPurchaseHistory.PerProductPurchasePrice);
            if(pHis){
                ProductPurchaseHistory purHistory = await _context.ProductPurchaseHistories
                            .FirstAsync( pph => pph.ProductId == productPurchaseHistory.ProductId && pph.PerProductPurchasePrice == productPurchaseHistory.PerProductPurchasePrice);
                
                purHistory.ProductQuantity += productPurchaseHistory.ProductQuantity;

                purHistory.PerProductSalesPrice = 
                    purHistory.PerProductSalesPrice < productPurchaseHistory.PerProductSalesPrice ? productPurchaseHistory.PerProductSalesPrice :  purHistory.PerProductSalesPrice;

                _context.ProductPurchaseHistories.Update(purHistory);
            }else{
                _context.ProductPurchaseHistories.Add(productPurchaseHistory);
            }

                        await _context.SaveChangesAsync();


            PurchaseDueProduct purchaseDueProduct = new PurchaseDueProduct {
                PurchaseId = purchase.PurchaseId,
                ProductQuantity = purchase.ProductQuantity
            };

            _context.PurchaseDueProducts.Add(purchaseDueProduct);
            
            await _context.SaveChangesAsync();
            
            return CreatedAtAction("GetPurchase", new { id = purchase.PurchaseId }, purchase);
        }

        // DELETE: api/Purchase/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Purchase>> DeletePurchases(long id)
        {
            var purchase = await _context.Purchases.FindAsync(id);
            if (purchase == null)
            {
                return NotFound();
            }

            _context.Purchases.Remove(purchase);
            await _context.SaveChangesAsync();

            return purchase;
        }

        [HttpDelete("delete-multiple")] 
        public async Task<ActionResult<string>> DeleteMultiplePurchases(List<Purchase> purchases) {
            _context.Purchases.RemoveRange(purchases);
            await _context.SaveChangesAsync();
            return "successfully deleted " + purchases.Count() + " purchases";
        }
        private bool PurchasesExists(long id)
        {
            return _context.Purchases.Any(e => e.PurchaseId == id);
        }
    }
}
