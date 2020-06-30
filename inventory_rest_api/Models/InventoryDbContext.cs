using System;
using Microsoft.EntityFrameworkCore;

namespace inventory_rest_api.Models
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options){
        }
        public DbSet<Product> Products { get; set;}
        public DbSet<Supplier> Suppliers { get; set; }

        public DbSet<Company> Companies { get; set; }

        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Purchase> Purchases { get; set; } 

    }
}