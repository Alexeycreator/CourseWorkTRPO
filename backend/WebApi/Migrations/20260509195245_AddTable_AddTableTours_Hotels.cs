using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTable_AddTableTours_Hotels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Tours_ToursId",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_ToursId",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "ToursId",
                table: "Hotels");

            migrationBuilder.CreateTable(
                name: "Tours_Hotels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ToursId = table.Column<int>(type: "int", nullable: true),
                    HotelsId = table.Column<int>(type: "int", nullable: true)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tours_Hotels");

            migrationBuilder.AddColumn<int>(
                name: "ToursId",
                table: "Hotels",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_ToursId",
                table: "Hotels",
                column: "ToursId");

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Tours_ToursId",
                table: "Hotels",
                column: "ToursId",
                principalTable: "Tours",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
