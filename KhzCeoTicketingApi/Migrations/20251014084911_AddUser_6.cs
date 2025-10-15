using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KhzCeoTicketingApi.Migrations
{
    /// <inheritdoc />
    public partial class AddUser_6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BranchDepartment_Branches_BranchesId",
                table: "BranchDepartment");

            migrationBuilder.DropForeignKey(
                name: "FK_BranchDepartment_Department_DepartmentsId",
                table: "BranchDepartment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BranchDepartment",
                table: "BranchDepartment");

            migrationBuilder.RenameColumn(
                name: "DepartmentsId",
                table: "BranchDepartment",
                newName: "DepartmentId");

            migrationBuilder.RenameColumn(
                name: "BranchesId",
                table: "BranchDepartment",
                newName: "BranchId");

            migrationBuilder.RenameIndex(
                name: "IX_BranchDepartment_DepartmentsId",
                table: "BranchDepartment",
                newName: "IX_BranchDepartment_DepartmentId");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "BranchDepartment",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BranchDepartment",
                table: "BranchDepartment",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_BranchDepartment_BranchId",
                table: "BranchDepartment",
                column: "BranchId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BranchDepartment_Branches_BranchId",
                table: "BranchDepartment");

            migrationBuilder.DropForeignKey(
                name: "FK_BranchDepartment_Department_DepartmentId",
                table: "BranchDepartment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BranchDepartment",
                table: "BranchDepartment");

            migrationBuilder.DropIndex(
                name: "IX_BranchDepartment_BranchId",
                table: "BranchDepartment");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "BranchDepartment");

            migrationBuilder.RenameColumn(
                name: "DepartmentId",
                table: "BranchDepartment",
                newName: "DepartmentsId");

            migrationBuilder.RenameColumn(
                name: "BranchId",
                table: "BranchDepartment",
                newName: "BranchesId");

            migrationBuilder.RenameIndex(
                name: "IX_BranchDepartment_DepartmentId",
                table: "BranchDepartment",
                newName: "IX_BranchDepartment_DepartmentsId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BranchDepartment",
                table: "BranchDepartment",
                columns: new[] { "BranchesId", "DepartmentsId" });

            migrationBuilder.AddForeignKey(
                name: "FK_BranchDepartment_Branches_BranchesId",
                table: "BranchDepartment",
                column: "BranchesId",
                principalTable: "Branches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BranchDepartment_Department_DepartmentsId",
                table: "BranchDepartment",
                column: "DepartmentsId",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
