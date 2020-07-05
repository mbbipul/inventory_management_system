using System;
using System.Collections;
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable>> GetProducts(){
            return await _context.Products
                                .Include(product => product.Purchases).ToListAsync();
        }

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

        [HttpGet("productWithCategories")]
        public async Task<ActionResult<IEnumerable>> GetJoin(){
            var query = from products in _context.Products.Include(product => product.Purchases)
                        join categories in _context.ProductCategories
                            on products.ProductCategoryId equals categories.ProductCategoryId
                        select new ProductsWithCategory(products,categories);
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

            Console.Write(product);


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
 
        private bool ProductsExists(long id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
        
    }

}