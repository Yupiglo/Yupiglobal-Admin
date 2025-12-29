// "use client";

// import InputField from "../SharedComponents/InputField";
// import Button from "../SharedComponents/Button";
// import CustomDatePicker from "../SharedComponents/CustomDatepicker";
// import Box from "../SharedComponents/Box";
// import AutoSuggestField from "../SharedComponents/AutoSuggestField";
// import CancelConfirmationPopup from "./CancelConfirmationPopup";
// import { useEffect, useState } from "react";
// import { SubLedgerClosingBal } from "@/types/types";
// import { toast } from "react-toastify";

// export interface ColumnConfig {
//   label: string;
//   key: string;
//   type: "text" | "number" | "date";
//   placeholder?: string;
//   disabled?: boolean;
//   className?: string;
// }

// interface DynamicInputTableProps {
//   columns: ColumnConfig[];
//   calculateTotalForKey?: string;
//   showPaymentDate?: boolean;
//   showTotalAmount?: boolean;
//   showTotalCrAmount?: boolean;
//   rows: Record<string, any>[];
//   setRows: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
//   paymentDate?: Date | null;
//   setPaymentDate?: (date: Date | null) => void;
//   totalDebit?: string;
//   setTotalDebit?: (val: string) => void;
//   totalCredit?: string;
//   setTotalCredit?: (val: string) => void;
//   token?: string;
//   sendSubLedgerClosingData?: (data: SubLedgerClosingBal[]) => void;
//   formMode?:boolean
// }

// const DynamicInputTable: React.FC<DynamicInputTableProps> = ({
//   columns,
//   //calculateTotalForKey,
//   showPaymentDate,
//   showTotalAmount,
//   showTotalCrAmount,
//   rows,
//   setRows,
//   paymentDate = null,
//   setPaymentDate = () => {},
//   totalDebit = "0.0",
//   setTotalDebit,
//   totalCredit = "0.0",
//   setTotalCredit,
//   token,
//   sendSubLedgerClosingData,
//   formMode
// }) => {
//   const [subLedgerColBal, setSubLedgerColBal] = useState<SubLedgerClosingBal[]>(
//     []
//   );
//   console.log(formMode)
//   useEffect(() => {
//     const fetchRoleList = async () => {
//       try {
//         const response = await GetSubLedgerClosingBal(token ?? "");
//         if (
//           response?.status === 200 &&
//           Array.isArray(response.responseMsg?.data)
//         ) {
//           const closingBal = response.responseMsg.data.map((item: any) => ({
//             id: item.subLedgerId,
//             name: item.subLedgerName,
//             closingBal: item.closingBalance,
//             closingBalTag: item.closingBalanceTag,
//             status: item.status,
//           }));
//           setSubLedgerColBal(closingBal);
//           // // Set dropdown options (label: "ID - Name", value: ID)
//           // const options: string[] = closingBal
//           //   .filter((item: SubLedgerClosingBal) => item.status === "Active")
//           //   .map((item: SubLedgerClosingBal) => `${item.id} - ${item.name}`);
//           // setSubLedgerOptions(options);
//           if (sendSubLedgerClosingData) sendSubLedgerClosingData(closingBal);
//         } else {
//           setSubLedgerColBal([]);
//         }
//       } catch (error) {
//         console.error("Error fetching role list:", error);
//         setSubLedgerColBal([]);
//       }
//     };
//     fetchRoleList();
//     // if (rows.length > 0) {
//     // }
//   }, [token]);
//   const [showRowRemovePopup, setShowRowRemovePopup] = useState(false);
//   const [rowToRemove, setRowToRemove] = useState<number | null>(null);
//   const totalGridCols = columns.length + 1;
//   const [disableRow, setDisableRow] = useState(formMode);
//   const gridClass =
//     totalGridCols <= 6
//       ? `grid grid-cols-${totalGridCols}`
//       : `grid-cols-none flex justify-between`;

