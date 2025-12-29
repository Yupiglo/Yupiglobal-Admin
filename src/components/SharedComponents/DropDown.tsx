"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface SelectDropDownProps {
  optionItems: string[];
  labelName: string;
  dropdownId?: string;
  required?: boolean;
  errorMsg?: string;
  onBlur?: (value: string) => void;
  onChange?: (value: string) => void;
  selectedValue?: string;
  enabled?: boolean;
  customClassName?: string;
  borderClassName?: string;
}

/**  Common component to render the dropdown in QRC views */
const DropDown: React.FC<SelectDropDownProps> = ({
  optionItems,
  labelName,
  dropdownId = "",
  required = false,
  errorMsg = "",
  onBlur,
  onChange,
  selectedValue = "",
  enabled = true,
  customClassName = "",
  borderClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDdlItem, setSelectedDdlItem] = useState(selectedValue);
  const [error, setError] = useState(errorMsg);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(
    [...optionItems].sort((a, b) => a.localeCompare(b)) // Sort alphabetically
  );
  const [isTouched, setIsTouched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**  Open/Close Dropdown */
  const handleToggle = () => {
    if (!enabled) return;
    setIsOpen(!isOpen);
    setSearchQuery("");
    setFilteredItems(optionItems);
    setIsTouched(true);
  };

  /**  Select Dropdown Option */
  const handleOptionClick = (value: string) => {
    if (!enabled) return;
    setIsOpen(false);
    setSearchQuery("");
    setSelectedDdlItem(value);
    setError("");

    if (onChange) {
      onChange(value);
    }
  };

  /**  Close Dropdown When Clicking Outside */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);

        if (required && !selectedDdlItem && isTouched) {
          setError(`Please select a ${labelName}.`);
        } else {
          setError("");
        }

        setSearchQuery("");
        setFilteredItems(optionItems);
        if (onBlur) {
          onBlur(selectedDdlItem);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedDdlItem, isTouched, labelName, optionItems, onBlur]);

  /**  Filter Dropdown Options */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!enabled) return;

    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = optionItems
      .filter((item) => item.toLowerCase().includes(query)) // Filter matching items
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();

        const aStartsWith = aLower.startsWith(query);
        const bStartsWith = bLower.startsWith(query);

        if (aStartsWith && !bStartsWith) return -1; // `a` comes first if it starts with the query
        if (!aStartsWith && bStartsWith) return 1; // `b` comes first if it starts with the query

        return aLower.localeCompare(bLower); // Otherwise, sort alphabetically
      });

    setFilteredItems(filtered);
  };

  useEffect(() => {
    setSelectedDdlItem(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    setFilteredItems(optionItems);
  }, [optionItems]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label
        className={`text-sm font-medium text-customGrey px-1 flex flex-row gap-1 ${customClassName}`}
      >
        {labelName}
        {required && <span className={`text-customRed text-sm`}>*</span>}
      </label>

      {/* Dropdown Button */}
      <button
        type="button"
        className={`relative w-full my-1 px-2 border border-customBorder rounded-md text-sm cursor-pointer focus:outline-none h-[1.9rem] max-w-full disabled:opacity-50 ${borderClassName}`}
        onClick={handleToggle}
        disabled={!enabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Input Field */}
        <input
          id={`dropDownInput${dropdownId}`}
          className="absolute inset-0 w-full h-full px-2 rounded-md pr-10 text-black focus:outline-none"
          onChange={handleSearch}
          readOnly={!isOpen}
          value={isOpen ? searchQuery : selectedDdlItem}
          disabled={!enabled}
        />

        {/* Dropdown Arrow */}
        <span className="absolute inset-y-0 right-2 flex items-center">
          <Image
            src="/arrow_down.svg"
            alt="Dropdown Arrow"
            width={24}
            height={24}
          />
        </span>
      </button>

      {/* Floating Dropdown List */}
      {isOpen && enabled && (
        <div className="absolute top-full left-0 w-full bg-white max-h-60 overflow-y-auto border-2 shadow-lg rounded-md z-50">
          {filteredItems.length > 0 ? (
            filteredItems.map((optionItem) => (
              <button
                key={optionItem}
                type="button"
                className={`block w-full cursor-pointer p-2 hover:bg-customGreen hover:text-white text-sm font-medium ${
                  selectedDdlItem.includes(optionItem)
                    ? "text-customGreen"
                    : "text-black"
                }`}
                onClick={() => handleOptionClick(optionItem)}
              >
                {optionItem}
              </button>
            ))
          ) : (
            <p className="p-2 text-sm text-gray-500">No options available</p>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <span className="text-customRed text-xs">{error}</span>}
    </div>
  );
};

export default DropDown;
