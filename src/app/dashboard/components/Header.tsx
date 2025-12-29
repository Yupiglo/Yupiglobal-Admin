"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Logo from "@/components/SharedComponents/Logo";

interface HeaderProps {
  username: string;
  onLogout: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout, isSidebarCollapsed, toggleSidebar, toggleMobileSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleClickProfile = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className={`fixed top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300 right-0 
      ${isSidebarCollapsed ? "lg:w-[calc(100%-80px)]" : "lg:w-[80%]"} w-full`}>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6 h-20">
        <div className="flex items-center gap-4">

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>

          {/* Collapsed Sidebar Logo placeholder if needed, otherwise handled by Sidebar */}
          {isSidebarCollapsed && (
            <div className="lg:block hidden">
              <Logo
                src="/Detox-Health-Cap.png"
                alt="Company Logo"
                width={140}
                height={45}
              />
            </div>
          )}
          {/* Mobile Menu Toggle could go here */}
        </div>

        <div className="relative flex items-center gap-6" ref={profileMenuRef}>
          {/* Notification Bell or other header icons could go here */}

          <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

          <button
            onClick={handleClickProfile}
            className="flex flex-row items-center gap-3 focus:outline-none group p-1.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="relative">
              <Image
                src="/avatar.png"
                alt="User Avatar"
                width={42}
                height={42}
                className="rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition-shadow"
              />
              <span className="absolute bottom-0.5 right-0.5 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
            </div>

            <div className="flex flex-col text-left hidden sm:block">
              <span className="text-gray-900 font-bold text-sm leading-tight">
                {username || "Admin"}
              </span>
              <span className="text-gray-500 font-medium text-xs">
                Super Admin
              </span>
            </div>

            <span className={`text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right"
            >
              <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <p className="text-sm font-medium text-gray-900">Sign in as</p>
                <p className="text-sm text-gray-500 truncate">{username}</p>
              </div>
              <div className="p-1">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors group"
                  onClick={onLogout}
                >
                  <span className="mr-3 p-1.5 bg-gray-100 rounded-lg group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                    <Image
                      src="/logout.svg"
                      alt="Logout"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  </span>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
