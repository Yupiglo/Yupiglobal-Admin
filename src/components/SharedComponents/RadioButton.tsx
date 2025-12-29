"use client";

import React from "react";

interface RadioButtonProps {
  selectRadioButton: string;
  setSelectRadioButton?: React.Dispatch<React.SetStateAction<string>>;
  radioButtonOptions: string[];
  labelName: string;
  buttonType: string;
  onChange?: (e: React.FocusEvent<HTMLDivElement>) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  selectRadioButton,
  setSelectRadioButton,
  radioButtonOptions,
  labelName,
  buttonType, // radio or button
  onChange,
}) => {
  const handleRadioChange = (option: string) => {
    if (setSelectRadioButton) setSelectRadioButton(option);
  };

  return (
    <div className="h-[4.8rem]">
      <label className="block text-sm font-medium h-[1.6rem] text-gray-700">
        {labelName}
      </label>
      <div className="mt-1 flex space-x-4">
        {radioButtonOptions.map((option) => (
          <label key={option}>
            {buttonType === "radio" && <span>{option}</span>}
            <input
              type="radio"
              name="radioGroup"
              value={option}
              checked={selectRadioButton === option}
              onChange={() => handleRadioChange(option)} // Pass the updated value to the parent
              className={`${
                buttonType === "radio" ? "visible" : "hidden"
              } ml-3 items-center ${
                selectRadioButton === option
                  ? "!bg-customGreen text-white font-bold"
                  : "bg-white text-black"
              }`}
            />
            {buttonType !== "radio" && (
              <span
                className={`w-full px-4 py-2 rounded-full border border-customBorder text-xs cursor-pointer ${
                  selectRadioButton === option
                    ? "bg-customGreen text-white font-bold"
                    : "bg-white text-black"
                }`}
              >
                {option}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButton;
