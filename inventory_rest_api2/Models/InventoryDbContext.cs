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

        public DbSet<Purchase> Purchases { get; set; } 

        public DbSet<PurchaseDueProduct> PurchaseDueProducts { get; set; } 

        public DbSet<Customer> Customers { get; set; } 

        public DbSet<Sales> Sales { get; set; } 

        public DbSet<SalesDueProduct> SalesDueProducts { get; set; } 

        public DbSet<Cost> Costs { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Salary> Salaries { get; set; }

        public DbSet<ProductPurchaseHistory> ProductPurchaseHistories { get; set; }

        public DbSet<Damage> Damages { get; set; }

        public DbSet<PaymentPurchase> PaymentPurchases { get; set; }
        public DbSet<PaymentSales> PaymentSales { get; set; }
        public DbSet<PurchaseHistory> PurchaseHistories { get; set; }
        public DbSet<SalesHistory> SalesHistories { get; set; }
        public DbSet<DamageDeliveryHistory> DamageDeliveryHistories { get; set; }
        public DbSet<DamageReceptionHistory> DamageReceptionHistories { get; set; }

        public DbSet<SalesProduct> SalesProducts { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<OrderProduct> OrderProducts { get; set; }
        public DbSet<OrderSales> OrderSales { get; set; }
        public DbSet<OrderPayment> OrderPayments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .HasMany(purchase => purchase.Purchases)
                .WithOne(product => product.Product)
                .IsRequired();

            modelBuilder.Entity<Product>()
                .HasMany(purHis => purHis.ProductPurchaseHistories)
                .WithOne(product => product.Product)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Purchase>()
                .HasOne(p => p.PurchaseDueProduct)
                .WithOne(p => p.Purchase)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Purchase>()
                .HasMany(p => p.PaymentPurchases)
                .WithOne(p => p.Purchase)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Purchase>()
                .HasMany(p => p.PurchaseHistories)
                .WithOne(p => p.Purchase)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SalesProduct>()
                .HasOne(s => s.SalesDueProduct)
                .WithOne(s => s.SalesProduct)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Sales>()
                .HasMany(s => s.PaymentSales)
                .WithOne(s => s.Sales)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Sales>()
                .HasMany(s => s.SalesHistories)
                .WithOne(s => s.Sales)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Company>()
                .HasMany(supplier => supplier.Suppliers)
                .WithOne(company => company.Company)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Employee>()
                .HasMany(salary => salary.Salaries)
                .WithOne(e => e.Employee)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Damage>()
                .HasOne(d => d.Product)
                .WithMany(p => p.Damages)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
            
            modelBuilder.Entity<Damage>()
                .HasOne(d => d.Customer)
                .WithMany(p => p.Damages)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
            
            modelBuilder.Entity<Damage>()
                .HasOne(d => d.Employee)
                .WithMany(p => p.Damages)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Damage>()
                .HasOne(d => d.Supplier)
                .WithMany(p => p.Damages)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
            
            modelBuilder.Entity<Damage>()
                .HasMany(d => d.DamageDeliveryHistories)
                .WithOne(p => p.Damage)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Damage>()
                .HasMany(d => d.DamageReceptionHistories)
                .WithOne(p => p.Damage)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductPurchaseHistory>()
                .HasMany(phs => phs.SalesProducts)
                .WithOne(phs => phs.ProductPurchaseHistory)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductPurchaseHistory>()
                .HasOne(p => p.PurchaseDueProduct)
                .WithOne(p => p.ProductPurchaseHistory)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Sales>()
                .HasMany( s => s.SalesProducts)
                .WithOne( sp => sp.Sales)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<OrderSales>()
                .HasMany( s => s.OrderProduct)
                .WithOne( sp => sp.OrderSales)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<OrderSales>()
                .HasMany(o => o.OrderPayments)
                .WithOne(o => o.orderSales)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            


        }

    }
}