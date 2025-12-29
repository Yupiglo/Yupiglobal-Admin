"use client";
import Image from "next/image";
import React from "react";

interface SidebarItemProps {
  label: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isOpen?: boolean;
  toggleOpen?: () => void;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  isActive,
  icon,
  children,
  isOpen,
  toggleOpen,
  onClick,
}) => {

  return (
    <div className="relative mb-1">
      <button
        className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 
        ${isActive
            ? "bg-blue-50 text-blue-700 shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        onClick={() => {
          if (toggleOpen) {
            toggleOpen();
          } else if (onClick) {
            onClick();
          }
        }}
      >
        <span className={`transition-colors duration-200 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
          {icon}
        </span>

        <span className="ml-3 flex-1 text-left tracking-wide">{label}</span>

        {children && (
          <span className={`ml-auto transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </span>
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default SidebarItem;
