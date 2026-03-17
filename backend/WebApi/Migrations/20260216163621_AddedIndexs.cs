using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddedIndexs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_Tours_Transfers_Id",
                table: "Tours",
                newName: "IX_Tours_TransfersId");

            migrationBuilder.RenameIndex(
                name: "IX_Tours_Tickets_Id",
                table: "Tours",
                newName: "IX_Tours_TicketsId");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_Client_Id",
                table: "Tickets",
                newName: "IX_Tickets_ClientId");

            migrationBuilder.RenameIndex(
                name: "IX_Hotels_Tickets_Id",
                table: "Hotels",
                newName: "IX_Hotels_TicketsId");

            migrationBuilder.RenameIndex(
                name: "IX_Hotels_HotelRooms_Id",
                table: "Hotels",
                newName: "IX_Hotels_HotelRoomsId");

            migrationBuilder.RenameIndex(
                name: "IX_Hotels_Address_Id",
                table: "Hotels",
                newName: "IX_Hotels_AddressId");

            migrationBuilder.RenameIndex(
                name: "IX_Employees_Tickets_Id",
                table: "Employees",
                newName: "IX_Employees_TicketsId");

            migrationBuilder.RenameIndex(
                name: "IX_CurrencyRates_Tickets_Tickets_Id",
                table: "CurrencyRates_Tickets",
                newName: "IX_CurrencyRatesTickets_TicketsId");

            migrationBuilder.RenameIndex(
                name: "IX_CurrencyRates_Tickets_CurrencyRates_Id",
                table: "CurrencyRates_Tickets",
                newName: "IX_CurrencyRatesTickets_CurrencyRatesId");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_Passport_Id",
                table: "Clients",
                newName: "IX_Clients_PassportId");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_Passport_Id",
                table: "Addresses",
                newName: "IX_Addresses_PassportId");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Passports",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_Name",
                table: "Transfers",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_Route",
                table: "Transfers",
                column: "Route");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Name",
                table: "Tours",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Route",
                table: "Tours",
                columns: new[] { "StartDot", "EndDot" });

            migrationBuilder.CreateIndex(
                name: "IX_Tours_TicketsTransfersId",
                table: "Tours",
                columns: new[] { "Tickets_Id", "Transfers_Id" });

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_DateSale",
                table: "Tickets",
                column: "DateSale");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_Price",
                table: "Tickets",
                column: "Price");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_Times",
                table: "Tickets",
                columns: new[] { "DepartureTime", "ArrivalTime" });

            migrationBuilder.CreateIndex(
                name: "IX_Passports_Seria_Number",
                table: "Passports",
                columns: new[] { "Seria", "Number" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Passports_Type",
                table: "Passports",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_Name",
                table: "Hotels",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_TicketsAddressesRoomsId",
                table: "Hotels",
                columns: new[] { "Tickets_Id", "Address_Id", "HotelRooms_Id" });

            migrationBuilder.CreateIndex(
                name: "IX_HotelRooms_NameRoom",
                table: "HotelRooms",
                column: "NameRoom");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_FullName",
                table: "Employees",
                columns: new[] { "SurName", "FirstName", "MiddleName" });

            migrationBuilder.CreateIndex(
                name: "IX_Employees_PhoneNumber",
                table: "Employees",
                column: "PhoneNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CurrencyRatesTickets_TicketsCurrencyRatesId",
                table: "CurrencyRates_Tickets",
                columns: new[] { "Tickets_Id", "CurrencyRates_Id" });

            migrationBuilder.CreateIndex(
                name: "IX_CurrencyRates_Currency",
                table: "CurrencyRates",
                column: "Currency");

            migrationBuilder.CreateIndex(
                name: "IX_CurrencyRates_LetterCode",
                table: "CurrencyRates",
                column: "LetterCode");

            migrationBuilder.CreateIndex(
                name: "IX_CurrencyRates_Rate",
                table: "CurrencyRates",
                column: "Rate");

            migrationBuilder.CreateIndex(
                name: "IX_Clients_Email",
                table: "Clients",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clients_FullName",
                table: "Clients",
                columns: new[] { "SurName", "FirstName", "MiddleName" });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_Login",
                table: "Clients",
                column: "Login",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clients_Password",
                table: "Clients",
                column: "Password");

            migrationBuilder.CreateIndex(
                name: "IX_Clients_PhoneNumber",
                table: "Clients",
                column: "PhoneNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Full",
                table: "Addresses",
                columns: new[] { "Country", "City", "Region", "Street", "House" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Transfers_Name",
                table: "Transfers");

            migrationBuilder.DropIndex(
                name: "IX_Transfers_Route",
                table: "Transfers");

            migrationBuilder.DropIndex(
                name: "IX_Tours_Name",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tours_Route",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tours_TicketsTransfersId",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_DateSale",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_Price",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_Times",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Passports_Seria_Number",
                table: "Passports");

            migrationBuilder.DropIndex(
                name: "IX_Passports_Type",
                table: "Passports");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_Name",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_TicketsAddressesRoomsId",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_HotelRooms_NameRoom",
                table: "HotelRooms");

            migrationBuilder.DropIndex(
                name: "IX_Employees_Email",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_FullName",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_PhoneNumber",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_CurrencyRatesTickets_TicketsCurrencyRatesId",
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropIndex(
                name: "IX_CurrencyRates_Currency",
                table: "CurrencyRates");

            migrationBuilder.DropIndex(
                name: "IX_CurrencyRates_LetterCode",
                table: "CurrencyRates");

            migrationBuilder.DropIndex(
                name: "IX_CurrencyRates_Rate",
                table: "CurrencyRates");

            migrationBuilder.DropIndex(
                name: "IX_Clients_Email",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Clients_FullName",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Clients_Login",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Clients_Password",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Clients_PhoneNumber",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Full",
                table: "Addresses");

            migrationBuilder.RenameIndex(
                name: "IX_Tours_TransfersId",
                table: "Tours",
                newName: "IX_Tours_Transfers_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Tours_TicketsId",
                table: "Tours",
                newName: "IX_Tours_Tickets_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_ClientId",
                table: "Tickets",
                newName: "IX_Tickets_Client_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Hotels_TicketsId",
                table: "Hotels",
                newName: "IX_Hotels_Tickets_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Hotels_HotelRoomsId",
                table: "Hotels",
                newName: "IX_Hotels_HotelRooms_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Hotels_AddressId",
                table: "Hotels",
                newName: "IX_Hotels_Address_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Employees_TicketsId",
                table: "Employees",
                newName: "IX_Employees_Tickets_Id");

            migrationBuilder.RenameIndex(
                name: "IX_CurrencyRatesTickets_TicketsId",
                table: "CurrencyRates_Tickets",
                newName: "IX_CurrencyRates_Tickets_Tickets_Id");

            migrationBuilder.RenameIndex(
                name: "IX_CurrencyRatesTickets_CurrencyRatesId",
                table: "CurrencyRates_Tickets",
                newName: "IX_CurrencyRates_Tickets_CurrencyRates_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_PassportId",
                table: "Clients",
                newName: "IX_Clients_Passport_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_PassportId",
                table: "Addresses",
                newName: "IX_Addresses_Passport_Id");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Passports",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
