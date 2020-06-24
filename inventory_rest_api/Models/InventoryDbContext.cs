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

    }
}