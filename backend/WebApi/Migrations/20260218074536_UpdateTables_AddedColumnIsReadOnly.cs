using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTables_AddedColumnIsReadOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Transfers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Tours",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Tickets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Passports",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Hotels",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "HotelRooms",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Employees",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "CurrencyRates_Tickets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "CurrencyRates",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Clients",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Passports");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "HotelRooms");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "CurrencyRates");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Clients");
        }
    }
}
