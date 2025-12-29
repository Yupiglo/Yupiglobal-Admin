import React, { ReactNode } from "react";

interface BoxProps {
  children: ReactNode;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={`
        bg-white shadow-md rounded-2xl p-4 border border-customBorder
        max-w-full sm:max-w-full md:max-w-full lg:max-w-full xl:max-w-full
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Box;
