"use client";
import React, { useEffect, useState } from 'react';

interface Option {
    label: string;
    value: string;
}

interface MultiSelectDropdownProps {
    options: Option[];
    selectedValues: string[];
    label: string;
    keyAttribute?: string;
    disabled?: boolean;
    onChange: (selectedValues: string[]) => void;
    multiSelect?: boolean;
}

const MultiSelectCheckboxesField: React.FC<MultiSelectDropdownProps> = ({
    options,
    selectedValues,
    label,
    keyAttribute = "value",
    disabled = false,
    multiSelect = true,
    onChange,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    
       // Close the dropdown when clicked outside
       const handleClickOutside = (event: MouseEvent) => {
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
        option.label?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle search term change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Handle checkbox change
    const handleCheckboxChange = (value: string) => {
        let updatedSelectedValues = [];
        if(multiSelect) {
            updatedSelectedValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        } else {
            updatedSelectedValues = selectedValues.includes(value)
            ? [] : [value];
        }
        onChange(updatedSelectedValues);
    };

    const handleFocus = () => {
    }

    const handleBlur = () => {
    }

    return (
        <div className="w-full multi-select-dropdown">
           
        <label className="block text-sm font-medium h-[1.6rem] text-customGrey mb-1.5">{label}<span className="text-red-500"> *</span></label>
        <div className="w-full border border-[#d9d9d9] h-60 rounded-md p-3 overflow-auto table-scrollbar">
                <input
                    type="text"
                    className="search-input px-3 mb-3 rounded-lg focus:border-transparent focus:outline-[#d9d9d9] border border-[#d9d9d9] w-full"
                    placeholder="Search"
                    value={searchTerm}
                    disabled={disabled}
                    onChange={handleSearchChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                />
                {filteredOptions.length > 0 ? <>
                {
                     filteredOptions.map((option: any, i: number) => {
                        return (
                        <div key={option.value + i} className="option mb-2">
                            <input
                                type="checkbox"
                                id={option.value}
                                value={option.value}
                                disabled={disabled}
                                checked={selectedValues.includes(option.value)}
                                className="p-2"
                                onChange={() => handleCheckboxChange(option.value)}
                            />
                            <label htmlFor={option.value} className={`cursor-pointer p-2 text-[#747474] ${
                                    selectedValues.includes(option.value) ? 'selected' : ''
                                  }`}>{option.label}</label>
                        </div>
                    );
                })
                }</>
                : <div className="text-[#747474]">No options found.</div>}
        </div>

        </div>
    );
};

export default MultiSelectCheckboxesField;
