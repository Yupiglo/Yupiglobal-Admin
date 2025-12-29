"use client";

import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../app/dashboard/components/Sidebar";
import Header from "../../app/dashboard/components/Header";
import Footer from "../../app/dashboard/components/Footer";

import { usePathname, useRouter } from "next/navigation";

import { useLoader } from "@/hooks/Loader";
import { Loader } from "..";
import { HandleLogOut } from "../../utils/userLogout";
import configObj from "@/utils/config";
import { validateSession } from "@/libs/sharedService";
import { clearLocalStorage } from "@/utils/clearStorage";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  hideMenu?: boolean;
  hideSidebar?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  hideMenu = false,
  hideSidebar,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  let pathname = usePathname() ?? "";
  const pathIndex = pathname.lastIndexOf("/");
  pathname = pathname.substring(pathIndex);
  const router = useRouter();
  const { loading, showLoader, hideLoader } = useLoader();
  const routerRef = useRef(router);
  const showLoaderRef = useRef(showLoader);
  const hideLoaderRef = useRef(hideLoader);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = useState(false);
  const [isSidebarCollapsed, setISSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const token = user.token;
  const email = user.email;
  const username = user.username;

  const handleCollapseChange = (collapsed: boolean) => {
    setISSidebarCollapsed(collapsed);
  };

  const handleLogout = () => {
    HandleLogOut(email, token, showLoader, hideLoader, configObj, (url) =>
      router.push(url)
    );
  };

  return (
    <div className="bg-[#F5F7FD] w-full min-h-screen font-poppins flex">
      {/* Sidebar */}
      {!hideSidebar && (
        <Sidebar
          isSidebarOpen={!isSidebarCollapsed}
          isMobileSidebarOpen={mobileMenuOpen}
          onSidebarClose={() => setMobileMenuOpen(false)}
          activeTab={pathname || ""}
          hideMenu={hideMenu}
          onCollapseChange={handleCollapseChange}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ${!isSidebarCollapsed ? "lg:ml-[20%]" : "lg:ml-[80px]"}`}>

        {/* Header */}
        <Header
          username={username}
          onLogout={handleLogout}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setISSidebarCollapsed(!isSidebarCollapsed)}
          toggleMobileSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Content Scrollable Area */}
        <main className="flex-1 pt-24 pb-8 px-4 lg:px-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
          {children}
        </main>

        {/* Footer */}
        <Footer />

      </div>

      <Loader isOpen={loading} />
    </div>
  );
};

export default DashboardLayout;
