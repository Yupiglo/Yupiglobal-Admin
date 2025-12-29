import React, { useState, ReactNode, useMemo, useEffect } from "react";
import Pagination from "./Pagination";
import { ArrowDownUp, ArrowDown, ArrowUp } from "lucide-react";

interface TableProps {
  columns: {
    label: string;
    key: string;
    sortable?: boolean;
    columnRenderer?: (row: any) => {};
  }[];
  data: { [key: string]: any }[];
  pageSize?: PageSize;
  showSorting?: boolean;
  showPagination?: boolean;
  defaultSortKey?: string;
  actionButtons?: (row: any) => ReactNode;
  checkboxColumnKey?: string; // Column key where the checkbox should be enabled
  selectRowCallback?: (selected: any) => void
}
type PageSize = 10 | 20 | 50 | 75 | 100;

const Table: React.FC<TableProps> = ({
  columns,
  data,
  pageSize,
  showSorting = true,
  showPagination = true,
  defaultSortKey,
  actionButtons,
  checkboxColumnKey,
  selectRowCallback
}) => {
  const [sortedData, setSortedData] = useState([...data]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newPageSize, setNewPageSize] = useState(pageSize ?? 10);
  const validPageSizes = [20, 50, 100];

  const totalPages = Math.ceil(data.length / newPageSize);

  useEffect(() => {
    console.log('Incoming data :', data);
    if (defaultSortKey) {
      handleSort(defaultSortKey);
    } else {
      setSortedData([...data]);
    }

  }, [defaultSortKey, data]);
  useEffect(() => {
    if (selectRowCallback) {
      selectRowCallback(selectedRows);
    }
  }, [selectedRows, selectRowCallback]);

  // Sorting Function
  const handleSort = (key: string) => {
    console.log(key)
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    const sorted = [...data].sort((a, b) => {
      if (direction === null) return 0;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedData(direction ? sorted : [...data]);
    setSortConfig({ key: direction ? key : "", direction });
  };

  const handleSelectRow = (id: string) => {
    const newSelection = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(newSelection);
    setSelectAll(newSelection.length === sortedData.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedData.map((row) => row.id?.toString() || ""));
    }
    setSelectAll(!selectAll);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowDownUp className="w-4 h-4" />;
    if (sortConfig.direction === "asc")
      return <ArrowDown className="w-4 h-4" />;
    if (sortConfig.direction === "desc") return <ArrowUp className="w-4 h-4" />;
    return <ArrowDownUp className="w-4 h-4" />;
  };

  const handlePageSize = (records: number) => {
    setNewPageSize(records as PageSize);
  };

  const pageSizeOptions = useMemo(() => {
    const nextHigherSize =
      validPageSizes.find((size) => size >= data.length) ??
      Math.max(...validPageSizes);
    return validPageSizes.filter((size) => size <= nextHigherSize);
  }, [data.length]);

  /* const paginatedData = sortedData.slice(
    (currentPage - 1) * newPageSize,
    currentPage * newPageSize
  ); */

  const paginatedData = showPagination
    ? sortedData.slice((currentPage - 1) * newPageSize, currentPage * newPageSize)
    : sortedData; // Show all records if pagination is disabled



  return (
    <div className="overflow-x-auto w-full mx-auto">
      {/* If No Data, Show Message and Hide Table */}
      {paginatedData.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No Data Found</div>
      ) : (
        <>
          <table className="w-full min-w-full shadow-md ">
            {/* Table Header */}
            <thead className="text-gray-700 bg-[#ecf3fc] rounded-xl">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={"th" + index}
                    className={`px-4 py-2 text-center font-semibold whitespace-nowrap
                    ${index === 0 ? "first:rounded-l-xl" : ""}`}
                  >
                    {col.key === checkboxColumnKey ? (
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="mr-2"
                      />
                    ) : null}
                    {col.label}
                    {col.sortable && showSorting && (
                      <button
                        className="ml-2 text-gray-500 hover:text-black focus:outline-none text-center"
                        onClick={() => handleSort(col.key)}
                      >
                        {getSortIcon(col.key)}
                      </button>
                    )}
                  </th>
                ))}
                {actionButtons && (
                  <th className="px-4 py-2 text-center font-semibold rounded-r-xl">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              <tr className="h-2 rounded-xl"></tr>
            </tbody>
            {/* Table Body */}
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={"tr" + rowIndex}
                  className="hover:bg-gray-50 text-sm text-customGrey"
                >
                  {columns.map((col, colIndex) => {
                    let cellContent;
                    if (col.columnRenderer) {
                      cellContent = col.columnRenderer(row);
                    } else if (col.key === checkboxColumnKey) {
                      cellContent = (
                        <div className="flex flex-row justify-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(
                              row.id?.toString() || ""
                            )}
                            onChange={() =>
                              handleSelectRow(row.id?.toString() || "")
                            }
                            className="mx-2"
                          />
                          <span >{row[col.key]}</span>
                        </div>
                      );
                    } else if (col.key === "status") {
                      const isActive = row[col.key]?.toLowerCase() === "active" || row[col.key] == 'Success';
                      cellContent = (
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"
                              }`}
                          />
                          {row[col.key]}
                        </div>
                      );
                    } else {
                      cellContent = row[col.key]  ?? "-";
                    }

                    return (
                      <td
                        key={"td" + colIndex}
                        className="px-4 py-1 border text-center whitespace-nowrap"
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                  {actionButtons && (
                    <td className="px-4 py-1 border whitespace-nowrap text-center">
                      {actionButtons(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination & Page Size Selection */}
          {showPagination && (
            <div className="mt-10 mr-2 flex justify-between items-center">

              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
              {pageSizeOptions.length > 0 && (
                <div className={`${currentPage>=totalPages? "hidden":"visible"} ml-4 flex items-center text-customGrey text-xs mb-2`}>
                  <label htmlFor="pageSize" className="mr-2">
                    Show
                  </label>
                  <select
                    id="pageSize"
                    className="border mr-2 border-gray-300 rounded-md px-2 py-1"
                    value={newPageSize}
                    onChange={(e) =>
                      handlePageSize(Number(e.target.value) as PageSize)
                    }
                  >
                    {pageSizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span>Records</span>
                </div>
              )}
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default Table;
