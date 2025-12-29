/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { forwardRef, useState } from "react";

interface TextAreaProps {
  label: string;
  maxLength?: number;
  minLength?: number;
  required?:boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}


  /**  Common component to render the text area field in QRC form
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, maxLength, minLength, required=false ,onChange, onBlur}, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");

    /** callback function for change event on text area field */
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
      if (maxLength && inputValue.length > maxLength) {
        setInputValue(inputValue.slice(0, maxLength));
      }
      if (minLength && inputValue.length < minLength) {
        setError(`${label} must be at least ${minLength} characters long.`);
      } else {
        setError("");
      }
      if (onChange) {
        onChange(event);
      }
    };

    /** callback function for focus out event on text area field */
    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      
      if (!inputValue && required) {
        setError(`${label} is Required.`);
      }
      // Call the passed onBlur handler if it exists
      if (onBlur) {
        onBlur(event);
      }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
    };

    return (
      <div className="mt-1">
        <label className="block text-sm font-medium h-[1.6rem]">
          {label}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          ref={ref}
          minLength={minLength}
          maxLength={maxLength}
          required={required}
          className="mt-1 block w-full p-2 border border-customBorder rounded-md min-h-32 focus:outline-none"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
