using Microsoft.EntityFrameworkCore.Migrations;

namespace inventory_rest_api.Migrations
{
    public partial class Damage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "SupplierId",
                table: "Suppliers",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<long>(
                name: "DamageId",
                table: "Suppliers",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<long>(
                name: "ProductId",
                table: "Products",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<long>(
                name: "DamageId",
                table: "Products",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<long>(
                name: "EmployeeId",
                table: "Employees",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<long>(
                name: "DamageId",
                table: "Employees",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<long>(
                name: "CustomerId",
                table: "Customers",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<long>(
                name: "DamageId",
                table: "Customers",
                nullable: false,
                defaultValue: 0L);

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
                    DamageRetFromComAmount = table.Column<string>(nullable: true),
                    DamageRetComProQuantity = table.Column<long>(nullable: false),
                    DamageRetComProQuantityDueStatus = table.Column<bool>(nullable: false),
                    DamgeReturnCompanyDueAmount = table.Column<long>(nullable: false),
                    DamgeReturnCompanyDuePaymentStatus = table.Column<bool>(nullable: false),
                    DamgeReturnCompanyDueDate = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Damages", x => x.DamageId);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Damages_CustomerId",
                table: "Customers",
                column: "CustomerId",
                principalTable: "Damages",
                principalColumn: "DamageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Damages_EmployeeId",
                table: "Employees",
                column: "EmployeeId",
                principalTable: "Damages",
                principalColumn: "DamageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Damages_ProductId",
                table: "Products",
                column: "ProductId",
                principalTable: "Damages",
                principalColumn: "DamageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Suppliers_Damages_SupplierId",
                table: "Suppliers",
                column: "SupplierId",
                principalTable: "Damages",
                principalColumn: "DamageId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Damages_CustomerId",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Damages_EmployeeId",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Damages_ProductId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Suppliers_Damages_SupplierId",
                table: "Suppliers");

            migrationBuilder.DropTable(
                name: "Damages");

            migrationBuilder.DropColumn(
                name: "DamageId",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "DamageId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DamageId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "DamageId",
                table: "Customers");

            migrationBuilder.AlterColumn<long>(
                name: "SupplierId",
                table: "Suppliers",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long))
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<long>(
                name: "ProductId",
                table: "Products",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long))
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<long>(
                name: "EmployeeId",
                table: "Employees",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long))
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<long>(
                name: "CustomerId",
                table: "Customers",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long))
                .Annotation("SqlServer:Identity", "1, 1");
        }
    }
}
