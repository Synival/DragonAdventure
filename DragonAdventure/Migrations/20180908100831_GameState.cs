using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace DragonAdventure.Migrations {
    public partial class GameState : Migration {
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.DropColumn(
                name: "LastPlayedOn",
                table: "Game");

            migrationBuilder.CreateTable(
                name: "GameState",
                columns: table => new {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Direction = table.Column<int>(nullable: true),
                    GameId = table.Column<int>(nullable: false),
                    MapId = table.Column<int>(nullable: true),
                    MapX = table.Column<int>(nullable: true),
                    MapXPrecise = table.Column<float>(nullable: true),
                    MapY = table.Column<int>(nullable: true),
                    MapYPrecise = table.Column<float>(nullable: true),
                    Timestamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table => {
                    table.PrimaryKey("PK_GameState", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameState_Game_GameId",
                        column: x => x.GameId,
                        principalTable: "Game",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameState_GameId",
                table: "GameState",
                column: "GameId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameState");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastPlayedOn",
                table: "Game",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}