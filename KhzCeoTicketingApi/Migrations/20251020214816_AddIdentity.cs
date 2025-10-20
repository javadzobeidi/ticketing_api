using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KhzCeoTicketingApi.Migrations
{
    /// <inheritdoc />
    public partial class AddIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "IdentityKey",
                table: "User",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Appoinments_BranchId",
                table: "Appoinments",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Appoinments_CityId",
                table: "Appoinments",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_Appoinments_DepartmentId",
                table: "Appoinments",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appoinments_Branches_BranchId",
                table: "Appoinments",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appoinments_City_CityId",
                table: "Appoinments",
                column: "CityId",
                principalTable: "City",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appoinments_Department_DepartmentId",
                table: "Appoinments",
                column: "DepartmentId",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appoinments_Branches_BranchId",
                table: "Appoinments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appoinments_City_CityId",
                table: "Appoinments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appoinments_Department_DepartmentId",
                table: "Appoinments");

            migrationBuilder.DropIndex(
                name: "IX_Appoinments_BranchId",
                table: "Appoinments");

            migrationBuilder.DropIndex(
                name: "IX_Appoinments_CityId",
                table: "Appoinments");

            migrationBuilder.DropIndex(
                name: "IX_Appoinments_DepartmentId",
                table: "Appoinments");

            migrationBuilder.DropColumn(
                name: "IdentityKey",
                table: "User");
        }
    }
}
