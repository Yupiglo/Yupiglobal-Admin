import * as XLSX from "xlsx";

/**
 * Exports JSON data to an Excel file.
 * @param data - The data to be exported (must be an array of objects).
 * @param fileName - The name of the generated Excel file (default: "Exported_Data.xlsx").
 * @param sheetName - The name of the Excel sheet (default: "Sheet1").
 */
export const exportToExcel = (
  data: any[],
  fileName: string = "Exported_Data.xlsx",
  sheetName: string = "Sheet1"
) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }

  // ✅ Convert JSON to Worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // ✅ Generate and download the Excel file
  XLSX.writeFile(workbook, fileName);
};
