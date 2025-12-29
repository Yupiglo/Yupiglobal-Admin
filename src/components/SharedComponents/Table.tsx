import React from "react";

interface TableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactElement;
}

const Table = <T,>({ headers, data = [], renderRow }: TableProps<T>): React.ReactElement => {
  return (
    <div className="w-[95%] mt-4 mx-auto shadow-[0px_4px_10px_#00000040] rounded-lg overflow-hidden">
      <table className="w-full border border-gray-300 table-fixed">
        <thead className="bg-[#007c4a] text-lg text-white font-semibold text-center leading-7">
          <tr>
            {headers.map((header, index) => (
              <th key={`${header}-${index}`} className="p-2 border">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center p-4">
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;