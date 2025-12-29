"use client";
import React, { useEffect, useState, useRef } from 'react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedValues: string[];
  label: string;
  dropdownId: string;
  disabled?: boolean;
  onChange: (selectedValues: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  label,
  dropdownId = "dropownId",
  disabled = false,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

   // Close the dropdown when clicked outside
   const handleClickOutside = (event: MouseEvent) => {

    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

   // Add event listener for clicks outside
   useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prevState) => !prevState);

  // Handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle option selection
  const handleOptionToggle = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value) // Remove if already selected
      : [...selectedValues, value]; // Add if not selected
    onChange(newSelectedValues);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  }

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <button className="multi-select-header" onClick={toggleDropdown}>
        <label className="block text-sm font-medium h-[1.6rem] text-customGrey" htmlFor={dropdownId}>{label}</label>
      </button>
      
        <div className={`dropdown-menu flex border border-slate-200 px-3 py-2 mt-1 rounded w-full h-[2.6rem] ${disabled ? "bg-[#fafafa]" : ""}`}>
        <div className="selected-options">
          {selectedValues.length === 0
            ? 'Select options'
            : selectedValues.join(', ')}
        </div>
          <input
            id={dropdownId}
            type="text"
            className="search-input px-3 focus:border-transparent focus:outline-none"
            placeholder="Search..."
            value={searchTerm}
            disabled={disabled}
            onChange={handleSearchChange}
            onFocus={handleFocus}
          />
        </div>
        {isOpen && <div className="options-list absolute mt-1 pl-4 py-4 lg:w-[29rem] w-[22.25rem] rounded-md bg-white max-h-60 overflow-y-auto border-2 border-customBorder custom-scrollbar z-10" 
            >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionToggle(option.value)}
                  className={`cursor-pointer p-2 hover:bg-green-500 hover:text-white ${
                    selectedValues.includes(option.value) ? 'selected text-green-500' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div>No options found</div>
            )}
          </div>}
    </div>
  );
};

export default MultiSelectDropdown;
