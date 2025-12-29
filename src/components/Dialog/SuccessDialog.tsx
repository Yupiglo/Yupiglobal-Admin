// components/OTPCustom/CustomDialog.tsx
import React from "react";

interface SuccessDialogProps {
  children: React.ReactNode;
  isOpen: boolean;
}

/** Component for displaying success message Dialog Box after Sign Up or Password change*/
const SuccessDialog: React.FC<SuccessDialogProps> = ({
  children,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg p-8 lg:max-w-[30rem] md:max-w-[40rem] sm:max-w-[30rem] max-w-[23rem]">
        <div className="flex justify-center mb-6">
        </div>
        {children}
      </div>
    </div>
  );
};

export default SuccessDialog;
