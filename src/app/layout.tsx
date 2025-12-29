"use client";
import React, { useEffect } from "react";

import "./globals.css";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";
import { AuthProvider } from "@/context/AuthContext";

interface RootLayoutProps {
  children: React.ReactNode;
}

const poppins = localFont({
  src: [
    {
      path: "../../public/fonts/Poppins-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/Poppins-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-poppins",
});

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathName = usePathname();
  const tabName = "Admin Panel | ";
  useEffect(() => {
    // Function to update the document title based on the current route
    const handleRouteChange = (url: string | null) => {
      switch (url) {
        case "/":
        case "/login":
          document.title = `${tabName}Login`;
          break;
        case "/forgotPassword":
          document.title = `${tabName}Forgot Password`;
          break;
        case "/dashboard":
          document.title = `${tabName}Dashboard`;
          break;
        case "/userProfile":
          document.title = `${tabName}User Profile`;
          break;
        case "/user-management":
          document.title = `${tabName}User Management`;
          break;
        case "/user-management/add-user":
          document.title = `${tabName}Add User`;
          break;
        case "/role-management":
          document.title = `${tabName}Role Management`;
          break;
        case "/role-management/add":
          document.title = `${tabName}Add Role`;
          break;
        case "/role-priviledge":
          document.title = `${tabName}Role Privilege`;
          break;
        case "/user-privilege":
          document.title = `${tabName}User Privilege`;
          break;
        default:
          document.title = "Admin Panel";
      }
    };
    // Initial setting of the title
    handleRouteChange(pathName);
  }, [pathName]);

  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body
        className={` antialiased lg:w-[100%] md:w-full min-h-screen flex flex-col`}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
};
export default RootLayout;
