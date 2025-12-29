// components/Breadcrumbs.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


/**  Common component to render breadcrumbs
 */

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname() ?? "";
  const baseUrl = process.env.NEXT_PUBLIC_UI_BASE_URL;
  let pathArray = pathname.split("/").filter((path) => {return path.indexOf((baseUrl ?? "/").substring(1)) == -1;});
  pathArray = pathArray.filter((p)=> p !== "");
  

  /** function to get display text for breadcrumb from pathname or route */
  const formatPath = (path: string) => {
    if(path.toUpperCase().includes("ANNEXURE")){
      return "Annexure & Forms"
    } else if(path.toUpperCase().includes("SERVICESTATUS")){
      return "Track Request"
    }else{
    return decodeURIComponent(path)
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
    }
  };

  return (
    <div className='p-4'>
      <nav aria-label="breadcrumb">
        <ol className="flex list-none p-0 m-0 items-center">
          <li className="mr-2">
            <Link href={baseUrl+"/dashboard"} className="text-blue-600 hover:underline flex items-center">
              <Image
                src="/home-icon.svg"
                alt="home icon"
                width={18}
                height={18}
              />
            </Link>
          </li>
          {pathArray.map((path, index) => {
            const href = `/${pathArray.slice(0, index + 1).join("/")}`;
            const isLast = index === pathArray.length - 1;

            return (
              <li key={href} className={`flex items-center ${isLast ? "font-bold" : ""}`}>
                <Image src="/left-arrow.svg" alt="Left Arrow" width={10} height={10} className="mx-2" />
                {!isLast ? (
                  <>
                    <Link href={href} className="text-blue-600 hover:underline text-sm font-medium">
                    {formatPath(path)}
                    </Link>
                    <span className="mx-2">/</span>
                  </>
                ) : (
                  <span className="text-customGreen text-md font-medium text-sm">
                    {formatPath(path)}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
