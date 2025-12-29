// components/common/ConfirmationDialog.tsx

"use client";

import React from "react";
import CustomDialog from "@/components/Dialog/CustomDialog";
import { Button } from "@/components"; // Update path as needed

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
  heading?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = "Ok",
  cancelText = "Cancel",
  heading = "",
}) => {
  return (
    <CustomDialog
      heading={heading}
      action="Custom"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="justify-center flex my-3 text-sm text-center">
        {message}
      </div>
      <div className="flex justify-center gap-4 mt-2">
        <Button
          text={confirmText}
          className="bg-[#247FE6] text-white text-sm font-medium py-2 px-8 rounded"
          fullWidth={false}
          onClick={onConfirm}
        />
        <Button
          text={cancelText}
          className="bg-gray-200 text-black text-sm font-medium py-2 px-4 rounded"
          fullWidth={false}
          onClick={onClose}
        />
      </div>
    </CustomDialog>
  );
};

export default ConfirmationDialog;
