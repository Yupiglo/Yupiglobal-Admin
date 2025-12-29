import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

interface ExportButtonProps<T> {
  data: T[]; // Type-safe data array
  columns: { key: keyof T; label: string; sortable?: boolean }[]; // ✅ Added `sortable`
  fileName?: string; // Optional file name
  customClassname?: string;
  voucherExportClass?: boolean;
  disabled?: boolean;
  icon?: boolean;
}

const ExportButton = <T,>({
  data,
  columns,
  fileName = "Exported_Data",
  customClassname = "",
  voucherExportClass,
  disabled = false,
  icon = true,
}: ExportButtonProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Export CSV Function
  const handleExportCSV = () => {
    if (data.length === 0) {
      toast.error("No data available to export!");
      return;
    }

    // Convert data to CSV format with selected columns
    const csvHeader = columns.map((col) => col.label).join(",");
    const csvRows = data.map((row) =>
      columns.map((col) => row[col.key] ?? "N/A").join(",")
    );
    const csvContent = [csvHeader, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsOpen(false); // Close dropdown after export
  };

  // Export XLSX (Excel) Function
  const handleExportXLSX = () => {
    if (data.length === 0) {
      toast.error("No data available to export!");
      return;
    }

    // Convert data to XLSX format with selected columns
    const excelData: Record<string, string | number>[] = data.map((row) =>
      columns.reduce((acc, col) => {
        acc[col.label] = String(row[col.key] ?? "N/A");
        return acc;
      }, {} as Record<string, string | number>)
    );

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);

    setIsOpen(false); // Close dropdown after export
  };

  const btnClass: string = customClassname
    ? `${customClassname}`
    : "flex items-center gap-2 px-5 py-1 bg-[#6FCF97] text-white rounded-md border border-[#6FCF97] hover:bg-[#58b07d] transition";
  const voucherClass =
    "cursor-pointer p-1 font-thin transition ease-in duration-200 text-base flex items-end justify-center";
  return (
    <div
      ref={dropdownRef}
      className={`relative flex justify-end items-center ${
        voucherExportClass ? "mb-0" : "mb-2"
      } ${voucherExportClass ? voucherClass : ""}`}
    >
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${btnClass} ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={disabled}
      >
        Export {icon && <span className="text-md">▼</span>}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
          <button
            onClick={handleExportCSV}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Export as CSV
          </button>
          <button
            onClick={handleExportXLSX}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Export as Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
