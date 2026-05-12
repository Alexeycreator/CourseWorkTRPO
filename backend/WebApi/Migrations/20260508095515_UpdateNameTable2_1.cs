using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNameTable2_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Passports_PassportId",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Tickets_TicketsId",
                table: "Clients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Clients",
                table: "Clients");

            migrationBuilder.RenameTable(
                name: "Clients",
                newName: "Users");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_TicketsId",
                table: "Users",
                newName: "IX_Users_TicketsId");

            migrationBuilder.RenameIndex(
                name: "IX_Clients_PassportId",
                table: "Users",
                newName: "IX_Users_PassportId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Passports_PassportId",
                table: "Users",
                column: "PassportId",
                principalTable: "Passports",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Tickets_TicketsId",
                table: "Users",
                column: "TicketsId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Passports_PassportId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Tickets_TicketsId",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "Clients");

            migrationBuilder.RenameIndex(
                name: "IX_Users_TicketsId",
                table: "Clients",
                newName: "IX_Clients_TicketsId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_PassportId",
                table: "Clients",
                newName: "IX_Clients_PassportId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Clients",
                table: "Clients",
                column: "Id");

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
        }
    }
}
