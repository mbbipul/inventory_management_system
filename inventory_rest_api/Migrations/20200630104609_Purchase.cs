using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace inventory_rest_api.Migrations
{
    public partial class Purchase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Purchases",
                columns: table => new
                {
                    PurchaseId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplierId = table.Column<long>(nullable: false),
                    ProductId = table.Column<long>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    PurchaseDate = table.Column<DateTime>(nullable: false),
                    PurchasePrice = table.Column<long>(nullable: false),
                    SalesPrice = table.Column<long>(nullable: false),
                    PurchasePaymentAmount = table.Column<long>(nullable: false),
                    PurchasePaidStatus = table.Column<bool>(nullable: false),
                    PurchaseDuePaymentDate = table.Column<DateTime>(nullable: false),
                    PurchaseDiscount = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Purchases", x => x.PurchaseId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Purchases");
        }
    }
}
