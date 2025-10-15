using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KhzCeoTicketingApi.Migrations
{
    /// <inheritdoc />
    public partial class AddUser_5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserDepartment_User_UserId1",
                table: "UserDepartment");

            migrationBuilder.DropIndex(
                name: "IX_UserDepartment_UserId1",
                table: "UserDepartment");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserDepartment");

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                table: "UserDepartment",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_UserDepartment_UserId",
                table: "UserDepartment",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserDepartment_User_UserId",
                table: "UserDepartment",
                column: "UserId",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserDepartment_User_UserId",
                table: "UserDepartment");

            migrationBuilder.DropIndex(
                name: "IX_UserDepartment_UserId",
                table: "UserDepartment");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserDepartment",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<long>(
                name: "UserId1",
                table: "UserDepartment",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_UserDepartment_UserId1",
                table: "UserDepartment",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserDepartment_User_UserId1",
                table: "UserDepartment",
                column: "UserId1",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
