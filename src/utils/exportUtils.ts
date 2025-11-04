import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportTableToPDFOptions {
  title: string;
  columns: string[];
  data: (string | number)[][];
  filename?: string;
}

export function exportTableToPDF({
  title,
  columns,
  data,
  filename = "report.pdf",
}: ExportTableToPDFOptions) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 18);
  autoTable(doc, {
    startY: 28,
    head: [columns],
    body: data,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
  });
  doc.save(filename);
}

interface ExportTableToCSVOptions {
  columns: string[];
  data: (string | number)[][];
  sheetName?: string;
}

export function exportTableToCSV({
  columns,
  data,
  sheetName = "Sheet1",
}: ExportTableToCSVOptions) {
  // This function generates a CSV
  const csvRows = [columns.join(",")].concat(
    data.map((row: (string | number)[]) =>
      row
        .map((cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    ),
  );
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sheetName}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
