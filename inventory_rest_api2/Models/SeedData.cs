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
                    ProductCode = "231234",
                    ProductPrice = 400,
                    TotalProducts = 10,

                },
                 new Product {
                    ProductName = "Ata",
                    ProductCode = "231234",
                    ProductPrice = 400,
                    TotalProducts = 10,


                }, new Product {
                    ProductName = "Sugar",
                    ProductCode = "231234",
                    ProductPrice = 400,
                    TotalProducts = 10,


                }
            );
            
            _context.SaveChangesAsync();
        }
    }
}