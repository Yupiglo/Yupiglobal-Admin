"use client";

import React, { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

interface CustomDatePickerProps {
  selectedDate?: Date | null;
  setSelectedDate?: (date: Date | null) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  showLabel?: boolean; // ← New prop to toggle label
  required?: boolean; // <-- Add this
  customWrapperClass?: string;
  disabled?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  setSelectedDate,
  label = "Select Dates",
  minDate,
  maxDate = new Date(Date.now()),
  showLabel = true, // ← default to true
  required = true,
  disabled = false,
  customWrapperClass = "",
}) => {
  const datepickerRef = useRef<DatePicker | null>(null);
  const datepickerId = "from-date-picker" + label;

  const handleDateInput = (
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLElement>
  ) => {
    if (!event) return; // Ensure event is defined
    if (!("target" in event) || !(event.target instanceof HTMLInputElement))
      return; // Ensure event has a valid target
    const input = event.target; // Ensure correct event type
    const value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
    let formattedValue = "";

    if (value.length > 0) {
      formattedValue = value.substring(0, 2); // dd
    }
    if (value.length > 2) {
      formattedValue += "/" + value.substring(2, 4); // mm
    }
    if (value.length > 4) {
      formattedValue += "/" + value.substring(4, 8); // yyyy
    }
    input.value = formattedValue; // Update input field value
  };

  return (
    <div className="relative flex-col items-center justify-center w-full ">
      {/* Label */}
      {showLabel && (
        <label
          htmlFor={datepickerId}
          className="block text-sm font-medium text-[#747474]"
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {/* Input Wrapper */}
      <div
        className={`relative ${showLabel ? "mt-1" : ""} ${customWrapperClass}`}
      >
        <DatePicker
          id={datepickerId}
          ref={datepickerRef}
          selected={selectedDate}
          onChange={setSelectedDate}
          dateFormat="dd/MM/yyyy"
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="DD/MM/YYYY"
          calendarClassName="custom-calendar"
          className="w-full px-4 py-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm pr-10"
          onChangeRaw={handleDateInput}
          disabled={disabled}
        />

        {/* Calendar Icon - Clicking it will open the datepicker */}
        <button
          className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
          onClick={() => datepickerRef.current?.setOpen(true)} // Opens DatePicker on click
        >
          <Calendar className="text-gray-400 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;
