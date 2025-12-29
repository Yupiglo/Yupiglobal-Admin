/* eslint-disable @typescript-eslint/no-explicit-any */
// import { CreatePwdObject } from "../types/login";
import { ApiResponse } from "@/types/types";
import apiHandler from "../actions/baseHandler";

// Method For Login
const UserLogin = async (
  email: string,
  password: string,
  showLoader?: () => void,
  hideLoader?: () => void,
  //cryptoConfig?: any
): Promise<ApiResponse> => {
  //const ip= "10.150.146.29";
  const payload = {
    email: email,
    password: password,
    apiname: 'auth/signin'
    //logintype: logintype,
    //ip: ip,
  };
  return await apiHandler(
    "POST",
    payload,
    "",
    showLoader,
    hideLoader,
    //cryptoConfig
  );
};



const Logout = async (
  email: string | null,
  token: string,
  showLoader?: () => void,
  hideLoader?: () => void,
  cryptoConfig?: any
): Promise<ApiResponse> => {
  const payload = {
    "username": email,
    "apiname":'logout'
  }
  return await apiHandler(
    "POST",
    payload,
    token,
    showLoader,
    hideLoader,
    cryptoConfig
  );
};



// Forgot Password
const ForgotPassword = async (
  email: string,
  showLoader: () => void,
  hideLoader: () => void
): Promise<ApiResponse> => {
  const payload = {
    apiname: "forgotpassword",
    email: email, // Ensure email is passed directly as a string
  };

  return await apiHandler(
    "POST",
    payload, // Pass the payload directly
    "",
    showLoader,
    hideLoader
  );
};


// Verify OTP
const VerifyOtp = async (
  email: string,
  otp: string,
  showLoader: () => void,
  hideLoader: () => void
): Promise<ApiResponse> => {
  const payload = {
    apiname: "verifyotp",
    email: email,
    otp: otp,
  };
  return await apiHandler(
    "POST",
    payload,
    "",
    showLoader,
    hideLoader
  );
};

// Change Password
const ChangePassword = async (
  email: string,
  password: string,
  showLoader: () => void,
  hideLoader: () => void
): Promise<ApiResponse> => {
  const payload = {
    apiname: "newpassword",
    email: email,
    password: password,
  };
  const response = await apiHandler(
    "POST",
    payload,
    "",
    showLoader,
    hideLoader
  );
  return response;
};


export { UserLogin,ForgotPassword,VerifyOtp, ChangePassword,Logout };