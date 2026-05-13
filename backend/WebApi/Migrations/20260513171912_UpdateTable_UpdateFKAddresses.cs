using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTable_UpdateFKAddresses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Passports_PassportId",
                table: "Addresses");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Passports_PassportId",
                table: "Addresses",
                column: "PassportId",
                principalTable: "Passports",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Passports_PassportId",
                table: "Addresses");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Passports_PassportId",
                table: "Addresses",
                column: "PassportId",
                principalTable: "Passports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
