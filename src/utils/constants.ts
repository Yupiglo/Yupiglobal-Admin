
export interface ColumnConfig {
    label: string;
    key: string;
    type: "text" | "number" | "date";
    placeholder?: string;
    disabled?: boolean;
    className?: string;
  }

export const baseColumns: ColumnConfig[] = [
    {
        label: "Account Name/Sub Ledger",
        key: "accountName",
        type: "text",
        placeholder: "Account Name/Sub Ledger",
    },
    {
        label: "Debit Amount",
        key: "debitAmount",
        type: "number",
        placeholder: "0.00",
    },
    {
        label: "Credit Amount",
        key: "creditAmount",
        type: "number",
        placeholder: "0.00",
    },
    {
        label: "Narration",
        key: "narration",
        type: "text",
        placeholder: "Narration",
    },
    {
        label: "Closing Acc. Balance",
        key: "closingBalance",
        type: "text",
        placeholder: "0.00 Cr.",
        disabled: true,
    },
];

export const exportColumns = [
    { label: "Account Name/Sub Ledger", key: "accountName", sortable: false },
    { label: "Debit Amount", key: "debitAmount", sortable: false },
    { label: "Credit Amount", key: "creditAmount", sortable: false },
    { label: "Credit Amt", key: "creditAmount", sortable: false },
    { label: "Narration", key: "narration", sortable: false },
    { label: "Closing Acc. Balance", key: "closingBalance", sortable: false },
];
