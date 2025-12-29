"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface DasboardWidgetProps {
  title: string;
  showAllBtn?: boolean;
  children?: React.ReactNode;
}


/** Common component to render the Request Count and Company Count on the Dashboard.
*/
const DashboardWidget: React.FC<DasboardWidgetProps> = ({
  title,
  showAllBtn,
  children,
}) => {
  const [linkhref, setLinkhref] = useState<string>("/dashboard");
  const baseUrl = process.env.NEXT_PUBLIC_UI_BASE_URL;

  /** set "show all" route from title prop */
  useEffect(() => {
    if (title == "Activities") {
      setLinkhref("/serviceStatus");
    } else if (title == "Company Serviced") {
      setLinkhref("/companiesServiced");
    } else if (title == "Payment") {
      setLinkhref("/payment");
    }
    else {
      setLinkhref("/dashboard"); // Default or other conditions
    }
  }, [title]);

  return (
    <div className="w-full h-max-content bg-white rounded-xl">
      <div className="bg-[#F9BD05] p-3 rounded-t-xl flex justify-between">
        <div className="font-semibold">{title}</div>
        {showAllBtn && <Link href={baseUrl + linkhref}>
          <div className="text-green font-semibold cursor-pointer hover:underline">
            Show All
            <Image
              className="inline ml-2 mb-1"
              src="/green-link.png"
              alt="Show all link"
              width={15}
              height={15}
            />
          </div>
        </Link>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DashboardWidget;
