using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTable_DeleteColumnAddressesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Tours_ToursId",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "ToursId",
                table: "Addresses",
                newName: "ToursModelId");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_ToursId",
                table: "Addresses",
                newName: "IX_Addresses_ToursModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Tours_ToursModelId",
                table: "Addresses",
                column: "ToursModelId",
                principalTable: "Tours",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Tours_ToursModelId",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "ToursModelId",
                table: "Addresses",
                newName: "ToursId");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_ToursModelId",
                table: "Addresses",
                newName: "IX_Addresses_ToursId");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Tours_ToursId",
                table: "Addresses",
                column: "ToursId",
                principalTable: "Tours",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
