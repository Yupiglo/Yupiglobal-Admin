"use client";

import React, { forwardRef, useState } from "react";
import InputField from "./InputField";

interface TextFieldProps {
  value:string,
  label: string;
  type?: string;
  required:boolean
  className:string;
  maxLength?: number;
  minLength?: number;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search"
    | undefined;
  success?: string;
  apierror?: string;
}

  /**  Common component to render the text input field in QRC forms
 */
const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      type = "text",
      maxLength,
      minLength,
      onBlur,
      onChange,
      inputMode,
      success,
      apierror,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");

    /**  callback function for text input field*/
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      // console.log(inputValue);
      if (label.toUpperCase().includes("FOLIO")) {
        const value = event.target.value;

        // Remove spaces and special characters using a regex
        const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");

        setInputValue(filteredValue);

        // Optionally, you can add an error message if the user tries to input invalid characters
        if (filteredValue !== value) {
          setError("Spaces and special characters are not allowed.");
        } else {
          // console.log(filteredValue);
          setError("");
        }
      }
      if (minLength && event.target.value.length < minLength) {
        // console.log(inputValue);
        setError(
          `${
            label.toUpperCase().includes("DPID") ? "DPID" : label
          } must be at least ${minLength} characters long.`
        );
      } else {
        setError("");
      }

      if (onChange) {
        onChange(event);
      }
    };

    /**  callback function for key down event on text field */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      const key = event.key;

      if (
        !/^\d$/.test(key) &&
        key !== "Backspace" &&
        key !== "Delete" &&
        key !== "ArrowLeft" &&
        key !== "ArrowRight"
      ) {
        event.preventDefault();
      }

      if (
        maxLength &&
        inputValue.length >= maxLength &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        key !== "Backspace" &&
        key !== "Delete"
      ) {
        event.preventDefault();
      }
    };

    /** callback function for focus out on text field */
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (maxLength && inputValue.length > maxLength) {
        setInputValue(inputValue.slice(0, maxLength));
      }
      if (inputValue.length === 0) {
        setError(
          `${
            label.toUpperCase().includes("DPID") ? "DPID" : label
          } is Required.*`
        );
      }
      // Call the passed onBlur handler if it exists
      if (onBlur) {
        onBlur(event);
      }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLInputElement>) => {
      event.preventDefault();
    };

    let inputField;

    if (label.toUpperCase() === "DPID NSDL") {
      inputField = (
        <div
          className={`${
            error || success || apierror ? "h-[6rem]" : "h-[4.8rem]"
          }`}
        >
          <label className="block text-sm font-medium h-[1.6rem]">
            DPID
            <span className="text-red-500">*</span>
          </label>
          <div className="bg-white border border-customBorder rounded-md flex mt-1">
            <span className="w-1/12 border-r border-r-customBorder flex flex-row items-center justify-center h-[2.6rem]">
              IN
            </span>
            <input
              type={type}
              id={label}
              required={true}
              maxLength={maxLength}
              minLength={minLength}
              className="w-11/12 p-2 flex flex-row rounded-md text-sm h-[2.6rem] focus:outline-none"
              ref={ref}
              value={inputValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          </div>
          {(error || apierror) && (
            <span className="text-red-500 text-xs">{error || apierror}</span>
          )}
          {success && (
            <p className="h-[0.9rem] text-green-500 text-xs mt-1">{success}</p>
          )}
        </div>
      );
    } else if (label.toUpperCase() === "DPID CDSL") {
      inputField = (
        <InputField
          label="DPID"
          type={type}
          id={label}
          required={true}
          maxLength={maxLength}
          minLength={minLength}
          className="mt-1.5 block w-full p-2 border border-customBorder rounded-md text-sm"
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onDrop={handleDrop}
          error={error || apierror}
          inputMode={inputMode}
          success={success}
        />
      );
    } else if (label.toUpperCase() === "CLIENT ID") {
      inputField = (
        <InputField
          label={label}
          type={type}
          id={label}
          required={true}
          maxLength={maxLength}
          minLength={minLength}
          className="mt-1.5 block w-full p-2 border border-customBorder rounded-md text-sm"
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onDrop={handleDrop}
          error={error || apierror}
          inputMode={inputMode}
          success={success}
        />
      );
    } else if (label.toUpperCase() === "FOLIO") {
      inputField = (
        <InputField
          label={label}
          type={type}
          id={label}
          required={true}
          maxLength={maxLength}
          minLength={minLength}
          className="mt-1 block w-full p-2 border border-customBorder rounded-md text-sm"
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onDrop={handleDrop}
          error={error}
          inputMode={inputMode}
        />
      );
    } else if (label.toUpperCase().includes("FOLIO DETAILS")) {
      inputField = (
        <InputField
          label={label}
          type={type}
          id={label}
          required={true}
          maxLength={maxLength}
          minLength={minLength}
          className="mt-1 block w-full p-2 border border-customBorder rounded-md text-sm"
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error}
          inputMode={inputMode}
        />
      );
    } else if (label.toUpperCase().includes("MOBILE")) {
      inputField = (
        <input
          type={type}
          id={label}
          required={true}
          maxLength={maxLength}
          minLength={minLength}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
        />
      );
    } else if (label.toUpperCase().includes("EMAIL")) {
      inputField = (
        <input
          type={type}
          id={label}
          required={true}
          maxLength={maxLength}
          minLength={minLength}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onDrop={handleDrop}
        />
      );
    } else if (label.toUpperCase().includes("OTP")) {
      inputField = (
        <input
          type={type}
          id={label}
          required={true}
          maxLength={maxLength}
          minLength={minLength}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onDrop={handleDrop}
          pattern="^[0-9]$"
        />
      );
    } else {
      inputField = (
        <InputField
          label={label}
          type={type}
          id={label}
          className="mt-1 block w-full p-2 border border-customBorder rounded-md text-sm"
          ref={ref}
        />
      );
    }

    return (
      <div>
        {/* <label className="block text-sm font-medium text-gray-700">
          {label}
          <span className="text-red-500 text-sm">*</span>
        </label> */}
        {inputField}
        {/* {error && <span className="text-red-500 text-xs">{error}</span>} */}
      </div>
    );
  }
);
TextField.displayName = "TextField";

export default TextField;
