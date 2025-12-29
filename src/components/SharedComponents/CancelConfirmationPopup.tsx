"use client";
import React from "react";

interface CancelConfirmationPopupProps {
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
}

const CancelConfirmationPopup: React.FC<CancelConfirmationPopupProps> = ({
    onConfirm,
    onCancel,
    message = "Unsaved changes will be lost. Are you sure you want to cancel?"
}) => {
    return (
        <div className="fixed font-poppins inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white shadow-lg w-70 p-4 relative rounded-md">
                <div className="text-center mb-3">{message}</div>
                <div className="flex w-full gap-x-6 justify-center items-center h-[3rem]">
                    <button
                        onClick={onConfirm}
                        className="h-6 rounded-md bg-[#247fe6] text-white border border-[#247fe6] text-xs py-1 px-2 cursor-pointer"
                    >
                        OK
                    </button>
                    <button
                        onClick={onCancel}
                        className="h-6 rounded-md bg-[#f5f7fd] text-[#343434] border border-[#707070]] text-xs py-1 px-2 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelConfirmationPopup;
