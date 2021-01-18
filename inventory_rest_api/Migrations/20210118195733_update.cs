using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace inventory_rest_api.Migrations
{
    public partial class update : Migration
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
                    CostAmount = table.Column<double>(nullable: false),
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
                    CustomerContact = table.Column<string>(nullable: false),
                    CustomerAddress = table.Column<string>(nullable: false),
                    CustomerJoinDate = table.Column<string>(nullable: false)
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
                    EmployeeContact = table.Column<string>(nullable: false),
                    EmployeeAddress = table.Column<string>(nullable: false),
                    Date = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeId);
                });

            migrationBuilder.CreateTable(
                name: "OrderSales",
                columns: table => new
                {
                    OrderSalesId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<long>(nullable: false),
                    OrderDate = table.Column<string>(nullable: true),
                    OrderTotalPrice = table.Column<double>(nullable: false),
                    OrderPaymentAmount = table.Column<double>(nullable: false),
                    OrderPaidStatus = table.Column<bool>(nullable: false),
                    Commission = table.Column<double>(nullable: false),
                    Cost = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderSales", x => x.OrderSalesId);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductName = table.Column<string>(nullable: false),
                    ProductCode = table.Column<string>(nullable: false),
                    TotalProducts = table.Column<int>(nullable: false),
                    TotalProductInStock = table.Column<int>(nullable: false),
                    ProductPrice = table.Column<double>(nullable: false),
                    SalestPrice = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    UserEmail = table.Column<string>(nullable: true),
                    AdminRole = table.Column<int>(nullable: false),
                    HasSuperAdminRole = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<byte[]>(nullable: true),
                    PasswordSalt = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
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
                    SupplierContact = table.Column<string>(nullable: false)
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
                    SalaryAmount = table.Column<double>(nullable: false),
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
                name: "OrderPayments",
                columns: table => new
                {
                    OrderPaymentId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderSalesId = table.Column<long>(nullable: false),
                    PaymentOrderSalesDate = table.Column<string>(nullable: true),
                    PaymentAmount = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderPayments", x => x.OrderPaymentId);
                    table.ForeignKey(
                        name: "FK_OrderPayments_OrderSales_OrderSalesId",
                        column: x => x.OrderSalesId,
                        principalTable: "OrderSales",
                        principalColumn: "OrderSalesId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductPurchaseHistories",
                columns: table => new
                {
                    ProductPurchaseHistoryId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    PerProductPurchasePrice = table.Column<double>(nullable: false),
                    PerProductSalesPrice = table.Column<double>(nullable: false),
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
                    PurchasePrice = table.Column<double>(nullable: false),
                    SalesPrice = table.Column<double>(nullable: false),
                    PurchasePaymentAmount = table.Column<double>(nullable: false),
                    PurchasePaidStatus = table.Column<bool>(nullable: false),
                    PurchaseDuePaymentDate = table.Column<string>(nullable: true),
                    PurchaseDiscount = table.Column<double>(nullable: false)
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
                name: "SalesMemoHistory",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesMemoHistoryId = table.Column<long>(nullable: false),
                    MemoIssueDate = table.Column<string>(nullable: true),
                    CustomerId = table.Column<long>(nullable: false),
                    SalesIds = table.Column<string>(nullable: true),
                    MemoDigitalPrint = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesMemoHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SalesMemoHistory_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
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
                    DamageProductAmount = table.Column<double>(nullable: false),
                    DamageSentToCompanyStatus = table.Column<string>(nullable: true),
                    DamageSentToCompanyDate = table.Column<string>(nullable: true),
                    DamageRetFromCompanyDate = table.Column<string>(nullable: true),
                    DamageRetFromComAmount = table.Column<double>(nullable: false),
                    DamageRetComProQuantity = table.Column<int>(nullable: false),
                    DamageRetComProQuantityDueStatus = table.Column<bool>(nullable: false),
                    DamgeReturnCompanyDueAmount = table.Column<double>(nullable: false),
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
                name: "OrderProducts",
                columns: table => new
                {
                    OrderProductId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductPurchaseHistoryId = table.Column<long>(nullable: false),
                    OrderSalesId = table.Column<long>(nullable: false),
                    ProductQuantityProductQuantity = table.Column<int>(nullable: false),
                    ReturnQuantityProductQuantity = table.Column<int>(nullable: false),
                    DamageQuantityProductQuantity = table.Column<int>(nullable: false),
                    ProductRatePrice = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderProducts", x => x.OrderProductId);
                    table.ForeignKey(
                        name: "FK_OrderProducts_OrderSales_OrderSalesId",
                        column: x => x.OrderSalesId,
                        principalTable: "OrderSales",
                        principalColumn: "OrderSalesId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderProducts_ProductPurchaseHistories_ProductPurchaseHistoryId",
                        column: x => x.ProductPurchaseHistoryId,
                        principalTable: "ProductPurchaseHistories",
                        principalColumn: "ProductPurchaseHistoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PaymentPurchases",
                columns: table => new
                {
                    PaymentPurchaseId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PurchaseId = table.Column<long>(nullable: false),
                    PaymentPurchaseDate = table.Column<string>(nullable: true),
                    PaymentAmount = table.Column<double>(nullable: false)
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
                    ProductPurchaseHistoryId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseDueProducts", x => x.PurchaseDueProductId);
                    table.ForeignKey(
                        name: "FK_PurchaseDueProducts_ProductPurchaseHistories_ProductPurchaseHistoryId",
                        column: x => x.ProductPurchaseHistoryId,
                        principalTable: "ProductPurchaseHistories",
                        principalColumn: "ProductPurchaseHistoryId");
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
                    RecievedProductQuantity = table.Column<int>(nullable: false),
                    RecievedProductAmount = table.Column<double>(nullable: false)
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
                name: "SalesProducts",
                columns: table => new
                {
                    SalesProductId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesId = table.Column<long>(nullable: false),
                    ProductPurchaseHistoryId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    PerProductPrice = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesProducts", x => x.SalesProductId);
                    table.ForeignKey(
                        name: "FK_SalesProducts_ProductPurchaseHistories_ProductPurchaseHistoryId",
                        column: x => x.ProductPurchaseHistoryId,
                        principalTable: "ProductPurchaseHistories",
                        principalColumn: "ProductPurchaseHistoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SalesDueProducts",
                columns: table => new
                {
                    SalesDueProductId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesProductId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesDueProducts", x => x.SalesDueProductId);
                    table.ForeignKey(
                        name: "FK_SalesDueProducts_SalesProducts_SalesProductId",
                        column: x => x.SalesProductId,
                        principalTable: "SalesProducts",
                        principalColumn: "SalesProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sales",
                columns: table => new
                {
                    SalesId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerId = table.Column<long>(nullable: false),
                    SalesDate = table.Column<string>(nullable: false),
                    SalesPrice = table.Column<double>(nullable: false),
                    SalesPaymentAmount = table.Column<double>(nullable: false),
                    SalesPaidStatus = table.Column<bool>(nullable: false),
                    SalesDueProductId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sales", x => x.SalesId);
                    table.ForeignKey(
                        name: "FK_Sales_SalesDueProducts_SalesDueProductId",
                        column: x => x.SalesDueProductId,
                        principalTable: "SalesDueProducts",
                        principalColumn: "SalesDueProductId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PaymentSales",
                columns: table => new
                {
                    PaymentSalesId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesId = table.Column<long>(nullable: false),
                    PaymentSalesDate = table.Column<string>(nullable: true),
                    PaymentAmount = table.Column<double>(nullable: false)
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
                name: "IX_OrderPayments_OrderSalesId",
                table: "OrderPayments",
                column: "OrderSalesId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderProducts_OrderSalesId",
                table: "OrderProducts",
                column: "OrderSalesId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderProducts_ProductPurchaseHistoryId",
                table: "OrderProducts",
                column: "ProductPurchaseHistoryId");

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
                name: "IX_PurchaseDueProducts_ProductPurchaseHistoryId",
                table: "PurchaseDueProducts",
                column: "ProductPurchaseHistoryId",
                unique: true);

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
                name: "IX_Sales_SalesDueProductId",
                table: "Sales",
                column: "SalesDueProductId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesDueProducts_SalesProductId",
                table: "SalesDueProducts",
                column: "SalesProductId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SalesHistories_SalesId",
                table: "SalesHistories",
                column: "SalesId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesMemoHistory_UserId",
                table: "SalesMemoHistory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesProducts_ProductPurchaseHistoryId",
                table: "SalesProducts",
                column: "ProductPurchaseHistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesProducts_SalesId",
                table: "SalesProducts",
                column: "SalesId");

            migrationBuilder.CreateIndex(
                name: "IX_Suppliers_CompanyId",
                table: "Suppliers",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_SalesProducts_Sales_SalesId",
                table: "SalesProducts",
                column: "SalesId",
                principalTable: "Sales",
                principalColumn: "SalesId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductPurchaseHistories_Products_ProductId",
                table: "ProductPurchaseHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesProducts_ProductPurchaseHistories_ProductPurchaseHistoryId",
                table: "SalesProducts");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesProducts_Sales_SalesId",
                table: "SalesProducts");

            migrationBuilder.DropTable(
                name: "Costs");

            migrationBuilder.DropTable(
                name: "DamageDeliveryHistories");

            migrationBuilder.DropTable(
                name: "DamageReceptionHistories");

            migrationBuilder.DropTable(
                name: "OrderPayments");

            migrationBuilder.DropTable(
                name: "OrderProducts");

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
                name: "SalesHistories");

            migrationBuilder.DropTable(
                name: "SalesMemoHistory");

            migrationBuilder.DropTable(
                name: "Damages");

            migrationBuilder.DropTable(
                name: "OrderSales");

            migrationBuilder.DropTable(
                name: "Purchases");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Suppliers");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "ProductPurchaseHistories");

            migrationBuilder.DropTable(
                name: "Sales");

            migrationBuilder.DropTable(
                name: "SalesDueProducts");

            migrationBuilder.DropTable(
                name: "SalesProducts");
        }
    }
}
