using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTableClients_AddJwtToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginAt",
                table: "Clients",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LockoutEnd",
                table: "Clients",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoginAttempts",
                table: "Clients",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "Clients",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RefreshTokenExpiryTime",
                table: "Clients",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLoginAt",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "LockoutEnd",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "LoginAttempts",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "RefreshTokenExpiryTime",
                table: "Clients");
        }
    }
}
