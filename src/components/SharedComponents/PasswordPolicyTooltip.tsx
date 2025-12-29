"use client";

import React from "react";
import Image from "next/image";

interface PasswordPolicyTooltipProps {
  pathname: string;
  setShowTooltip: (show: boolean) => void;
}

/**  Component to render tooltip for password policy icon */
const PasswordPolicyTooltip: React.FC<PasswordPolicyTooltipProps> = ({
  pathname,
  setShowTooltip,
}) => {
  return (
    <div
      className="absolute bg-white border border-gray-300 p-2 text-sm w-[20rem] lg:w-[33rem] z-10"
      style={{ left: "-5.5rem" }}
    >
      <div className="flex items-center justify-center mb-2 border-b">
        <h2 className="text-md py-2 font-bold">Password Policy</h2>
        <span
          className="absolute right-2 cursor-pointer"
          onClick={() => setShowTooltip(false)}
        >
          <Image
            className="text-transparent"
            src="/arrow_close.svg"
            alt="Arrow Close Icon"
            width={20}
            height={20}
          />
        </span>
      </div>
      <div className="font-poppins text-[16px] font-normal leading-[24px] text-left">
        <ul className="list-disc pl-4 cursor-text">
          <li className="text-sm">
            Password must be alphanumeric and include at least 1 small letter, 1 capital letter, 1 number, and 1 special character @ _ . , - and &.
          </li>
          {!pathname.toUpperCase().includes("SIGNUP") && (
            <>
              {!pathname.toUpperCase().includes("FORGOTPASSWORD") &&
                !pathname.toUpperCase().includes("USERPROFILE") && (
                  <li className="text-sm mt-2">
                    After 3 failed attempts at the wrong password, the account
                    should be locked.
                  </li>
                )}
              {!pathname.toUpperCase().includes("LOGIN") && (
                <li className="text-sm mt-2">
                  The user should not be allowed to set the last 3 used
                  passwords.
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PasswordPolicyTooltip;
