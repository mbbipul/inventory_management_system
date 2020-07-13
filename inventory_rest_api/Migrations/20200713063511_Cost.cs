using Microsoft.EntityFrameworkCore.Migrations;

namespace inventory_rest_api.Migrations
{
    public partial class Cost : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Costs");
        }
    }
}
