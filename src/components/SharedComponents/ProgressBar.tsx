interface ProgressBarProps {
    sections: string[];
    currentSection: number;
  }
export const ProgressBar: React.FC<ProgressBarProps> = ({ sections, currentSection }) => {
    return (
      <div className="w-full flex justify-between items-center mb-6">
        {sections.map((section, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${
                index <= currentSection ? "bg-[#D32C2C]" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <p className="text-xs mt-2 text-center">{section}</p>
          </div>
        ))}
      </div>
    );
  };
  