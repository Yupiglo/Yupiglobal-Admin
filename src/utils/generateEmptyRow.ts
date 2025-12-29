export const generateEmptyRow = (columns: any[]): Record<string, any> => {
    return columns.reduce((acc: any, col: any) => {
      const dateCol = col.type === "date" ? null : "";
      acc[col.key] = col.type === "number" ? "0" : dateCol;
      return acc;
    }, {} as Record<string, any>);
  };