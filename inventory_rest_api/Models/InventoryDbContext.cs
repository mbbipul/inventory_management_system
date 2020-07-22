using System;
using Microsoft.EntityFrameworkCore;
using inventory_rest_api.Models;

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

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Salary> Salaries { get; set; }

        public DbSet<ProductPurchaseHistory> ProductPurchaseHistories { get; set; }


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

            modelBuilder.Entity<Product>()
                .HasMany(purHis => purHis.ProductPurchaseHistories)
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
            
            modelBuilder.Entity<Employee>()
                .HasMany(salary => salary.Salaries)
                .WithOne(employee => employee.Employee)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductPurchaseHistory>()
                .HasOne(purchase => purchase.Purchase)
                .WithOne(ph => ph.ProductPurchaseHistory)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

        }

    }
}