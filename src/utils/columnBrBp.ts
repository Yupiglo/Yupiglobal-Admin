export type VoucherType = "BP" | "BR"; // Bank Payment, Bank Receipt

export interface ColumnConfig {
  label: string;
  key: string;
  type: "text" | "number" | "date";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const getVoucherColumns = (voucherType: VoucherType): ColumnConfig[] => {
  const amountKey = voucherType === "BP" ? "debitAmount" : "creditAmount";
  const amountLabel = voucherType === "BP" ? "Dr. Amount" : "Cr. Amount";
  const closingPlaceholder = voucherType === "BP" ? "0.00 Dr." : "0.00 Cr.";

  return [
    { label: "Account Name/Sub Ledger", key: "accountName", type: "text", placeholder: "Account Name" },
    { label: amountLabel, key: amountKey, type: "number", placeholder: "000" },
    { label: "Payment Ref No.", key: "paymentRefNo", type: "text", placeholder: "Payment Ref No." },
    { label: "Payment Date", key: "paymentDate", type: "date" },
    { label: "Bank Name", key: "bankName", type: "text", placeholder: "Bank Name" },
    { label: "Closing Acc. Balance", key: "closingBalance", type: "text", placeholder: closingPlaceholder, disabled: true },
    { label: "Narration", key: "narration", type: "text", placeholder: "Narration" }
  ];
};
