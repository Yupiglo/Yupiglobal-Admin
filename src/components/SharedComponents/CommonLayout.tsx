"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import ImageCarousel from "./ImageCarousel";

interface CommonLayoutProps {
  children: React.ReactNode;
}

/** Common Layout to render children within Header, Footer, and Sidebar components.
 *  Also handles rendering of the Mobile menu.
 */

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  useEffect(() => {}, []);

  return (
    <div className="relative h-screen w-screen flex justify-center bg-white">
      <div className="absolute top-10 left-10 z-30">
        <Image
          className="cursor-pointer"
          src="/Detox-Health-Cap.png"
          alt="Logo"
          width={120}
          height={39}
        />
      </div>

      {/* Main Background Image */}
      <div className="absolute inset-0 bg-[url('/Common_layout.svg')] bg-cover bg-center bg-no-repeat z-0"></div>

      {/* Overlay Design Image */}
      <div className="absolute inset-0 bg-[url('/Common_layout_design.png')] bg-cover bg-center bg-no-repeat opacity-50"></div>

      {/* Footer Overlay (Ensuring it fully hides the previous background) */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%] z-20">
        {/* Force opacity by layering a solid background */}
        <div className="absolute inset-0 bg-white"></div>
        {/* Footer image */}
        <div className="absolute inset-0 bg-[url('/Common_layout_1.svg')] bg-cover bg-center bg-no-repeat"></div>
      </div>

      {/*Content Wrapper (Ensures readability) */}
      <div className="absolute top-24 z-30 w-[85%] h-[80%] bg-white rounded-3xl shadow-lg overflow-hidden flex">
        {/* Left Side - Form Section */}
        <div className="w-1/2 p-4 flex flex-col justify-around">{children}</div>

        {/* Right Side - Illustration Section */}
        <div className="w-1/2 p-4 bg-[#F0F5FA] flex flex-col justify-around">
          {/* <div className="flex flex-col items-center justify-center h-full"> */}
            <ImageCarousel />
          {/* </div> */}
          <p className="text-xs text-paragraphText mt-4">
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommonLayout;
