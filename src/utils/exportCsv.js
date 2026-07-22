
export function exportLeavesToCsv(leaves, filename = "leave-report.csv") {
  const headers = ["Employee", "Department", "Leave Type", "From", "To", "Days", "Status"];

  const rows = leaves.map((leave) => [
    leave.employee?.name || "",
    leave.employee?.department || "",
    leave.leaveType,
    leave.fromDate?.substring(0, 10) || "",
    leave.toDate?.substring(0, 10) || "",
    leave.days,
    leave.status,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
