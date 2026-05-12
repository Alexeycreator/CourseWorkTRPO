using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTable_AddColumnToursHotelsAddressesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tours_Hotels");

            migrationBuilder.CreateTable(
                name: "Tours_Hotels_Addresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ToursId = table.Column<int>(type: "int", nullable: true),
                    HotelsId = table.Column<int>(type: "int", nullable: true),
                    AddressesId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tours_Hotels_Addresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tours_Hotels_Addresses_Addresses_AddressesId",
                        column: x => x.AddressesId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Tours_Hotels_Addresses_Hotels_HotelsId",
                        column: x => x.HotelsId,
                        principalTable: "Hotels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Tours_Hotels_Addresses_Tours_ToursId",
                        column: x => x.ToursId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Hotels_Addresses_AddressesId",
                table: "Tours_Hotels_Addresses",
                column: "AddressesId");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Hotels_Addresses_HotelsId",
                table: "Tours_Hotels_Addresses",
                column: "HotelsId");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Hotels_Addresses_ToursId",
                table: "Tours_Hotels_Addresses",
                column: "ToursId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tours_Hotels_Addresses");

            migrationBuilder.CreateTable(
                name: "Tours_Hotels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HotelsId = table.Column<int>(type: "int", nullable: true),
                    ToursId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tours_Hotels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tours_Hotels_Hotels_HotelsId",
                        column: x => x.HotelsId,
                        principalTable: "Hotels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Tours_Hotels_Tours_ToursId",
                        column: x => x.ToursId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Hotels_HotelsId",
                table: "Tours_Hotels",
                column: "HotelsId");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Hotels_ToursId",
                table: "Tours_Hotels",
                column: "ToursId");
        }
    }
}
