using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDeleteBehaivorFK_AlterDeleteBehaivor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyRates_Tickets_CurrencyRates_CurrencyRates_Id",
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyRates_Tickets_Tickets_Tickets_Id",
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Tickets_Tickets_Id",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Addresses_Address_Id",
                table: "Hotels");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Tickets_Tickets_Id",
                table: "Hotels");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Clients_Client_Id",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tours_Tickets_Tickets_Id",
                table: "Tours");

            migrationBuilder.DropForeignKey(
                name: "FK_Tours_Transfers_Transfers_Id",
                table: "Tours");

            migrationBuilder.AlterColumn<int>(
                name: "Transfers_Id",
                table: "Tours",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "Tickets_Id",
                table: "Tours",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "Client_Id",
                table: "Tickets",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "Tickets_Id",
                table: "Hotels",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "Address_Id",
                table: "Hotels",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "Tickets_Id",
                table: "Employees",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "Tickets_Id",
                table: "CurrencyRates_Tickets",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CurrencyRates_Id",
                table: "CurrencyRates_Tickets",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "Passport_Id",
                table: "Clients",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_CurrencyRates_Tickets_CurrencyRates_CurrencyRates_Id",
                table: "CurrencyRates_Tickets",
                column: "CurrencyRates_Id",
                principalTable: "CurrencyRates",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_CurrencyRates_Tickets_Tickets_Tickets_Id",
                table: "CurrencyRates_Tickets",
                column: "Tickets_Id",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Tickets_Tickets_Id",
                table: "Employees",
                column: "Tickets_Id",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Addresses_Address_Id",
                table: "Hotels",
                column: "Address_Id",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Tickets_Tickets_Id",
                table: "Hotels",
                column: "Tickets_Id",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Clients_Client_Id",
                table: "Tickets",
                column: "Client_Id",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_Tickets_Tickets_Id",
                table: "Tours",
                column: "Tickets_Id",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_Transfers_Transfers_Id",
                table: "Tours",
                column: "Transfers_Id",
                principalTable: "Transfers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyRates_Tickets_CurrencyRates_CurrencyRates_Id",
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyRates_Tickets_Tickets_Tickets_Id",
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Tickets_Tickets_Id",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Addresses_Address_Id",
                table: "Hotels");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Tickets_Tickets_Id",
                table: "Hotels");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Clients_Client_Id",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tours_Tickets_Tickets_Id",
                table: "Tours");

            migrationBuilder.DropForeignKey(
                name: "FK_Tours_Transfers_Transfers_Id",
                table: "Tours");

            migrationBuilder.AlterColumn<int>(
                name: "Transfers_Id",
                table: "Tours",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Tickets_Id",
                table: "Tours",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Client_Id",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Tickets_Id",
                table: "Hotels",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Address_Id",
                table: "Hotels",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Tickets_Id",
                table: "Employees",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Tickets_Id",
                table: "CurrencyRates_Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CurrencyRates_Id",
                table: "CurrencyRates_Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Passport_Id",
                table: "Clients",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CurrencyRates_Tickets_CurrencyRates_CurrencyRates_Id",
                table: "CurrencyRates_Tickets",
                column: "CurrencyRates_Id",
                principalTable: "CurrencyRates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CurrencyRates_Tickets_Tickets_Tickets_Id",
                table: "CurrencyRates_Tickets",
                column: "Tickets_Id",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Tickets_Tickets_Id",
                table: "Employees",
                column: "Tickets_Id",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Addresses_Address_Id",
                table: "Hotels",
                column: "Address_Id",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Tickets_Tickets_Id",
                table: "Hotels",
                column: "Tickets_Id",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Clients_Client_Id",
                table: "Tickets",
                column: "Client_Id",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_Tickets_Tickets_Id",
                table: "Tours",
                column: "Tickets_Id",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_Transfers_Transfers_Id",
                table: "Tours",
                column: "Transfers_Id",
                principalTable: "Transfers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
