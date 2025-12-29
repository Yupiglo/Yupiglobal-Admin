/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface SelectDropDownProps {
  optionItems: any[];
  id?: string;
  labelName: string;
  keyAttribute?: string;
  required?: boolean;
  errorMsg?: string;
  onBlur?: (item: object) => void;
  onChange?: (item: object) => void;
  selectedValue: any;
  enabled?:boolean;
  customClassName?: string;
  borderClassName?: string;
}


  /**  Common component to render the dropdown
 */
const CustomDropDown: React.FC<SelectDropDownProps> = ({
  optionItems,
  id = "",
  labelName,
  keyAttribute = "",
  required = false,
  errorMsg = "",
  onBlur,
  onChange,
  selectedValue = {value: "", label: ""},
  enabled= true,
  customClassName = "",
  borderClassName= ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDdlItem, setSelectedDdlItem] = useState<any>({...selectedValue});
  const [error, setError] = useState(errorMsg);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(optionItems);
  const [isTouched, setIsTouched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  /**  event handler to open/close dropdown */
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setSearchQuery(""); // Clear the search query when toggling the dropdown
    setFilteredItems(optionItems); // Reset the filtered items when toggling
    setIsTouched(true);
  };

  /**  event handler to select dropdown option */
  const handleOptionClick = (item: object) => {
    setIsOpen(false);
    setSearchQuery(""); // Clear the search query after selection
    setSelectedDdlItem(item);
    setError("");

    if (onChange) {
      onChange(item);
    }
  };

  /**  function for focus out event on dropdown */
  // const handleBlur = () => {
  //   if (onBlur) {
  //     onBlur(selectedDdlItem);
  //   }
  //   if (required && !selectedDdlItem) {
  //     setError(
  //       `Please select a ${
  //         labelName === "Select Company" ? "Company" : labelName
  //       }.`
  //     );
  //   } else {
  //     setError("");
  //   }
  //   setIsOpen(false);
  //   setSearchQuery("");
  //   setFilteredItems(optionItems);
  // };

  /**  event handler for mouse down event on dropdown */

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
  
        if (required && !selectedDdlItem && isTouched) {
          setError(
            `Please select a ${
              labelName === "Select Company" ? "Company" : labelName
            }.`
          );
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
  }, [dropdownRef, selectedDdlItem, isTouched, labelName, optionItems, onBlur]);
  

  /**  event handler for filtering dropdown options by changing the search text */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    // setFilteredItems(
    //   optionItems.filter((item) => item.toLowerCase().startsWith(query))
    // );
    const startsWithQuery = optionItems.filter((item) =>
      item["label"].toLowerCase().startsWith(query)
    );
    const includesQuery = optionItems.filter(
      (item) =>
        !item["label"].toLowerCase().startsWith(query) &&
        item["label"].toLowerCase().includes(query)
    );

    setFilteredItems([...startsWithQuery, ...includesQuery]);

    if (required && !query && isTouched) {
      setError(
        `Please select a ${
          labelName === "Select Company" ? "Company" : labelName
        }.`
      );
    } else {
      setError("");
    }
  };

  useEffect(() => {
    setFilteredItems(optionItems);
  }, [optionItems]);

  return (
    <div
      className={`${error ? "h-[6rem]" : "h-[4.8rem]"}`}
      ref={dropdownRef}
      // tabIndex={0}
    >
      <label className={`block text-sm font-medium h-[1.6rem] ${customClassName}`}>
        {labelName}
        {required && <span className="text-red-500 text-sm">*</span>}
      </label>
      <div
        className={`relative mt-1 px-2 border border-customBorder rounded-md text-sm cursor-pointer focus:outline-none h-[1.9rem] max-w-full z-1 ${borderClassName}`}
        onClick={handleToggle}
        aria-disabled={!enabled}
      >
        <input
          id={"customDropDownInput"+id}
          className="absolute top-0 left-0 w-full h-full px-2 rounded-md focus:outline-none pr-10"
          onChange={handleSearch}
          readOnly={!isOpen}
          value={isOpen ? searchQuery : selectedValue.label ? selectedValue.label : ""}
          disabled={!enabled}
        />
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Image
            src="/arrow_down.svg"
            alt="arrow_down"
            width={24}
            height={24}
          />
        </span>
      </div>
      {isOpen && enabled && (
        <div className="absolute mt-1 pl-1 py-2 lg:w-[22rem] w-[22.25rem] rounded-md bg-white max-h-60 overflow-y-auto border-2 border-customBorder custom-scrollbar z-10">
          {filteredItems.map((optionItem) => (
            <div
              key={optionItem[keyAttribute || "value"]}
              className={`cursor-pointer p-1 hover:bg-customGreen hover:text-white ${
                selectedDdlItem.value === optionItem["value"] ? 'selected text-customGreen' : ''
              }`}
              onClick={() => handleOptionClick(optionItem)}
            >
              {optionItem["label"]}
            </div>
          ))}
        </div>
      )}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default CustomDropDown;
