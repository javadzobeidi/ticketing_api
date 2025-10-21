using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KhzCeoTicketingApi.Migrations
{
    /// <inheritdoc />
    public partial class AddIsActive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BranchDepartment_Branches_BranchId",
                table: "BranchDepartment");

            migrationBuilder.DropForeignKey(
                name: "FK_BranchDepartment_Department_DepartmentId",
                table: "BranchDepartment");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "User",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_BranchDepartment_Branches_BranchId",
                table: "BranchDepartment",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BranchDepartment_Department_DepartmentId",
                table: "BranchDepartment",
                column: "DepartmentId",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BranchDepartment_Branches_BranchId",
                table: "BranchDepartment");

            migrationBuilder.DropForeignKey(
                name: "FK_BranchDepartment_Department_DepartmentId",
                table: "BranchDepartment");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "User");

            migrationBuilder.AddForeignKey(
                name: "FK_BranchDepartment_Branches_BranchId",
                table: "BranchDepartment",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BranchDepartment_Department_DepartmentId",
                table: "BranchDepartment",
                column: "DepartmentId",
                principalTable: "Department",
                principalColumn: "Id");
        }
    }
}
