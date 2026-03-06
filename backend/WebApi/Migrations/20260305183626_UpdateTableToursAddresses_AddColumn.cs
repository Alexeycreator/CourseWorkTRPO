using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTableToursAddresses_AddColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HotTour",
                table: "Tours",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Tours_Id",
                table: "Addresses",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Tours_Id",
                table: "Addresses",
                column: "Tours_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Tours_Tours_Id",
                table: "Addresses",
                column: "Tours_Id",
                principalTable: "Tours",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Tours_Tours_Id",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Tours_Id",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "HotTour",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "Tours_Id",
                table: "Addresses");
        }
    }
}
