﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace inventory_rest_api.Migrations
{
    public partial class v1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    CompanyId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyName = table.Column<string>(nullable: false),
                    CompanyAddress = table.Column<string>(nullable: false),
                    CompanyContact = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.CompanyId);
                });

            migrationBuilder.CreateTable(
                name: "Costs",
                columns: table => new
                {
                    CostId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CostType = table.Column<string>(nullable: false),
                    Date = table.Column<string>(nullable: false),
                    CostAmount = table.Column<long>(nullable: false),
                    CostDescription = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Costs", x => x.CostId);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    CustomerId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerName = table.Column<string>(nullable: false),
                    CustomerEmail = table.Column<string>(nullable: true),
                    CustomerContact = table.Column<string>(nullable: false),
                    CustomerAddress = table.Column<string>(nullable: false),
                    CustomerJoinDate = table.Column<string>(nullable: false),
                    CustomerNID = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.CustomerId);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmployeeId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeName = table.Column<string>(nullable: false),
                    EmployeeEmail = table.Column<string>(nullable: true),
                    EmployeeContact = table.Column<string>(nullable: false),
                    EmployeeAddress = table.Column<string>(nullable: false),
                    Date = table.Column<string>(nullable: false),
                    EmployeeNID = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeId);
                });

            migrationBuilder.CreateTable(
                name: "ProductCategories",
                columns: table => new
                {
                    ProductCategoryId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductCategoryName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategories", x => x.ProductCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Suppliers",
                columns: table => new
                {
                    SupplierId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<long>(nullable: false),
                    SupplierName = table.Column<string>(nullable: false),
                    SupplierAddress = table.Column<string>(nullable: false),
                    SupplierContact = table.Column<string>(nullable: false),
                    SupplierEmail = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.SupplierId);
                    table.ForeignKey(
                        name: "FK_Suppliers_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Salaries",
                columns: table => new
                {
                    SalaryId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<long>(nullable: false),
                    SalaryAmount = table.Column<long>(nullable: false),
                    SalaryPaymentDate = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Salaries", x => x.SalaryId);
                    table.ForeignKey(
                        name: "FK_Salaries_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductName = table.Column<string>(nullable: false),
                    ProductCode = table.Column<string>(nullable: false),
                    ProductCategoryId = table.Column<long>(nullable: false),
                    TotalProducts = table.Column<int>(nullable: false),
                    TotalProductInStock = table.Column<int>(nullable: false),
                    ProductPrice = table.Column<long>(nullable: false),
                    SalestPrice = table.Column<long>(nullable: false),
                    ProductDetails = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductId);
                    table.ForeignKey(
                        name: "FK_Products_ProductCategories_ProductCategoryId",
                        column: x => x.ProductCategoryId,
                        principalTable: "ProductCategories",
                        principalColumn: "ProductCategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Damages",
                columns: table => new
                {
                    DamageId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<long>(nullable: false),
                    CustomerId = table.Column<long>(nullable: false),
                    EmployeeId = table.Column<long>(nullable: false),
                    SupplierId = table.Column<long>(nullable: false),
                    DamageRetDate = table.Column<string>(nullable: true),
                    ProductQuantity = table.Column<int>(nullable: false),
                    DamageProductAmount = table.Column<long>(nullable: false),
                    DamageSentToCompanyStatus = table.Column<string>(nullable: true),
                    DamageSentToCompanyDate = table.Column<string>(nullable: true),
                    DamageRetFromCompanyDate = table.Column<string>(nullable: true),
                    DamageRetFromComAmount = table.Column<long>(nullable: false),
                    DamageRetComProQuantity = table.Column<long>(nullable: false),
                    DamageRetComProQuantityDueStatus = table.Column<bool>(nullable: false),
                    DamgeReturnCompanyDueAmount = table.Column<long>(nullable: false),
                    DamgeReturnCompanyDuePaymentStatus = table.Column<bool>(nullable: false),
                    DamgeReturnCompanyDueDate = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Damages", x => x.DamageId);
                    table.ForeignKey(
                        name: "FK_Damages_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "CustomerId");
                    table.ForeignKey(
                        name: "FK_Damages_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId");
                    table.ForeignKey(
                        name: "FK_Damages_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId");
                    table.ForeignKey(
                        name: "FK_Damages_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "SupplierId");
                });

            migrationBuilder.CreateTable(
                name: "ProductPurchaseHistories",
                columns: table => new
                {
                    ProductPurchaseHistoryId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<long>(nullable: false),
                    PerProductPurchasePrice = table.Column<long>(nullable: false),
                    PerProductSalesPrice = table.Column<long>(nullable: false),
                    Date = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPurchaseHistories", x => x.ProductPurchaseHistoryId);
                    table.ForeignKey(
                        name: "FK_ProductPurchaseHistories_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Purchases",
                columns: table => new
                {
                    PurchaseId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplierId = table.Column<long>(nullable: false),
                    ProductId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    PurchaseDate = table.Column<string>(nullable: false),
                    PurchasePrice = table.Column<long>(nullable: false),
                    SalesPrice = table.Column<long>(nullable: false),
                    PurchasePaymentAmount = table.Column<long>(nullable: false),
                    PurchasePaidStatus = table.Column<bool>(nullable: false),
                    PurchaseDuePaymentDate = table.Column<string>(nullable: true),
                    PurchaseDiscount = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Purchases", x => x.PurchaseId);
                    table.ForeignKey(
                        name: "FK_Purchases_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DamageDeliveryHistories",
                columns: table => new
                {
                    DamageDeliveryHistoryId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DamageId = table.Column<long>(nullable: false),
                    DeliverProductQuantity = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DamageDeliveryHistories", x => x.DamageDeliveryHistoryId);
                    table.ForeignKey(
                        name: "FK_DamageDeliveryHistories_Damages_DamageId",
                        column: x => x.DamageId,
                        principalTable: "Damages",
                        principalColumn: "DamageId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DamageReceptionHistories",
                columns: table => new
                {
                    DamageReceptionHistoryId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DamageId = table.Column<long>(nullable: false),
                    RecievedProductQuantity = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DamageReceptionHistories", x => x.DamageReceptionHistoryId);
                    table.ForeignKey(
                        name: "FK_DamageReceptionHistories_Damages_DamageId",
                        column: x => x.DamageId,
                        principalTable: "Damages",
                        principalColumn: "DamageId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sales",
                columns: table => new
                {
                    SalesId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerId = table.Column<long>(nullable: false),
                    ProductId = table.Column<long>(nullable: false),
                    ProductPurchaseHistoryId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    SalesDate = table.Column<string>(nullable: false),
                    SalesPrice = table.Column<long>(nullable: false),
                    SalesPaymentAmount = table.Column<long>(nullable: false),
                    SalesDueAmount = table.Column<long>(nullable: false),
                    SalesPaidStatus = table.Column<bool>(nullable: false),
                    SalesDuePaymentDate = table.Column<string>(nullable: true),
                    SalesDiscount = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sales", x => x.SalesId);
                    table.ForeignKey(
                        name: "FK_Sales_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Sales_ProductPurchaseHistories_ProductPurchaseHistoryId",
                        column: x => x.ProductPurchaseHistoryId,
                        principalTable: "ProductPurchaseHistories",
                        principalColumn: "ProductPurchaseHistoryId");
                });

            migrationBuilder.CreateTable(
                name: "PaymentPurchases",
                columns: table => new
                {
                    PaymentPurchaseId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PurchaseId = table.Column<long>(nullable: false),
                    PaymentPurchaseDate = table.Column<string>(nullable: true),
                    PaymentAmount = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentPurchases", x => x.PaymentPurchaseId);
                    table.ForeignKey(
                        name: "FK_PaymentPurchases_Purchases_PurchaseId",
                        column: x => x.PurchaseId,
                        principalTable: "Purchases",
                        principalColumn: "PurchaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PurchaseDueProducts",
                columns: table => new
                {
                    PurchaseDueProductId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PurchaseId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseDueProducts", x => x.PurchaseDueProductId);
                    table.ForeignKey(
                        name: "FK_PurchaseDueProducts_Purchases_PurchaseId",
                        column: x => x.PurchaseId,
                        principalTable: "Purchases",
                        principalColumn: "PurchaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PurchaseHistories",
                columns: table => new
                {
                    PurchaseHistoryId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PurchaseId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    ReceptionDate = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseHistories", x => x.PurchaseHistoryId);
                    table.ForeignKey(
                        name: "FK_PurchaseHistories_Purchases_PurchaseId",
                        column: x => x.PurchaseId,
                        principalTable: "Purchases",
                        principalColumn: "PurchaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OrderId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerId = table.Column<long>(nullable: false),
                    ProductId = table.Column<long>(nullable: false),
                    SalesId = table.Column<long>(nullable: false),
                    OrderDate = table.Column<string>(nullable: true),
                    OrderStaus = table.Column<string>(nullable: true),
                    OrderProductQuantity = table.Column<int>(nullable: false),
                    MiscellaneousCost = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_Orders_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "CustomerId");
                    table.ForeignKey(
                        name: "FK_Orders_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId");
                    table.ForeignKey(
                        name: "FK_Orders_Sales_SalesId",
                        column: x => x.SalesId,
                        principalTable: "Sales",
                        principalColumn: "SalesId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PaymentSales",
                columns: table => new
                {
                    PaymentSalesId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesId = table.Column<long>(nullable: false),
                    PaymentSalesDate = table.Column<string>(nullable: true),
                    PaymentAmount = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentSales", x => x.PaymentSalesId);
                    table.ForeignKey(
                        name: "FK_PaymentSales_Sales_SalesId",
                        column: x => x.SalesId,
                        principalTable: "Sales",
                        principalColumn: "SalesId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SalesDueProducts",
                columns: table => new
                {
                    SalesDueProductId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesDueProducts", x => x.SalesDueProductId);
                    table.ForeignKey(
                        name: "FK_SalesDueProducts_Sales_SalesId",
                        column: x => x.SalesId,
                        principalTable: "Sales",
                        principalColumn: "SalesId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SalesHistories",
                columns: table => new
                {
                    SalesHistoryId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    DeliveryDate = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesHistories", x => x.SalesHistoryId);
                    table.ForeignKey(
                        name: "FK_SalesHistories_Sales_SalesId",
                        column: x => x.SalesId,
                        principalTable: "Sales",
                        principalColumn: "SalesId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DamageDeliveryHistories_DamageId",
                table: "DamageDeliveryHistories",
                column: "DamageId");

            migrationBuilder.CreateIndex(
                name: "IX_DamageReceptionHistories_DamageId",
                table: "DamageReceptionHistories",
                column: "DamageId");

            migrationBuilder.CreateIndex(
                name: "IX_Damages_CustomerId",
                table: "Damages",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Damages_EmployeeId",
                table: "Damages",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Damages_ProductId",
                table: "Damages",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Damages_SupplierId",
                table: "Damages",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ProductId",
                table: "Orders",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_SalesId",
                table: "Orders",
                column: "SalesId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PaymentPurchases_PurchaseId",
                table: "PaymentPurchases",
                column: "PurchaseId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentSales_SalesId",
                table: "PaymentSales",
                column: "SalesId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPurchaseHistories_ProductId",
                table: "ProductPurchaseHistories",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductCategoryId",
                table: "Products",
                column: "ProductCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseDueProducts_PurchaseId",
                table: "PurchaseDueProducts",
                column: "PurchaseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseHistories_PurchaseId",
                table: "PurchaseHistories",
                column: "PurchaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Purchases_ProductId",
                table: "Purchases",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Salaries_EmployeeId",
                table: "Salaries",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Sales_ProductId",
                table: "Sales",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Sales_ProductPurchaseHistoryId",
                table: "Sales",
                column: "ProductPurchaseHistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesDueProducts_SalesId",
                table: "SalesDueProducts",
                column: "SalesId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SalesHistories_SalesId",
                table: "SalesHistories",
                column: "SalesId");

            migrationBuilder.CreateIndex(
                name: "IX_Suppliers_CompanyId",
                table: "Suppliers",
                column: "CompanyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Costs");

            migrationBuilder.DropTable(
                name: "DamageDeliveryHistories");

            migrationBuilder.DropTable(
                name: "DamageReceptionHistories");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "PaymentPurchases");

            migrationBuilder.DropTable(
                name: "PaymentSales");

            migrationBuilder.DropTable(
                name: "PurchaseDueProducts");

            migrationBuilder.DropTable(
                name: "PurchaseHistories");

            migrationBuilder.DropTable(
                name: "Salaries");

            migrationBuilder.DropTable(
                name: "SalesDueProducts");

            migrationBuilder.DropTable(
                name: "SalesHistories");

            migrationBuilder.DropTable(
                name: "Damages");

            migrationBuilder.DropTable(
                name: "Purchases");

            migrationBuilder.DropTable(
                name: "Sales");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Suppliers");

            migrationBuilder.DropTable(
                name: "ProductPurchaseHistories");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "ProductCategories");
        }
    }
}
