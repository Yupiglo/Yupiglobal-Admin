
  export const validateRows = (rows: any[], columns: any[]): boolean => {
    return rows.every((row: any) =>
        columns.every((col: any) => {
            const dateCol = col.type === "date" ? row[col.key] !== null : row[col.key] !== "";
            return (col.disabled || col.key == "closingBalance") ? true : dateCol;
        })
    );
};
  