export const FormatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const FormatDateToString = (
    date: Date | string | null | undefined
  ): string => {
    if (!date) return "";
  
    const parsedDate = typeof date === "string" ? new Date(date) : date;
  
    if (isNaN(parsedDate.getTime())) return ""; // invalid date check
  
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };