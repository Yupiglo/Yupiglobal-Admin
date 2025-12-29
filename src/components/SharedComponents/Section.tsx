import React from "react";
import { ChevronsUp, ChevronsDown } from "lucide-react";

interface SectionProps {
  title: string;
  sectionId: number;
  expandedSections: Set<number>;
  toggleSection: (sectionId: number) => void;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  sectionId,
  expandedSections,
  toggleSection,
  children,
}) => (
  <div className="mt-6">
    {/* Expand/Collapse Button */}
    <button
      type="button"
      className="bg-customGreen p-3 rounded-t-xl flex justify-between items-center text-white w-full"
      onClick={() => toggleSection(sectionId)}
      aria-expanded={expandedSections.has(sectionId)}
    >
      <span className="font-semibold">{title}</span>
      <span className="text-xl">
        {expandedSections.has(sectionId) ? <ChevronsUp /> : <ChevronsDown />}
      </span>
    </button>

    {/* Collapsible Content */}
    <div
      className={`transition-all duration-500 ease-in-out overflow-none ${
        expandedSections.has(sectionId)
          ? "max-h-screen opacity-100 p-5 bg-transparent rounded-bl-xl rounded-br-xl border border-customBorder"
          : "max-h-0 opacity-0"
      }`}
      style={{
        overflow: expandedSections.has(sectionId) ? "visible" : "hidden", // 🔥 FIX: Prevents UI blocking
        display: expandedSections.has(sectionId) ? "block" : "none", // 🔥 FIX: Ensures clickable sections
      }}
    >
      {children}
    </div>
  </div>
);

export default Section;
