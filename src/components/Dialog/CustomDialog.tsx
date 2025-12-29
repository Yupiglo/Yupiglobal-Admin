"use client";

import React from "react";
import Logo from "../SharedComponents/Logo";
import classNames from "classnames";

interface CustomDialogProps {
  className?: string;
  heading: string;
  action: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

/** Common component to render dialog box with heading */
const CustomDialog: React.FC<CustomDialogProps> = ({
  heading,
  className,
  action,
  children,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed font-poppins inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={classNames(
          "bg-white shadow-lg w-full h-vh lg:max-w-[58rem] md:max-w-[58rem] sm:max-w-full p-4 relative rounded-xl",
          className
        )}
      >
        {/* Close button always on top-right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 text-gray-500 hover:text-red-600 transition"
        >
          <Logo
            className="text-transparent"
            src="/cross.svg"
            alt="Close Icon"
            width={24}
            height={24}
          />
        </button>

        {/* Heading (optional) */}
        {heading && (
          <div className="flex justify-between items-center mb-3 border-b">
            <h2 className="text-md py-2 font-semibold text-center w-full">
              {heading}
            </h2>
          </div>
        )}

        {/* Optional Illustration */}
        {action === "Custom" && (
          <div className="flex justify-center mb-3">{/* Custom content here */}</div>
        )}
        {children}
      </div>
    </div>
  );
};

export default CustomDialog;
