using Microsoft.EntityFrameworkCore.Migrations;

namespace DragonAdventure.Migrations
{
    public partial class IntToLong : Migration {
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.AlterColumn<long>(
                name: "StepCount",
                table: "GameState",
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<long>(
                name: "FrameCount",
                table: "GameState",
                nullable: false,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder) {
            migrationBuilder.AlterColumn<int>(
                name: "StepCount",
                table: "GameState",
                nullable: false,
                oldClrType: typeof(long));

            migrationBuilder.AlterColumn<int>(
                name: "FrameCount",
                table: "GameState",
                nullable: false,
                oldClrType: typeof(long));
        }
    }
}