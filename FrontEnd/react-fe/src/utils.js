import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = (data, fileName = "DataTable.xlsx") => {
  // Convert data into a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate an Excel file
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Convert to Blob and trigger download
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);
};

export const BaseURL = 'http://127.0.0.1:8000';
// export const BaseURL = 'http://192.168.100.124:8080'; 


