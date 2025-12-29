/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FC, ChangeEventHandler } from "react";
import Image from "next/image";
import InputField from "./InputField";

interface PasswordFieldProps {
  id: string;
  name?: string;
  label: string;
  required?: boolean;
  className: string;
  error?: string;
  success?: string;
  disable?: boolean;
  maxlength?: number;
  minlength?: number;
  value?: string;
  disableIcon?: boolean;
  onBlur?: (e: any) => void;
  onClick?: (e: any) => void;
  onKeyUp?: (e: any) => void;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onMouseEnter?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onHover?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

/** Common component to render password field */
const PasswordField: FC<PasswordFieldProps> = ({
  id,
  label,
  name,
  required,
  className,
  error,
  success,
  disable,
  maxlength,
  minlength,
  value,
  disableIcon,
  onBlur,
  onClick,
  onKeyUp,
  onChange,
  onMouseEnter,
  onMouseLeave,
  onHover,
  onPaste,
  onDrop,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`w-full relative mb-2`}>
      <InputField
        label={label}
        name={name}
        type={showPassword ? "text" : "password"}
        id={id}
        className={`${className}`}
        required={required}
        //onChange={onchange}
        error={error}
        success={success}
        disabled={disable}
        minLength={minlength}
        maxLength={maxlength}
        value={value}
        disableShowIcon={disableIcon}
        onBlur={onBlur}
        onClick={onClick}
        onKeyUp={onKeyUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onPaste={onPaste}
        onDrop={onDrop}
        onChange={onChange}
        {...props}
      />
      <button
        type="button"
        className={`${id == "loginWithPassword" ? "bottom-[1rem]" : "bottom-[1.25rem]"
          } cursor-pointer absolute lg:right-2 md:right-2 sm:right-2 right-[1rem] top-[2.75rem]`}
        onClick={() => setShowPassword(!showPassword)}
      >
        <Image
          src={showPassword ? "/eye_open.svg" : "/eye_closed.svg"}
          alt={showPassword ? "Hide Password" : "Show Password"}
          width={24}
          height={24}
          style={{ width: "24", height: "24" }}
        />
      </button>
    </div>
  );
};

export default PasswordField;
