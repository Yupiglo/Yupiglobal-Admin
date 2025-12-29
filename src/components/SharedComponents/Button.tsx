import React from "react";
import  classNames from 'classnames' 

interface ButtonProps {
  text: string;
  btnType?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean; // New prop to control `w-full`
  bgColor?: string;
  textColor?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  btnType,
  className,
  disabled,
  loading,
  fullWidth = true, //Default to `true` to maintain current behavior
  onClick,
  ...props
}) => {
  return (
    <div className={classNames({ "w-full": fullWidth }, "cursor-pointer p-1 font-thin transition ease-in duration-200 text-base flex items-end justify-center")}>
      <button
        type={btnType}
        className={classNames(className, {
          "h-auto" : !disabled && !loading,
          "hover:cursor-not-allowed h-auto": disabled || loading,
        })}
        {...props}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? (
          <svg
            width="20"
            height="20"
            fill="currentColor"
            className="mr-2 animate-spin"
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
          </svg>
        ) : (
          text
        )}
      </button>
    </div>
  );
};

export default Button;