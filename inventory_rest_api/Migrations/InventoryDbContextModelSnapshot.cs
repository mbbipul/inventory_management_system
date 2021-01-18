﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using inventory_rest_api.Models;

namespace inventory_rest_api.Migrations
{
    [DbContext(typeof(InventoryDbContext))]
    partial class InventoryDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("inventory_rest_api.Models.Company", b =>
                {
                    b.Property<long>("CompanyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CompanyAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CompanyContact")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CompanyName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CompanyId");

                    b.ToTable("Companies");
                });

            modelBuilder.Entity("inventory_rest_api.Models.Cost", b =>
                {
                    b.Property<long>("CostId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("CostAmount")
                        .HasColumnType("float");

                    b.Property<string>("CostDescription")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CostType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Date")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CostId");

                    b.ToTable("Costs");
                });

            modelBuilder.Entity("inventory_rest_api.Models.Customer", b =>
                {
                    b.Property<long>("CustomerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CustomerAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CustomerContact")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CustomerJoinDate")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CustomerName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CustomerId");

                    b.ToTable("Customers");
                });

            modelBuilder.Entity("inventory_rest_api.Models.Damage", b =>
                {
                    b.Property<long>("DamageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("CustomerId")
                        .HasColumnType("bigint");

                    b.Property<double>("DamageProductAmount")
                        .HasColumnType("float");

                    b.Property<int>("DamageRetComProQuantity")
                        .HasColumnType("int");

                    b.Property<bool>("DamageRetComProQuantityDueStatus")
                        .HasColumnType("bit");

                    b.Property<string>("DamageRetDate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("DamageRetFromComAmount")
                        .HasColumnType("float");

                    b.Property<string>("DamageRetFromCompanyDate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DamageSentToCompanyDate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DamageSentToCompanyStatus")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("DamgeReturnCompanyDueAmount")
                        .HasColumnType("float");

                    b.Property<string>("DamgeReturnCompanyDueDate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("DamgeReturnCompanyDuePaymentStatus")
                        .HasColumnType("bit");

                    b.Property<long>("EmployeeId")
                        .HasColumnType("bigint");

                    b.Property<long>("ProductId")
                        .HasColumnType("bigint");

                    b.Property<int>("ProductQuantity")
                        .HasColumnType("int");

                    b.Property<long>("SupplierId")
                        .HasColumnType("bigint");

                    b.HasKey("DamageId");

                    b.HasIndex("CustomerId");

                    b.HasIndex("EmployeeId");

                    b.HasIndex("ProductId");

                    b.HasIndex("SupplierId");

                    b.ToTable("Damages");
                });

            modelBuilder.Entity("inventory_rest_api.Models.DamageDeliveryHistory", b =>
                {
                    b.Property<long>("DamageDeliveryHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("DamageId")
                        .HasColumnType("bigint");

                    b.Property<int>("DeliverProductQuantity")
                        .HasColumnType("int");

                    b.HasKey("DamageDeliveryHistoryId");

                    b.HasIndex("DamageId");

                    b.ToTable("DamageDeliveryHistories");
                });

            modelBuilder.Entity("inventory_rest_api.Models.DamageReceptionHistory", b =>
                {
                    b.Property<long>("DamageReceptionHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("DamageId")
                        .HasColumnType("bigint");

                    b.Property<double>("RecievedProductAmount")
                        .HasColumnType("float");

                    b.Property<int>("RecievedProductQuantity")
                        .HasColumnType("int");

                    b.HasKey("DamageReceptionHistoryId");

                    b.HasIndex("DamageId");

                    b.ToTable("DamageReceptionHistories");
                });

            modelBuilder.Entity("inventory_rest_api.Models.Employee", b =>
                {
                    b.Property<long>("EmployeeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Date")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmployeeAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmployeeContact")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmployeeName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("EmployeeId");

                    b.ToTable("Employees");
                });

            modelBuilder.Entity("inventory_rest_api.Models.OrderPayment", b =>
                {
                    b.Property<long>("OrderPaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("OrderSalesId")
                        .HasColumnType("bigint");

                    b.Property<double>("PaymentAmount")
                        .HasColumnType("float");

                    b.Property<string>("PaymentOrderSalesDate")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("OrderPaymentId");

                    b.HasIndex("OrderSalesId");

                    b.ToTable("OrderPayments");
                });

            modelBuilder.Entity("inventory_rest_api.Models.OrderProduct", b =>
                {
                    b.Property<long>("OrderProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("DamageQuantityProductQuantity")
                        .HasColumnType("int");

                    b.Property<long>("OrderSalesId")
                        .HasColumnType("bigint");

                    b.Property<long>("ProductPurchaseHistoryId")
                        .HasColumnType("bigint");

                    b.Property<int>("ProductQuantityProductQuantity")
                        .HasColumnType("int");

                    b.Property<double>("ProductRatePrice")
                        .HasColumnType("float");

                    b.Property<int>("ReturnQuantityProductQuantity")
                        .HasColumnType("int");

                    b.HasKey("OrderProductId");

                    b.HasIndex("OrderSalesId");

                    b.HasIndex("ProductPurchaseHistoryId");

                    b.ToTable("OrderProducts");
                });

            modelBuilder.Entity("inventory_rest_api.Models.OrderSales", b =>
                {
                    b.Property<long>("OrderSalesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("Commission")
                        .HasColumnType("float");

                    b.Property<double>("Cost")
                        .HasColumnType("float");

                    b.Property<long>("EmployeeId")
                        .HasColumnType("bigint");

                    b.Property<string>("OrderDate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("OrderPaidStatus")
                        .HasColumnType("bit");

                    b.Property<double>("OrderPaymentAmount")
                        .HasColumnType("float");

                    b.Property<double>("OrderTotalPrice")
                        .HasColumnType("float");

                    b.HasKey("OrderSalesId");

                    b.ToTable("OrderSales");
                });

            modelBuilder.Entity("inventory_rest_api.Models.PaymentPurchase", b =>
                {
                    b.Property<long>("PaymentPurchaseId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("PaymentAmount")
                        .HasColumnType("float");

                    b.Property<string>("PaymentPurchaseDate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("PurchaseId")
                        .HasColumnType("bigint");

                    b.HasKey("PaymentPurchaseId");

                    b.HasIndex("PurchaseId");

                    b.ToTable("PaymentPurchases");
                });

            modelBuilder.Entity("inventory_rest_api.Models.PaymentSales", b =>
                {
                    b.Property<long>("PaymentSalesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("PaymentAmount")
                        .HasColumnType("float");

                    b.Property<string>("PaymentSalesDate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("SalesId")
                        .HasColumnType("bigint");

                    b.HasKey("PaymentSalesId");

                    b.HasIndex("SalesId");

                    b.ToTable("PaymentSales");
                });

            modelBuilder.Entity("inventory_rest_api.Models.Product", b =>
                {
                    b.Property<long>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ProductCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProductName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("ProductPrice")
                        .HasColumnType("float");

                    b.Property<double>("SalestPrice")
                        .HasColumnType("float");

                    b.Property<int>("TotalProductInStock")
                        .HasColumnType("int");

                    b.Property<int>("TotalProducts")
                        .HasColumnType("int");

                    b.HasKey("ProductId");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("inventory_rest_api.Models.ProductPurchaseHistory", b =>
                {
                    b.Property<long>("ProductPurchaseHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Date")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("PerProductPurchasePrice")
                        .HasColumnType("float");

                    b.Property<double>("PerProductSalesPrice")
                        .HasColumnType("float");

                    b.Property<long>("ProductId")
                        .HasColumnType("bigint");

                    b.Property<int>("ProductQuantity")
                        .HasColumnType("int");

                    b.HasKey("ProductPurchaseHistoryId");

                    b.HasIndex("ProductId");

                    b.ToTable("ProductPurchaseHistories");
                });

            modelBuilder.Entity("inventory_rest_api.Models.Purchase", b =>
                {
                    b.Property<long>("PurchaseId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("ProductId")
                        .HasColumnType("bigint");

                    b.Property<int>("ProductQuantity")
                        .HasColumnType("int");

                    b.Property<string>("PurchaseDate")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("PurchaseDiscount")
                        .HasColumnType("float");

                    b.Property<string>("PurchaseDuePaymentDate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PurchasePaidStatus")
                        .HasColumnType("bit");

                    b.Property<double>("PurchasePaymentAmount")
                        .HasColumnType("float");

                    b.Property<double>("PurchasePrice")
                        .HasColumnType("float");

                    b.Property<double>("SalesPrice")
                        .HasColumnType("float");

                    b.Property<long>("SupplierId")
                        .HasColumnType("bigint");

                    b.HasKey("PurchaseId");

                    b.HasIndex("ProductId");

                    b.ToTable("Purchases");
                });

            modelBuilder.Entity("inventory_rest_api.Models.PurchaseDueProduct", b =>
                {
                    b.Property<long>("PurchaseDueProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("ProductPurchaseHistoryId")
                        .HasColumnType("bigint");

                    b.Property<int>("ProductQuantity")
                        .HasColumnType("int");

                    b.Property<long>("PurchaseId")
                        .HasColumnType("bigint");

                    b.HasKey("PurchaseDueProductId");

                    b.HasIndex("ProductPurchaseHistoryId")
                        .IsUnique();

                    b.HasIndex("PurchaseId")
                        .IsUnique();

                    b.ToTable("PurchaseDueProducts");
                });

            modelBuilder.Entity("inventory_rest_api.Models.PurchaseHistory", b =>
                {
                    b.Property<long>("PurchaseHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("ProductQuantity")
                        .HasColumnType("int");

                    b.Property<long>("PurchaseId")
                        .HasColumnType("bigint");

                    b.Property<string>("ReceptionDate")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("PurchaseHistoryId");

                    b.HasIndex("PurchaseId");

                    b.ToTable("PurchaseHistories");
                });

            modelBuilder.Entity("inventory_rest_api.Models.Salary", b =>
                {
                    b.Property<long>("SalaryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("EmployeeId")
                        .HasColumnType("bigint");

                    b.Property<double>("SalaryAmount")
                        .HasColumnType("float");

                    b.Property<long>("SalaryPaymentDate")
                        .HasColumnType("bigint");

                    b.HasKey("SalaryId");

                    b.HasIndex("EmployeeId");

                    b.ToTable("Salaries");
                });

            modelBuilder.Entity("inventory_rest_api.Models.Sales", b =>
                {
                    b.Property<long>("SalesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("CustomerId")
                        .HasColumnType("bigint");

                    b.Property<string>("SalesDate")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<long?>("SalesDueProductId")
                        .HasColumnType("bigint");

                    b.Property<bool>("SalesPaidStatus")
                        .HasColumnType("bit");

                    b.Property<double>("SalesPaymentAmount")
                        .HasColumnType("float");

                    b.Property<double>("SalesPrice")
                        .HasColumnType("float");

                    b.HasKey("SalesId");

                    b.HasIndex("SalesDueProductId");

                    b.ToTable("Sales");
                });

            modelBuilder.Entity("inventory_rest_api.Models.SalesDueProduct", b =>
                {
                    b.Property<long>("SalesDueProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("ProductQuantity")
                        .HasColumnType("int");

                    b.Property<long>("SalesProductId")
                        .HasColumnType("bigint");

                    b.HasKey("SalesDueProductId");

                    b.HasIndex("SalesProductId")
                        .IsUnique();

                    b.ToTable("SalesDueProducts");
                });

            modelBuilder.Entity("inventory_rest_api.Models.SalesHistory", b =>
                {
                    b.Property<long>("SalesHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("DeliveryDate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ProductQuantity")
                        .HasColumnType("int");

                    b.Property<long>("SalesId")
                        .HasColumnType("bigint");

                    b.HasKey("SalesHistoryId");

                    b.HasIndex("SalesId");

                    b.ToTable("SalesHistories");
                });

            modelBuilder.Entity("inventory_rest_api.Models.SalesMemoHistory", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("CustomerId")
                        .HasColumnType("bigint");

                    b.Property<string>("MemoDigitalPrint")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MemoIssueDate")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesIds")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("SalesMemoHistoryId")
                        .HasColumnType("bigint");

                    b.Property<int?>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("SalesMemoHistory");
                });

            modelBuilder.Entity("inventory_rest_api.Models.SalesProduct", b =>
                {
                    b.Property<long>("SalesProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("PerProductPrice")
                        .HasColumnType("float");

                    b.Property<long>("ProductPurchaseHistoryId")
                        .HasColumnType("bigint");

                    b.Property<int>("ProductQuantity")
                        .HasColumnType("int");

                    b.Property<long>("SalesId")
                        .HasColumnType("bigint");

                    b.HasKey("SalesProductId");

                    b.HasIndex("ProductPurchaseHistoryId");

                    b.HasIndex("SalesId");

                    b.ToTable("SalesProducts");
                });

            modelBuilder.Entity("inventory_rest_api.Models.Supplier", b =>
                {
                    b.Property<long>("SupplierId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("CompanyId")
                        .HasColumnType("bigint");

                    b.Property<string>("SupplierAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SupplierContact")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SupplierName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("SupplierId");

                    b.HasIndex("CompanyId");

                    b.ToTable("Suppliers");
                });

            modelBuilder.Entity("inventory_rest_api.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("AdminRole")
                        .HasColumnType("int");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("HasSuperAdminRole")
                        .HasColumnType("bit");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("PasswordHash")
                        .HasColumnType("varbinary(max)");

                    b.Property<byte[]>("PasswordSalt")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("UserEmail")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("inventory_rest_api.Models.Damage", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Customer", "Customer")
                        .WithMany("Damages")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("inventory_rest_api.Models.Employee", "Employee")
                        .WithMany("Damages")
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("inventory_rest_api.Models.Product", "Product")
                        .WithMany("Damages")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("inventory_rest_api.Models.Supplier", "Supplier")
                        .WithMany("Damages")
                        .HasForeignKey("SupplierId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.DamageDeliveryHistory", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Damage", "Damage")
                        .WithMany("DamageDeliveryHistories")
                        .HasForeignKey("DamageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.DamageReceptionHistory", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Damage", "Damage")
                        .WithMany("DamageReceptionHistories")
                        .HasForeignKey("DamageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.OrderPayment", b =>
                {
                    b.HasOne("inventory_rest_api.Models.OrderSales", "orderSales")
                        .WithMany("OrderPayments")
                        .HasForeignKey("OrderSalesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.OrderProduct", b =>
                {
                    b.HasOne("inventory_rest_api.Models.OrderSales", "OrderSales")
                        .WithMany("OrderProduct")
                        .HasForeignKey("OrderSalesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("inventory_rest_api.Models.ProductPurchaseHistory", "ProductPurchaseHistory")
                        .WithMany()
                        .HasForeignKey("ProductPurchaseHistoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.PaymentPurchase", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Purchase", "Purchase")
                        .WithMany("PaymentPurchases")
                        .HasForeignKey("PurchaseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.PaymentSales", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Sales", "Sales")
                        .WithMany("PaymentSales")
                        .HasForeignKey("SalesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.ProductPurchaseHistory", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Product", "Product")
                        .WithMany("ProductPurchaseHistories")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.Purchase", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Product", "Product")
                        .WithMany("Purchases")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.PurchaseDueProduct", b =>
                {
                    b.HasOne("inventory_rest_api.Models.ProductPurchaseHistory", "ProductPurchaseHistory")
                        .WithOne("PurchaseDueProduct")
                        .HasForeignKey("inventory_rest_api.Models.PurchaseDueProduct", "ProductPurchaseHistoryId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("inventory_rest_api.Models.Purchase", "Purchase")
                        .WithOne("PurchaseDueProduct")
                        .HasForeignKey("inventory_rest_api.Models.PurchaseDueProduct", "PurchaseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.PurchaseHistory", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Purchase", "Purchase")
                        .WithMany("PurchaseHistories")
                        .HasForeignKey("PurchaseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.Salary", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Employee", "Employee")
                        .WithMany("Salaries")
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.Sales", b =>
                {
                    b.HasOne("inventory_rest_api.Models.SalesDueProduct", "SalesDueProduct")
                        .WithMany()
                        .HasForeignKey("SalesDueProductId");
                });

            modelBuilder.Entity("inventory_rest_api.Models.SalesDueProduct", b =>
                {
                    b.HasOne("inventory_rest_api.Models.SalesProduct", "SalesProduct")
                        .WithOne("SalesDueProduct")
                        .HasForeignKey("inventory_rest_api.Models.SalesDueProduct", "SalesProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.SalesHistory", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Sales", "Sales")
                        .WithMany("SalesHistories")
                        .HasForeignKey("SalesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.SalesMemoHistory", b =>
                {
                    b.HasOne("inventory_rest_api.Models.User", "User")
                        .WithMany("SalesMemoHistories")
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("inventory_rest_api.Models.SalesProduct", b =>
                {
                    b.HasOne("inventory_rest_api.Models.ProductPurchaseHistory", "ProductPurchaseHistory")
                        .WithMany("SalesProducts")
                        .HasForeignKey("ProductPurchaseHistoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("inventory_rest_api.Models.Sales", "Sales")
                        .WithMany("SalesProducts")
                        .HasForeignKey("SalesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("inventory_rest_api.Models.Supplier", b =>
                {
                    b.HasOne("inventory_rest_api.Models.Company", "Company")
                        .WithMany("Suppliers")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
