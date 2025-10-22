using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KhzCeoTicketingApi.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadeIssue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Appoinments");

            migrationBuilder.DropColumn(
                name: "EndDateTime",
                table: "Appoinments");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Appoinments");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Appoinments",
                newName: "TimeFa");

            migrationBuilder.RenameColumn(
                name: "StartDateTime",
                table: "Appoinments",
                newName: "AppointmentDate");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Appoinments",
                newName: "DateFa");

            migrationBuilder.RenameColumn(
                name: "IntervalMinutes",
                table: "Appoinments",
                newName: "AppointmentStatus");

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                table: "Appoinments",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<long>(
                name: "CurrentAssignmentUserId",
                table: "Appoinments",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Appoinments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppointmentAssignment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<long>(type: "bigint", nullable: false),
                    FromUserId = table.Column<long>(type: "bigint", nullable: true),
                    ToUserId = table.Column<long>(type: "bigint", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AssignDateFa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentAssignment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentAssignment_Appoinments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appoinments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppointmentMessage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<long>(type: "bigint", nullable: false),
                    SenderId = table.Column<long>(type: "bigint", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsFromStaff = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentMessage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentMessage_Appoinments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appoinments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppointmentMessage_User_SenderId",
                        column: x => x.SenderId,
                        principalTable: "User",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appoinments_UserId",
                table: "Appoinments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentAssignment_AppointmentId",
                table: "AppointmentAssignment",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentMessage_AppointmentId",
                table: "AppointmentMessage",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentMessage_SenderId",
                table: "AppointmentMessage",
                column: "SenderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appoinments_User_UserId",
                table: "Appoinments",
                column: "UserId",
                principalTable: "User",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appoinments_User_UserId",
                table: "Appoinments");

            migrationBuilder.DropTable(
                name: "AppointmentAssignment");

            migrationBuilder.DropTable(
                name: "AppointmentMessage");

            migrationBuilder.DropIndex(
                name: "IX_Appoinments_UserId",
                table: "Appoinments");

            migrationBuilder.DropColumn(
                name: "CurrentAssignmentUserId",
                table: "Appoinments");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Appoinments");

            migrationBuilder.RenameColumn(
                name: "TimeFa",
                table: "Appoinments",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "DateFa",
                table: "Appoinments",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "AppointmentStatus",
                table: "Appoinments",
                newName: "IntervalMinutes");

            migrationBuilder.RenameColumn(
                name: "AppointmentDate",
                table: "Appoinments",
                newName: "StartDateTime");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Appoinments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EndDate",
                table: "Appoinments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDateTime",
                table: "Appoinments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "EndTime",
                table: "Appoinments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