//   const generateEmptyRow = () =>
//     columns.reduce((acc: any, col: any) => {
//       let defaultValue;
//       if (col.type === "number") {
//         defaultValue = "0";
//       } else if (col.type === "date") {
//         defaultValue = null;
//       } else {
//         defaultValue = "";
//       }
//       acc[col.key] = defaultValue;
//       return acc;
//     }, {} as Record<string, string | null>);
//   const handleChange = (
//     index: number,
//     key: string,
//     value: string | Date | null
//   ) => {
//     const updated = [...rows];

//     const updateClosingBalance = (selectedSuggestion: SubLedgerClosingBal | undefined) => {
//       updated[index]["closingBalance"] = selectedSuggestion
//         ? `${selectedSuggestion.closingBal} ${selectedSuggestion.closingBalTag}`
//         : "0.00";
//     };

//     const updateMutualExclusivity = (key: string, value: string) => {
//       if (key === "creditAmount") {
//         updated[index]["disableDebit"] = value !== "" && value !== "0.00";
//       } else if (key === "debitAmount") {
//         updated[index]["disableCredit"] = value !== "" && value !== "0.00";
//       }
//     };

//     const updateTotalAmount = (key: string) => {
//       let total = 0;
//       updated.forEach((r) => {
//         total += parseFloat(r[key] || "0");
//       });
//       if (key === "creditAmount" && setTotalCredit) {
//         setTotalCredit(total.toString());
//       } else if (key === "debitAmount" && setTotalDebit) {
//         setTotalDebit(total.toString());
//       }
//     };

//     if (key === "accountName") {
//       const selectedSuggestion = subLedgerColBal?.find((s) => s.id === value);
//       updated[index][key] = value;
//       updateClosingBalance(selectedSuggestion);
//       setRows(updated);
//       return;
//     }

//     if (key === "creditAmount" || key === "debitAmount") {
//       const regex = /^\d*\.?\d{0,2}$/;
//       if (typeof value === "string" && (value === "" || regex.test(value))) {
//         updated[index][key] = value === "" ? "" : value;
//         updateMutualExclusivity(key, value);
//         updateTotalAmount(key);
//         setRows(updated);
//         setDisableRow(false);
//       }
//       return;
//     }

//     updated[index][key] = value;
//     setRows(updated);
//   };

//   const handleBlur = (index: number, key: string) => {
//     if (key === "creditAmount" || key === "debitAmount") {
//       const value = rows[index][key];
//       const leadingZeroPattern = /^0\d+/;
//       const num = parseFloat(value);
//       if (isNaN(num) || num <= 0 || leadingZeroPattern.test(value)) {
//         const updated = [...rows];
//         updated[index][key] = "";
//         setRows(updated);
//         toast.error(
//           "Credit or Debit amount must be a valid number greater than 0 without leading zeros."
//         );
//         return;
//       }
//     }

//     if (key === "narration") {
//       const value = rows[index][key];
//       if (value.length > 250) {
//         const updated = [...rows];
//         updated[index][key] = value.substring(0, 250); // Trim to 250
//         setRows(updated);
//         toast.error("Narration cannot exceed 250 characters.");
//         return;
//       }
//     }
//   };

//   const addRow = () => {
//     if (!disableRow) {
//       setRows([...rows, generateEmptyRow()]);
//     } else {
//       setDisableRow(true);
//       // return;
//     }
//   };
//   const removeRow = (index: number) => {
//     const row = rows[index];
//     const shouldConfirm = row.accountName && row.accountName.trim() !== "";

//     if (!shouldConfirm) {
//       const updated = [...rows];
//       updated.splice(index, 1);
//       setRows(updated);

