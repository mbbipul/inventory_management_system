using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace inventory_rest_api.Models
{
    public class SeedData
    {
        public static void EnsurePopulated (IApplicationBuilder app){
            
            InventoryDbContext _context = app.ApplicationServices.GetRequiredService<InventoryDbContext>();
            _context.Database.Migrate();

            if ( _context.Products.Any()){
                return;
            }
            _context.Products.AddRangeAsync(
                new Product {
                    ProductName = "Rice",
                    ProductCategoryId = 5,
                    ProductCode = "231234",
                    ProductPrice = 400,
                    TotalProducts = 10,
                    ProductDetails = "product",

                },
                 new Product {
                    ProductName = "Ata",
                    ProductCategoryId = 5,
                    ProductCode = "231234",
                    ProductPrice = 400,
                    TotalProducts = 10,
                    ProductDetails = "product",


                }, new Product {
                    ProductName = "Sugar",
                    ProductCategoryId = 5,
                    ProductCode = "231234",
                    ProductPrice = 400,
                    TotalProducts = 10,
                    ProductDetails = "product",


                }
            );
            
            _context.SaveChangesAsync();
        }
    }
}