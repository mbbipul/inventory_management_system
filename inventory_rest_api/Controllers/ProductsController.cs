using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using inventory_rest_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inventory_rest_api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase 
    {
        private readonly InventoryDbContext _context;
        
        public ProductsController(InventoryDbContext context) => _context = context;


        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProducts(long id)
        {
            var products = await _context.Products.FindAsync(id);
 
            if (products == null)
            {
                return NotFound();
            }
 
            return products;
        }
 
        [HttpGet("find/{name}")]
        public ActionResult<bool> IsCompanyExists(string name)
        {
            if(_context.Products
                            .Any(c => c.ProductName == name)){
                return true;
            }

            return false;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable>> GetJoin(){
            var query = from products in _context.Products
                            .Include(p => p.Purchases)
                        select new ProductsWithCategory(products);
            return await query.ToListAsync();

        }

        [HttpGet("with-pur-his")]
        public async Task<ActionResult<IEnumerable>> GetProductsWithPurchase(){
            var query = from product in _context.Products
                            .Include(p => p.ProductPurchaseHistories)
                        select new {
                            ProductId = product.ProductId,
                            ProductName = product.ProductName,
                            ProductCode = product.ProductCode,
                            TotalProducts = product.TotalProducts,
                            TotalProductInStock = product.TotalProductInStock,
                            ProductPrice = product.ProductPrice,
                            SalestPrice = product.SalestPrice,
                            PurHis = product.ProductPurchaseHistories
                        };
            return await query.ToListAsync();

        }

        // PUT: api/Products/5
        [HttpPut("{salesMethod}/{id}")]
        public async Task<ActionResult<Product>> PutProducts(int salesMethod,long id, Product products)
        {
            if (id != products.ProductId)
            {
                return BadRequest();
            }
            
            if(!ProductsExists(id)){
                return NotFound();
            }
            
            var product = await _context.Products.FirstAsync(p => p.ProductId == id);
            
            
            product.TotalProducts += products.TotalProducts ;
            product.TotalProductInStock += products.TotalProductInStock;
            product.ProductPrice += products.ProductPrice;

            switch (salesMethod)
            {
                case 0: // product price / product quantity in stock
                    product.SalestPrice =  product.ProductPrice / product.TotalProductInStock ;
                    break;
                case 1 :
                    product.SalestPrice =  (products.SalestPrice + product.SalestPrice) /2 ; //average
                    break;
                
                default: // current 
                    break;
            }

            product.SalestPrice = products.SalestPrice;
            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return products;
        }
 
        [HttpPut("bySales/{id}")]
        public async Task<ActionResult<Product>> PutProductsBySales(long id, Product products)
        {
            if (id != products.ProductId)
            {
                return BadRequest();
            }
            
            if(!ProductsExists(id)){
                return NotFound();
            }

            var product = await _context.Products.FirstAsync(p => p.ProductId == id);
            
            product.TotalProductInStock -= products.TotalProductInStock;
            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return products;
        }
        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult> PostProducts(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
 
            return CreatedAtAction("GetProducts", new { id = product.ProductId }, product);
        }
 
        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> DeleteProducts(long id)
        {
            var products = await _context.Products.FindAsync(id);
            if (products == null)
            {
                return NotFound();
            }
 
            _context.Products.Remove(products);
            await _context.SaveChangesAsync();
 
            return products;
        }
 
        [HttpDelete("delete-multiple")] 
        public async Task<ActionResult<string>> DeleteMultiplePurchases(List<Product> product) {
            _context.Products.RemoveRange(product);
            await _context.SaveChangesAsync();
            return "successfully deleted " + product.Count() + " Product";
        }


        private bool ProductsExists(long id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
        
    }

}