//       const keyName: string = showTotalCrAmount
//         ? "creditAmount"
//         : "debitAmount";
//       let total: number = 0;
//       updated.forEach((r: any) => {
//         total += parseFloat(r[keyName] || "0");
//       });
//       if (keyName == "creditAmount" && setTotalCredit) {
//         setTotalCredit(total.toString());
//       } else if (keyName == "debitAmount" && setTotalDebit) {
//         setTotalDebit(total.toString());
//       }
//     } else {
//       setRowToRemove(index);
//       setShowRowRemovePopup(true);
//     }
//   };
//   const handleSuggestion = (index: any) => {
//     const otherRows = rows.filter((_, rowIdx) => rowIdx !== index);
//     const selectedIds = otherRows.map((r) => r.accountName);
//     return subLedgerColBal?.filter((s) => !selectedIds.includes(s.id));
//   };

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md">
//       {/* Header */}
//       <div
//         className={`${gridClass} gap-3 bg-[#ecf3fc] text-sm font-semibold text-gray-700 rounded-xl px-3 py-3`}
//       >
//         {columns.map((col, idx: number) => (
//           <div key={idx + ""} className="truncate">
//             {col.label}
//           </div>
//         ))}
//         <div className="text-center">Actions</div>
//       </div>

//       {/* Data Rows */}
//       <Box className="mt-2 flex flex-col gap-3">
//         {rows.map((row, index) => (
//           <div
//             key={index + ""}
//             className={`${gridClass} gap-3 px-3 py-3 border border-gray-200 rounded-lg bg-white items-center`}
//           >
//             {columns.map((col, idx) => {
//               const value = row[col.key];
//               let fieldComponent;

//               if (col.type === "date") {
//                 fieldComponent = (
//                   <CustomDatePicker
//                     selectedDate={value}
//                     setSelectedDate={(val) => {
//                       if (col.key === "paymentDate") {
//                         const today = new Date();
//                         today.setHours(0, 0, 0, 0);
//                         if (val && val > today) {
//                           toast.error("Payment Date cannot be a future date.");
//                           return;
//                         }
//                       }
//                       handleChange(index, col.key, val);
//                     }}
//                     showLabel={false}
//                     maxDate={col.key === "paymentDate" ? new Date() : undefined}
//                     customWrapperClass="mt-1 italic-placeholder"
//                   />
//                 );
//               } else if (col.key === "accountName") {
//                 fieldComponent = (
//                   <AutoSuggestField
//                     value={value}
//                     onChange={(val) => {
//                       handleChange(index, col.key, val);
//                     }}
//                     suggestions={handleSuggestion(index) ?? []}
//                   />
//                 );
//               } else if (col.key === "closingBalance") {
//                 fieldComponent = (
//                   <InputField
//                     type="text"
//                     value={
//                       row["closingBalance"] || "0.00"
//                     }
//                     className="w-full border h-7.5 border-gray-300 text-sm rounded-md mb-[5px] italic-placeholder"
//                     disabled={true}
//                   />
//                 );
//               } else if (col.key === "debitAmount" || col.key === "creditAmount") {
//                 fieldComponent = (
//                   <InputField
//                     placeholder={col.placeholder ?? ""}
//                     value={
//                       typeof value === "object" && value !== null ? "" : value
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         index,
//                         col.key,
//                         e.target.value.replace(/[^0-9.]/g, "")
//                       )
//                     }
//                     onBlur={() => handleBlur(index, col.key)}
//                     className="w-full border h-7.5 border-gray-300 text-sm rounded-md mb-[5px] italic-placeholder"
//                     disabled= {col.key === "creditAmount"? row["creditAmount"] : row["disableDebit"]}
//                   />
//                 );
//               }
//               // else if (col.key === "creditAmount") {
//               //   fieldComponent = (
//               //     <InputField
//               //       placeholder={col.placeholder ?? ""}
//               //       value={
//               //         typeof value === "object" && value !== null ? "" : value
//               //       }
//               //       onChange={(e) =>
//               //         handleChange(
//               //           index,
//               //           col.key,
//               //           e.target.value.replace(/[^0-9.]/g, "")
//               //         )
//               //       }
//               //       onBlur={() => handleBlur(index, col.key)}
//               //       className="w-full border h-7.5 border-gray-300 text-sm rounded-md mb-[5px] italic-placeholder"
//               //       disabled={row["disableCredit"]}
//               //     />
//               //   );
//               // }
//               else {
//                 fieldComponent = (
//                   <InputField
//                     placeholder={col.placeholder ?? ""}
//                     value={
//                       typeof value === "object" && value !== null ? "" : value
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         index,
//                         col.key,
//                         e.target.value.replace(/[^a-zA-Z0-9\s.]/g, "")
//                       )
//                     }
//                     onBlur={() => handleBlur(index, col.key)}
//                     className="w-full border h-7.5 border-gray-300 text-sm rounded-md mb-[5px] italic-placeholder"
//                     disabled={col.disabled}
//                     maxLength={col.key == "paymentRefNo" ? 50 : 200}
//                   />
//                 );
//               }

