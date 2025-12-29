"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "../SharedComponents/Button";
import PasswordField from "../SharedComponents/PasswordField";
import { ChangePassword } from "../../libs/loginService";
import { useLoader } from "@/hooks/Loader";
import Loader from "../SharedComponents/Loader";
import { clearLocalStorage } from "@/utils/clearStorage";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const router = useRouter();
  const { loading, showLoader, hideLoader } = useLoader();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPasswordChanged, setIsPasswordChanged] = useState<boolean>(false);

  useEffect(() => {
    const isOtpVerified = sessionStorage.getItem("isOtpVerified");
    const emailStored = sessionStorage.getItem("p");

    if (!isOtpVerified || isOtpVerified !== "Verified" || !emailStored) {
      router.push("/forgotPasswordOtp");
    } else {
      setEmail(emailStored || ""); // Retrieve email from session storage
    }
  }, []);

  const validatePassword = (
    value: string,
    type: "password" | "re-enterPassword"
  ) => {
    debugger;
    const passwordPolicyRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

    if (type === "password") {
      setPassword(value);
      if (!passwordPolicyRegex.test(value)) {
        toast.error(
          "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character."
        );
        return;
      }
    } else if (type === "re-enterPassword") {
      setConfirmPassword(value);
      if (value !== password) {
        toast.error("The New Password and Confirm Password do not match.");
        return;
      }
    }
  };

  const handleRedirect = () => {
    clearLocalStorage();
    sessionStorage.clear();
    router.push("/login");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    debugger;
    if (!email) {
      toast.error(
        "Email is missing. Please start the process from the beginning."
      );
      return;
    }

    try {
      const response = await ChangePassword(
        email,
        password,
        showLoader,
        hideLoader
      );

      if (response.status === 200 && response.responseMsg?.status === 200) {
        setIsPasswordChanged(true);
        setTimeout(() => {
          handleRedirect();
        }, 10000);
      } else {
        toast.error(
          `Failed to update password ${response.responseMsg?.message}`
        );
      }
    } catch (err) {
      toast.error(`An unexpected error occurred. Please try again ${err}`);
    }
  };

  return (
    <>
      <div
        className={`w-[80%] mx-auto h-fit ${
          loading ? "filter blur-sm" : ""
        }`}
      >
        {!isPasswordChanged ? (
          <div>
            <div className="flex flex-col justify-center py-6">
              <h2 className="text-2xl font-bold text-center text-customBlack">
                Reset your password
              </h2>
              <h4 className="text-lg font-light text-center">
                The password should have at least 6 characters
              </h4>
            </div>
            <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
              <PasswordField
                id="password"
                name="password"
                label="New Password"
                onBlur={(e) => validatePassword(e.target.value, "password")}
                required
                className="bg-customInputBackground h-[3.24rem] px-4 py-2 mt-1 block w-full border rounded-md"
              />
              <PasswordField
                id="re-enterPassword"
                name="re-enterPassword"
                label="Confirm Password"
                onBlur={(e) =>
                  validatePassword(e.target.value, "re-enterPassword")
                }
                required
                className="bg-customInputBackground h-[3.24rem] px-4 py-2 mt-1 block w-full border rounded-md"
              />
              <Button
                text="Continue"
                btnType="submit"
                className={`w-full my-2 py-2 text-white bg-customBlue rounded-lg ${
                  password != confirmPassword
                    ? "cursor-not-allowed"
                    : "text-white"
                }`}
                disabled={password != confirmPassword}
              />
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 gap-6">
            <span className="w-14 h-14">
              <Image
                src="/PasswordResetSuccess.svg"
                alt="Password Reset Success"
                className="w-full h-auto object-cover"
                width={10}
                height={10}
              />
            </span>

            <h2 className="text-2xl font-bold text-center text-customBlack">
              Password Changes!
            </h2>
            <h4 className="text-lg font-light text-center">
              Your password has been changed successfully.
            </h4>
            <Button
              text="Back to Login Page"
              btnType="button"
              className={`w-full my-2 py-2 text-white bg-customBlue rounded-lg`}
              onClick={handleRedirect}
            />
          </div>
        )}
      </div>
      <Loader isOpen={loading} />
    </>
  );
};

export default ResetPassword;