using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTable_AlterNameTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_HotelRoomsModels_HotelRooms_Id",
                table: "Hotels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HotelRoomsModels",
                table: "HotelRoomsModels");

            migrationBuilder.RenameTable(
                name: "HotelRoomsModels",
                newName: "HotelRooms");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HotelRooms",
                table: "HotelRooms",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_HotelRooms_HotelRooms_Id",
                table: "Hotels",
                column: "HotelRooms_Id",
                principalTable: "HotelRooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_HotelRooms_HotelRooms_Id",
                table: "Hotels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HotelRooms",
                table: "HotelRooms");

            migrationBuilder.RenameTable(
                name: "HotelRooms",
                newName: "HotelRoomsModels");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HotelRoomsModels",
                table: "HotelRoomsModels",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_HotelRoomsModels_HotelRooms_Id",
                table: "Hotels",
                column: "HotelRooms_Id",
                principalTable: "HotelRoomsModels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