//               return <div key={idx + ""}>{fieldComponent}</div>;
//             })}
//             <div className="text-center">
//               {rows.length > 1 ? (
//                 <Button
//                   text="Remove"
//                   btnType="button"
//                   onClick={() => removeRow(index)}
//                   className="bg-[#ed6d52] text-white text-xs px-3 py-1.5 rounded-md"
//                 />
//               ) : (
//                 <button
//                   id="placeholder-btn"
//                   type="button"
//                   className="invisible bg-red-500 text-white text-xs px-3 py-1.5 rounded-md h-auto"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </Box>

//       {/* Footer */}
//       <div className="flex justify-between mt-6 px-3 flex-wrap gap-4">
//         <Button
//           text="Add Row"
//           onClick={addRow}
//           disabled={disableRow}
//           fullWidth={false}
//           className="bg-customBlueButton text-white px-4 py-1.5 text-sm rounded-md"
//         />

//         {showPaymentDate && (
//           <div className="flex text-sm items-center gap-2 whitespace-nowrap">
//             <span>Payment Date:</span>
//             <CustomDatePicker
//               selectedDate={paymentDate ?? null}
//               setSelectedDate={setPaymentDate ?? (() => {})} // fallback if undefined
//               showLabel={false}
//             />
//           </div>
//         )}

//         {showTotalAmount && (
//           <div className="flex text-sm items-center gap-4 whitespace-nowrap">
//             <span>Total Debit Amount: </span>
//             <InputField
//               type="text"
//               value={totalDebit}
//               readOnly
//               onChange={(e) => setTotalDebit?.(e.target.value)}
//               className="!w-28 border border-customBorder italic-placeholder"
//             />
//           </div>
//         )}

//         {showTotalCrAmount && (
//           <div className="flex text-sm items-center gap-2 whitespace-nowrap">
//             <span>Total Credit Amount: </span>
//             <InputField
//               type="text"
//               value={totalCredit}
//               readOnly
//               onChange={(e) => setTotalCredit?.(e.target.value)}
//               className="!w-28 border border-customBorder italic-placeholder"
//             />
//           </div>
//         )}
//       </div>
//       {showRowRemovePopup && rowToRemove !== null && (
//         <CancelConfirmationPopup
//           message="Are you sure you want to remove this row? Unsaved changes will be lost."
//           onConfirm={() => {
//             const updated = [...rows];
//             const removedRow = updated.splice(rowToRemove, 1)[0];

//             // Subtract from totals
//             const debitToSubtract = parseFloat(removedRow.debitAmount || "0");
//             const creditToSubtract = parseFloat(removedRow.creditAmount || "0");

//             if (debitToSubtract > 0 && setTotalDebit) {
//               const newDebit = parseFloat(totalDebit) - debitToSubtract;
//               setTotalDebit(newDebit.toFixed(2));
//             }

//             if (creditToSubtract > 0 && setTotalCredit) {
//               const newCredit = parseFloat(totalCredit) - creditToSubtract;
//               setTotalCredit(newCredit.toFixed(2));
//             }

//             setRows(updated);
//             setShowRowRemovePopup(false);
//             setRowToRemove(null);
//           }}
//           onCancel={() => {
//             setShowRowRemovePopup(false);
//             setRowToRemove(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default DynamicInputTable;
