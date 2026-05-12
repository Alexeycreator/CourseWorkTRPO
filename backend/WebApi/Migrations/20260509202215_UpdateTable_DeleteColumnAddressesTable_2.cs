using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTable_DeleteColumnAddressesTable_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Tours_ToursModelId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_ToursModelId",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "ToursModelId",
                table: "Addresses");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ToursModelId",
                table: "Addresses",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_ToursModelId",
                table: "Addresses",
                column: "ToursModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Tours_ToursModelId",
                table: "Addresses",
                column: "ToursModelId",
                principalTable: "Tours",
                principalColumn: "Id");
        }
    }
}
