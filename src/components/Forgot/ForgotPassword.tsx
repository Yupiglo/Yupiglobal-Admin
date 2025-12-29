"use client";

import React, { useState, useEffect } from "react";
import Button from "../SharedComponents/Button";
import { useRouter } from "next/navigation";
import { FieldValidationCheck } from "../../utils/fieldsValidationCheck";
import { ForgotPassword, VerifyOtp } from "@/libs/loginService";
import { useLoader } from "@/hooks/Loader";
import Loader from "../SharedComponents/Loader";
import InputField from "../SharedComponents/InputField";
import OtpInput from "../SharedComponents/OtpInput";
import { toast } from "react-toastify";

export const ForgotOtpScreen = () => {
  const [otp, setOTP] = useState("");
  const [email, setEmail] = useState("");
  const [emailReadonly, setEmailReadonly] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false); // Hide OTP field initially
  const [showResend, setShowResend] = useState(false);
  const [timer, setTimer] = useState(0);
  const router = useRouter();
  const { loading, showLoader, hideLoader } = useLoader();

  // Send OTP Handler
  const handleSendOTP = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!(await FieldValidationCheck(email, "email"))) {
      toast.error("Please enter a valid email.");
      return;
    }
    try {
      const response = await ForgotPassword(email, showLoader, hideLoader);
      if (response.status === 200) {
        toast.success("OTP sent successfully.");
        setEmailReadonly(true);
        setShowOTPField(true); // Show OTP field only after success
        setShowResend(true);
        startResendTimer();
      } else {
        toast.error(`Failed to send OTP - ${response.responseMsg}`);
      }
    } catch (error) {
      console.error("Error while sending OTP:", error);
      toast.error("An error occurred while sending OTP.");
    }
  };

  // OTP Verification Handler
  const handleVerifyOTP = async (event: React.FormEvent) => {
    event?.preventDefault();
    if (!otp) {
      toast.warn("Please enter the OTP.");
      return;
    }

    try {
      const response = await VerifyOtp(email, otp, showLoader, hideLoader);
      if (response.status === 200) {
        toast.success("OTP verified successfully.");
        sessionStorage.setItem("isOtpVerified", "Verified");
        sessionStorage.setItem("p", email);
        router.push(`/resetPassword`);
      } else {
        toast.error(response.responseMsg || "Invalid OTP.");
      }
    } catch (error) {
      console.error("OTP Verification Failed:", error);
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  // Start a 30-second resend timer
  const startResendTimer = () => {
    setTimer(30);
  };

  // Countdown effect for timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <>
      <div
        className={`w-[80%] mx-auto h-fit ${
          loading ? "filter blur-sm" : ""
        }`}
      >
        <div className="flex flex-col justify-center gap-6">
          <h2 className="text-2xl font-bold text-center text-customBlack">
            Forgot your Password?
          </h2>
          <h4 className="text-lg font-light text-center">
            To reset your password, enter your Email id
          </h4>
        </div>

        {/* Form Section */}
        <form
          className="mt-8 space-y-6"
          onSubmit={showOTPField ? handleVerifyOTP : handleSendOTP}
        >
          {/* Email Input */}
          <InputField
            id="emailOtp"
            name="emailOtp"
            type="email"
            label="Enter your Registered Email ID"
            value={email}
            required
            readOnly={emailReadonly}
            className="bg-customInputBackground h-[3.24rem] px-4"
            onChange={(e) => setEmail(e.target.value.trim())}
          />
          <p className="text-sm text-customGrey">
            OTP for reset password will be sent to your registered email
            address, if account is valid.
          </p>

          {/* OTP Input Section (Hidden Initially) */}
          {showOTPField && (
            <div className="relative w-full">
              {/* Resend OTP or Timer Above Input */}
              {showResend && (
                <div className="flex flex-row justify-between text-gray-600 text-sm my-4">
                  <p>Enter your OTP here</p>
                  {timer > 0 && (
                    <div>
                      <span>00:{timer < 10 ? `0${timer}` : timer}s</span>
                    </div>
                  )}
                </div>
              )}

              {/* OTP Input Field */}
              <div className="w-full border-2 bg-customInputBackground h-[3.24rem] rounded-md focus:outline-none focus:ring-0 px-4 py-1">
                <OtpInput
                  length={6}
                  onOtpSubmit={(enteredOtp) => setOTP(enteredOtp)}
                />
              </div>

              {showResend && (
                <div className="my-2 w-full text-center justify-center flex flex-row gap-2 text-customGrey">
                  <p>Don&apos;t receive OTP? </p>
                  <button
                    className="text-xs text-customBlue underline"
                    onClick={handleSendOTP}
                    type="button"
                    aria-label="Resend OTP"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit Button (Changes Action Dynamically) */}
          <Button
            text={showOTPField ? "Verify OTP" : "Send OTP"}
            btnType={showOTPField ? "submit" : "button"}
            className={`w-full my-2 py-2 text-white bg-customBlue rounded-lg ${
              showOTPField && !otp ? "cursor-not-allowed" : ""
            }`}
            disabled={showOTPField && !otp}
            onClick={!showOTPField ? handleSendOTP : undefined}
          />
        </form>
      </div>
      <Loader isOpen={loading} />
    </>
  );
};
