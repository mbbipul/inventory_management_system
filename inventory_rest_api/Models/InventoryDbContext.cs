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

        public DbSet<Customer> Customers { get; set; } 

        public DbSet<Sales> Sales { get; set; } 

        public DbSet<Cost> Costs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .HasMany(purchase => purchase.Purchases)
                .WithOne(product => product.Product)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Product>()
                .HasMany(sales => sales.Sales)
                .WithOne(product => product.Product)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Company>()
                .HasMany(supplier => supplier.Suppliers)
                .WithOne(company => company.Company)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductCategory>()
                .HasMany(product => product.Products)
                .WithOne(productCategory => productCategory.ProductCategories)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);


        }

    }
}