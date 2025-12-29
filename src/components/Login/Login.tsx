"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useLoader } from "@/hooks/Loader";
import Loader from "../SharedComponents/Loader";
import InputField from "../SharedComponents/InputField";
import PasswordField from "../SharedComponents/PasswordField";
import { toast } from "react-toastify";
import Button from "../SharedComponents/Button";
import configObj from "@/utils/config";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { buildApiUrl } from "@/utils/apiBase";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [isCookieSetting, setIsCookieSetting] = useState(false);
  const cryptoConfig = configObj;
  const { loading, showLoader, hideLoader } = useLoader();
  const { login } = useAuth(); // Use AuthContext

  useEffect(() => {
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;
    const updateStateFromAutofill = () => {
      const newemail = emailInput?.value ?? "";
      const newPassword = passwordInput?.value ?? "";
      if (newemail !== email) setEmail(newemail);
      if (newPassword !== password) setPassword(newPassword);
    };
    updateStateFromAutofill();
  }, [email, password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    showLoader();
    try {
      const response = await fetch(buildApiUrl("auth/signin"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { username, email: userEmail, token } = data.user;
        setIsCookieSetting(true);

        // Use AuthContext login
        login({ user: { username, email: userEmail, token } });

        setRedirecting(true);
        router.push(`/dashboard`);
        toast.success(data.message || "Login successful");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login credentials not valid!");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className={`relative flex items-center justify-center min-h-[500px] w-full transition-all duration-300 ${loading || redirecting ? "pointer-events-none" : ""}`}>

      {/* Loading Overlay with Glassmorphism */}
      {(loading || redirecting || isCookieSetting) && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-3xl transition-all duration-500">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <Loader isOpen={true} />
            <p className="mt-4 text-sm font-medium text-gray-600 tracking-wide animate-pulse">
              {isCookieSetting ? "Setting up your workspace..." : "Authenticating..."}
            </p>
          </div>
        </div>
      )}

      {/* Main Card Content */}
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold pb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email Field Group */}
            <div className="group">
              <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Email Address
              </label>
              <InputField
                id="email"
                name="email"
                type="text"
                placeholder="admin@example.com"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none font-medium"
                onBlur={(event) => setEmail(event.target.value)}
                maxLength={50}
                required={true}
              />
            </div>

            {/* Password Field Group */}
            <div className="group">
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="/forgotPassword"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <PasswordField
                id="password"
                name="password"
                label=""
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none font-medium"
                required={true}
                onChange={(event) => setPassword(event.target.value)}
                disableIcon={false}
              />
            </div>

            <div className="pt-2">
              <Button
                text={loading || redirecting ? "Signing In..." : "Sign In"}
                className={`w-full h-12 flex items-center justify-center text-white font-bold tracking-wide rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-[0.98] border-none
                  ${email && password
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  }`}
                disabled={!email || !password || loading || redirecting}
              />
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-gray-400">
                Protected by reCAPTCHA and subject to the Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}