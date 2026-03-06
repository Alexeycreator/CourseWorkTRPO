using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTableTransfers_RemoveAddColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Transfers_Route",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "Route",
                table: "Transfers");

            migrationBuilder.AddColumn<string>(
                name: "Arrival",
                table: "Transfers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Departure",
                table: "Transfers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Arrival",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "Departure",
                table: "Transfers");

            migrationBuilder.AddColumn<string>(
                name: "Route",
                table: "Transfers",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_Route",
                table: "Transfers",
                column: "Route");
        }
    }
}
