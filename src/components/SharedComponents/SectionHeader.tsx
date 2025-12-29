import React from "react";

interface SectionHeadingProps {
  title: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title }) => {
  return (
    <div className="flex items-center bg-green-100 px-4 py-2 rounded-md">
      <div className="bg-[#007c4a] w-2 h-8 mr-2 rounded-sm"></div>
      <span className="text-gray-900 font-semibold text-lg ml-6">
        {title}
      </span>
    </div>
  );
};

export default SectionHeading;