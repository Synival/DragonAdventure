using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace DragonAdventure.Migrations {
    public partial class GameStateUpdate : Migration {
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.AddColumn<int>(
                name: "FrameCount",
                table: "GameState",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StepCount",
                table: "GameState",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_GameState_MapId",
                table: "GameState",
                column: "MapId");

            migrationBuilder.AddForeignKey(
                name: "FK_GameState_Map_MapId",
                table: "GameState",
                column: "MapId",
                principalTable: "Map",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder) {
            migrationBuilder.DropForeignKey(
                name: "FK_GameState_Map_MapId",
                table: "GameState");

            migrationBuilder.DropIndex(
                name: "IX_GameState_MapId",
                table: "GameState");

            migrationBuilder.DropColumn(
                name: "FrameCount",
                table: "GameState");

            migrationBuilder.DropColumn(
                name: "StepCount",
                table: "GameState");
        }
    }
}