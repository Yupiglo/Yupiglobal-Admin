/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEventHandler, InputHTMLAttributes, JSX } from "react";

export interface ModalData {
  heading: string;
  action: string;
  buttonText: string;
  popupContent: JSX.Element;
}

export interface DialogData {
  heading: string;
  action: string;
  buttonText: string;
  isOpen: boolean;
}

export interface OTPVerificationData extends DialogData {
  otpMessage: string;
  otpPlaceholder: string;
}

export interface PasswordPolicyData extends DialogData {
  policyItems: string[];
}

export interface OtpVerificationDialogProps {
  id?: any;
  title: string;
  isOpen: boolean;
  action: string;
  otp: string;
  mobile?: string;
  email?: string;
  formData: { mobile?: string; email?: string };
  errorClass: string;
  successClass?: string;
  loader?: boolean;
  otpError: string | null;
  resendOtpMsg?: string | null;
  resendOtpFlag?: boolean;
  resendOtpLimit?: boolean;
  cryptoConfig: any;
  token?: string;
  userDetails?: any;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  onResend?: () => void;
  handleOtpChange?: (id: string, val: string) => void;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name?: string;
  label?: string;
  type?: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  disableShowIcon?: boolean;
  inputMode?:
  | "none"
  | "text"
  | "tel"
  | "url"
  | "email"
  | "numeric"
  | "decimal"
  | "search"
  error?: string | null;
  success?: string | null;
  readonly?: boolean;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onMouseEnter?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onHover?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

export interface ApiResponse {
  // Define the structure of the response object if known
  [key: string]: any;
}

export interface ApiResponseGeneric<T> {
  status: number;
  responseMsg: {
    status: number;
    message: string;
    data: T;
  };
}


export interface Privilege {
  menuId: number;
  menuName: string;
  subMenus: SubMenu[];
}
export interface SubMenu {
  subMenuId: number;
  subMenuName: string;
  url: string;
  privileges: string[];
}
type NullableDate = string | Date | null;
