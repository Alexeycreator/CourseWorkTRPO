using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTablesAndIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Passports_Passport_Id",
                table: "Addresses");

            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Tours_Tours_Id",
                table: "Addresses");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Passports_Passport_Id",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyRates_Tickets_CurrencyRates_CurrencyRates_Id",
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyRates_Tickets_Tickets_Tickets_Id",
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Addresses_Address_Id",
                table: "Hotels");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_HotelRooms_HotelRooms_Id",
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

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Tours_TicketsTransfersId",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_ClientId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_TicketsAddressesRoomsId",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_Clients_Password",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "Client_Id",
                table: "Tickets");

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
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "CurrencyRates");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "Transfers_Id",
                table: "Tours",
                newName: "TransfersId");

            migrationBuilder.RenameColumn(
                name: "Tickets_Id",
                table: "Tours",
                newName: "TicketsId");

            migrationBuilder.RenameColumn(
                name: "Tickets_Id",
                table: "Hotels",
                newName: "TicketsId");

            migrationBuilder.RenameColumn(
                name: "HotelRooms_Id",
                table: "Hotels",
                newName: "HotelRoomsId");

            migrationBuilder.RenameColumn(
                name: "Address_Id",
                table: "Hotels",
                newName: "AddressId");

            migrationBuilder.RenameColumn(
                name: "Tickets_Id",
                table: "CurrencyRates_Tickets",
                newName: "TicketsId");

            migrationBuilder.RenameColumn(
                name: "CurrencyRates_Id",
                table: "CurrencyRates_Tickets",
                newName: "CurrencyRatesId");

            migrationBuilder.RenameColumn(
                name: "Passport_Id",
                table: "Clients",
                newName: "TicketsId");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_PhoneNumber",
                table: "Clients",
                newName: "IX_Users_PhoneNumber");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_PassportId",
                table: "Clients",
                newName: "IX_Clients_TicketsId");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_Login",
                table: "Clients",
                newName: "IX_Users_Login");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_FullName",
                table: "Clients",
                newName: "IX_Users_FullName");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_Email",
                table: "Clients",
                newName: "IX_Users_Email");

            migrationBuilder.RenameColumn(
                name: "Tours_Id",
                table: "Addresses",
                newName: "ToursId");

            migrationBuilder.RenameColumn(
                name: "Passport_Id",
                table: "Addresses",
                newName: "PassportId");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_Tours_Id",
                table: "Addresses",
                newName: "IX_Addresses_ToursId");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_Full",
                table: "Addresses",
                newName: "IX_Addresses_FullAddress");

            migrationBuilder.AddColumn<int>(
                name: "PassportId",
                table: "Clients",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "Clients",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Clients",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_Arrival",
                table: "Transfers",
                column: "Arrival");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_Departure",
                table: "Transfers",
                column: "Departure");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Description",
                table: "Tours",
                column: "Description");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Details",
                table: "Tours",
                column: "Details");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_HotTour",
                table: "Tours",
                column: "HotTour");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_ImageTour",
                table: "Tours",
                column: "ImageTour");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Price",
                table: "Tours",
                column: "Price");

            migrationBuilder.CreateIndex(
                name: "IX_Passports_DateOfIssue",
                table: "Passports",
                column: "DateOfIssue");

            migrationBuilder.CreateIndex(
                name: "IX_Passports_DepartmentCode",
                table: "Passports",
                column: "DepartmentCode");

            migrationBuilder.CreateIndex(
                name: "IX_Passports_IssuedBy",
                table: "Passports",
                column: "IssuedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Passports_Number",
                table: "Passports",
                column: "Number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Passports_Seria",
                table: "Passports",
                column: "Seria",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_Details",
                table: "Hotels",
                column: "Details");

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_ImageHotel",
                table: "Hotels",
                column: "ImageHotel");

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_Stars",
                table: "Hotels",
                column: "Stars");

            migrationBuilder.CreateIndex(
                name: "IX_HotelRooms_Details",
                table: "HotelRooms",
                column: "Details");

            migrationBuilder.CreateIndex(
                name: "IX_HotelRooms_Floor",
                table: "HotelRooms",
                column: "Floor");

            migrationBuilder.CreateIndex(
                name: "IX_HotelRooms_ImageRoom",
                table: "HotelRooms",
                column: "ImageRoom");

            migrationBuilder.CreateIndex(
                name: "IX_CurrencyRates_DateReceipt",
                table: "CurrencyRates",
                column: "DateReceipt");

            migrationBuilder.CreateIndex(
                name: "IX_Clients_PassportId",
                table: "Clients",
                column: "PassportId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Age",
                table: "Clients",
                column: "Age");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Birthday",
                table: "Clients",
                column: "Birthday");

            migrationBuilder.CreateIndex(
                name: "IX_Users_FirstName",
                table: "Clients",
                column: "FirstName");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Gender",
                table: "Clients",
                column: "Gender");

            migrationBuilder.CreateIndex(
                name: "IX_Users_MiddleName",
                table: "Clients",
                column: "MiddleName");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Position",
                table: "Clients",
                column: "Position");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Role",
                table: "Clients",
                column: "Role");

            migrationBuilder.CreateIndex(
                name: "IX_Users_SurName",
                table: "Clients",
                column: "SurName");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_City",
                table: "Addresses",
                column: "City");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Country",
                table: "Addresses",
                column: "Country");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_House",
                table: "Addresses",
                column: "House");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Region",
                table: "Addresses",
                column: "Region");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Street",
                table: "Addresses",
                column: "Street");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Passports_PassportId",
                table: "Addresses",
                column: "PassportId",
                principalTable: "Passports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Tours_ToursId",
                table: "Addresses",
                column: "ToursId",
                principalTable: "Tours",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Passports_PassportId",
                table: "Clients",
                column: "PassportId",
                principalTable: "Passports",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Tickets_TicketsId",
                table: "Clients",
                column: "TicketsId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_CurrencyRates_Tickets_CurrencyRates_CurrencyRatesId",
                table: "CurrencyRates_Tickets",
                column: "CurrencyRatesId",
                principalTable: "CurrencyRates",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_CurrencyRates_Tickets_Tickets_TicketsId",
                table: "CurrencyRates_Tickets",
                column: "TicketsId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Addresses_AddressId",
                table: "Hotels",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_HotelRooms_HotelRoomsId",
                table: "Hotels",
                column: "HotelRoomsId",
                principalTable: "HotelRooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Tickets_TicketsId",
                table: "Hotels",
                column: "TicketsId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_Tickets_TicketsId",
                table: "Tours",
                column: "TicketsId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_Transfers_TransfersId",
                table: "Tours",
                column: "TransfersId",
                principalTable: "Transfers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Passports_PassportId",
                table: "Addresses");

            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Tours_ToursId",
                table: "Addresses");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Passports_PassportId",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Tickets_TicketsId",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyRates_Tickets_CurrencyRates_CurrencyRatesId",
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyRates_Tickets_Tickets_TicketsId",
                table: "CurrencyRates_Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Addresses_AddressId",
                table: "Hotels");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_HotelRooms_HotelRoomsId",
                table: "Hotels");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Tickets_TicketsId",
                table: "Hotels");

            migrationBuilder.DropForeignKey(
                name: "FK_Tours_Tickets_TicketsId",
                table: "Tours");

            migrationBuilder.DropForeignKey(
                name: "FK_Tours_Transfers_TransfersId",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Transfers_Arrival",
                table: "Transfers");

            migrationBuilder.DropIndex(
                name: "IX_Transfers_Departure",
                table: "Transfers");

            migrationBuilder.DropIndex(
                name: "IX_Tours_Description",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tours_Details",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tours_HotTour",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tours_ImageTour",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tours_Price",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Passports_DateOfIssue",
                table: "Passports");

            migrationBuilder.DropIndex(
                name: "IX_Passports_DepartmentCode",
                table: "Passports");

            migrationBuilder.DropIndex(
                name: "IX_Passports_IssuedBy",
                table: "Passports");

            migrationBuilder.DropIndex(
                name: "IX_Passports_Number",
                table: "Passports");

            migrationBuilder.DropIndex(
                name: "IX_Passports_Seria",
                table: "Passports");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_Details",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_ImageHotel",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_Stars",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_HotelRooms_Details",
                table: "HotelRooms");

            migrationBuilder.DropIndex(
                name: "IX_HotelRooms_Floor",
                table: "HotelRooms");

            migrationBuilder.DropIndex(
                name: "IX_HotelRooms_ImageRoom",
                table: "HotelRooms");

            migrationBuilder.DropIndex(
                name: "IX_CurrencyRates_DateReceipt",
                table: "CurrencyRates");

            migrationBuilder.DropIndex(
                name: "IX_Clients_PassportId",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Users_Age",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Users_Birthday",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Users_FirstName",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Users_Gender",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Users_MiddleName",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Users_Position",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Users_Role",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Users_SurName",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_City",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Country",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_House",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Region",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Street",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "PassportId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Clients");

            migrationBuilder.RenameColumn(
                name: "TransfersId",
                table: "Tours",
                newName: "Transfers_Id");

            migrationBuilder.RenameColumn(
                name: "TicketsId",
                table: "Tours",
                newName: "Tickets_Id");

            migrationBuilder.RenameColumn(
                name: "TicketsId",
                table: "Hotels",
                newName: "Tickets_Id");

            migrationBuilder.RenameColumn(
                name: "HotelRoomsId",
                table: "Hotels",
                newName: "HotelRooms_Id");

            migrationBuilder.RenameColumn(
                name: "AddressId",
                table: "Hotels",
                newName: "Address_Id");

            migrationBuilder.RenameColumn(
                name: "TicketsId",
                table: "CurrencyRates_Tickets",
                newName: "Tickets_Id");

            migrationBuilder.RenameColumn(
                name: "CurrencyRatesId",
                table: "CurrencyRates_Tickets",
                newName: "CurrencyRates_Id");

            migrationBuilder.RenameColumn(
                name: "TicketsId",
                table: "Clients",
                newName: "Passport_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Users_PhoneNumber",
                table: "Clients",
                newName: "IX_Clients_PhoneNumber");

            migrationBuilder.RenameIndex(
                name: "IX_Users_Login",
                table: "Clients",
                newName: "IX_Clients_Login");

            migrationBuilder.RenameIndex(
                name: "IX_Users_FullName",
                table: "Clients",
                newName: "IX_Clients_FullName");

            migrationBuilder.RenameIndex(
                name: "IX_Users_Email",
                table: "Clients",
                newName: "IX_Clients_Email");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_TicketsId",
                table: "Clients",
                newName: "IX_Clients_PassportId");

            migrationBuilder.RenameColumn(
                name: "ToursId",
                table: "Addresses",
                newName: "Tours_Id");

            migrationBuilder.RenameColumn(
                name: "PassportId",
                table: "Addresses",
                newName: "Passport_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_ToursId",
                table: "Addresses",
                newName: "IX_Addresses_Tours_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_FullAddress",
                table: "Addresses",
                newName: "IX_Addresses_Full");

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

            migrationBuilder.AddColumn<int>(
                name: "Client_Id",
                table: "Tickets",
                type: "int",
                nullable: true);

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

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Addresses",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tickets_Id = table.Column<int>(type: "int", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    MiddleName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Position = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SurName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Employees_Tickets_Tickets_Id",
                        column: x => x.Tickets_Id,
                        principalTable: "Tickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tours_TicketsTransfersId",
                table: "Tours",
                columns: new[] { "Tickets_Id", "Transfers_Id" });

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_ClientId",
                table: "Tickets",
                column: "Client_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_TicketsAddressesRoomsId",
                table: "Hotels",
                columns: new[] { "Tickets_Id", "Address_Id", "HotelRooms_Id" });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_Password",
                table: "Clients",
                column: "Password");

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
                name: "IX_Employees_TicketsId",
                table: "Employees",
                column: "Tickets_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Passports_Passport_Id",
                table: "Addresses",
                column: "Passport_Id",
                principalTable: "Passports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Tours_Tours_Id",
                table: "Addresses",
                column: "Tours_Id",
                principalTable: "Tours",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Passports_Passport_Id",
                table: "Clients",
                column: "Passport_Id",
                principalTable: "Passports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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
                name: "FK_Hotels_Addresses_Address_Id",
                table: "Hotels",
                column: "Address_Id",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_HotelRooms_HotelRooms_Id",
                table: "Hotels",
                column: "HotelRooms_Id",
                principalTable: "HotelRooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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
    }
}
