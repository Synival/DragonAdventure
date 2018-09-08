using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace DragonAdventure.Migrations {
    public partial class MapsIntoGames : Migration {
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.DropForeignKey(
                name: "FK_Map_AspNetUsers_PlayerId",
                table: "Map");

            migrationBuilder.RenameColumn(
                name: "PlayerId",
                table: "Map",
                newName: "GameId");

            migrationBuilder.RenameIndex(
                name: "IX_Map_PlayerId",
                table: "Map",
                newName: "IX_Map_GameId");

            migrationBuilder.CreateTable(
                name: "Game",
                columns: table => new {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastPlayedOn = table.Column<DateTime>(nullable: false),
                    PlayerId = table.Column<int>(nullable: false)
                },
                constraints: table => {
                    table.PrimaryKey("PK_Game", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Game_AspNetUsers_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Game_PlayerId",
                table: "Game",
                column: "PlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Map_Game_GameId",
                table: "Map",
                column: "GameId",
                principalTable: "Game",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder) {
            migrationBuilder.DropForeignKey(
                name: "FK_Map_Game_GameId",
                table: "Map");

            migrationBuilder.DropTable(
                name: "Game");

            migrationBuilder.RenameColumn(
                name: "GameId",
                table: "Map",
                newName: "PlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_Map_GameId",
                table: "Map",
                newName: "IX_Map_PlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Map_AspNetUsers_PlayerId",
                table: "Map",
                column: "PlayerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}