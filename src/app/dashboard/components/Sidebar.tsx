"use client";
import { useState } from "react";
import Logo from "@/components/SharedComponents/Logo";
import SidebarItem from "../../../components/Dashboard/SidebarItem";
import { useRouter } from "next/navigation";
import { Loader } from "@/components";
import { useLoader } from "@/hooks/Loader";
import { LayoutDashboard, Users, ShoppingBag, Megaphone, FileText, ShoppingCart, Tag, Star, Settings } from "lucide-react";

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event?: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
  activeTab: string;
  hideMenu: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
  activeTab = "",
  hideMenu = false,
  onCollapseChange,  // Destructure the new prop
}) => {
  const router = useRouter();
  const { loading } = useLoader();

  // Sidebar Collapse State
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Handle collapse toggle
  const handleCollapseToggle = () => {
    const newCollapseState = !isCollapsed;
    setIsCollapsed(newCollapseState);

    if (onCollapseChange) {
      onCollapseChange(newCollapseState);
    }
  };
  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-50 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-[20%]" : "w-auto min-w-[80px]"}
        ${hideMenu ? "hidden" : "flex flex-col"}
        lg:translate-x-0 ${isMobileSidebarOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-center h-20 border-b border-gray-100/50">
          {/* Logo Logic */}
          {isCollapsed ? (
            <div className="font-bold text-blue-600 text-xl">DHC</div>
          ) : (
            <Logo
              src="/Detox-Health-Cap.png"
              alt="Company Logo"
              width={140}
              height={45}
            />
          )}

          {/* Mobile Close Button */}
          <button
            className="lg:hidden absolute right-4 top-6 text-gray-400 hover:text-gray-600"
            onClick={onSidebarClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <SidebarItem
            label="Dashboard"
            isActive={activeTab === "/dashboard"}
            icon={<LayoutDashboard size={20} />}
            onClick={() => router.push("/dashboard")}
          />

          <div className="pt-4 pb-2">
            <p className={`px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${isCollapsed ? "text-center" : ""}`}>
              {isCollapsed ? "MNG" : "Management"}
            </p>
          </div>

          <SidebarItem
            label="User Management"
            isActive={["/users"].includes(activeTab)}
            icon={<Users size={20} />}
            isOpen={openMenus["Users"] ?? false}
            toggleOpen={() => toggleMenu("Users")}
          >
            <div className="mt-1 space-y-1">
              <SubMenuItem label="User List" routePath="/users" isActive={activeTab === "/users" || activeTab === "/"} />
            </div>
          </SidebarItem>

          <SidebarItem
            label="Catalogue"
            isActive={["/addproduct", "productlist", "/categories", "/brands"].includes(activeTab)}
            icon={<ShoppingBag size={20} />}
            isOpen={openMenus["Catalogue"] ?? false}
            toggleOpen={() => toggleMenu("Catalogue")}
          >
            <div className="mt-1 space-y-1">
              <SubMenuItem label="Category List" routePath="/categorylist" isActive={activeTab === "/categorylist"} />
              <SubMenuItem label="Add Category" routePath="/categories" isActive={activeTab === "/categories"} />
              <SubMenuItem label="SubCategory List" routePath="/subcategorylist" isActive={activeTab === "/subcategorylist"} />
              <SubMenuItem label="Add SubCategory" routePath="/subcategories" isActive={activeTab === "/subcategories"} />
              <SubMenuItem label="Product" routePath="/addproduct" isActive={activeTab === "/addproduct"} />
              <SubMenuItem label="Product List" routePath="/productlist" isActive={activeTab === "/productlist"} />
              <SubMenuItem label="Brand" routePath="/brands" isActive={activeTab === "/brands"} />
              <SubMenuItem label="Brand List" routePath="/brandlist" isActive={activeTab === "/brandlist"} />
            </div>
          </SidebarItem>

          <SidebarItem
            label="Banners & Promotions"
            isActive={["/banners"].includes(activeTab)}
            icon={<Megaphone size={20} />}
            isOpen={openMenus["Banners"] ?? false}
            toggleOpen={() => toggleMenu("Banners")}
          >
            <div className="mt-1 space-y-1">
              <SubMenuItem label="Banners" routePath="/banners" isActive={activeTab === "/banners"} />
              <SubMenuItem label="Banner List" routePath="/bannerlist" isActive={activeTab === "/bannerlist"} />
            </div>
          </SidebarItem>

          <SidebarItem
            label="Blogs"
            isActive={["/blogs"].includes(activeTab)}
            icon={<FileText size={20} />}
            isOpen={openMenus["Blogs"] ?? false}
            toggleOpen={() => toggleMenu("Blogs")}
          >
            <div className="mt-1 space-y-1">
              <SubMenuItem label="Add Blog" routePath="/blogs" isActive={activeTab === "/blogs"} />
              <SubMenuItem label="Blog List" routePath="/bloglist" isActive={activeTab === "/bloglist"} />
            </div>
          </SidebarItem>

          <SidebarItem
            label="Order Management"
            isActive={["/orders", "/transactions"].includes(activeTab)}
            icon={<ShoppingCart size={20} />}
            isOpen={openMenus["Orders"] ?? false}
            toggleOpen={() => toggleMenu("Orders")}
          >
            <div className="mt-1 space-y-1">
              <SubMenuItem label="Orders" routePath="/orders" isActive={activeTab === "/orders"} />
              <SubMenuItem label="Transactions" routePath="/transactions" isActive={activeTab === "/transactions"} />
            </div>
          </SidebarItem>

          <SidebarItem
            label="Offers"
            isActive={["/coupon"].includes(activeTab)}
            icon={<Tag size={20} />}
            isOpen={openMenus["Coupons"] ?? false}
            toggleOpen={() => toggleMenu("Coupons")}
          >
            <div className="mt-1 space-y-1">
              <SubMenuItem label="Coupons" routePath="/coupon" isActive={activeTab === "/coupon"} />
            </div>
          </SidebarItem>

          <SidebarItem
            label="Reviews"
            isActive={["/review"].includes(activeTab)}
            icon={<Star size={20} />}
            isOpen={openMenus["Review"] ?? false}
            toggleOpen={() => toggleMenu("Review")}
          >
            <div className="mt-1 space-y-1">
              <SubMenuItem label="Review List" routePath="/review" isActive={activeTab === "/review"} />
            </div>
          </SidebarItem>

          <SidebarItem
            label="Settings"
            isActive={activeTab === "/settings"}
            icon={<Settings size={20} />}
            onClick={() => router.push("/settings")}
          />
        </nav>

        {/* Sidebar Footer (Optional) */}
        <div className="p-4 border-t border-gray-100">
          {/* Could add meaningful footer content here */}
        </div>
      </aside>

      {/* Collapse Toggle Button - Desktop Only */}
      <div className={`fixed top-8 z-50 transition-all duration-300 hidden lg:block ${isSidebarOpen ? "left-[18.5%]" : "left-[65px]"}`}>
        <button
          className="bg-white p-1.5 rounded-full shadow-md text-gray-500 hover:text-blue-600 border border-gray-100 transition-colors"
          onClick={handleCollapseToggle}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
          )}
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isMobileSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
        onClick={onSidebarClose}
      />

      <Loader isOpen={loading} />
    </>
  );
};

export default Sidebar;

// SubMenu Item Component
interface SubMenuItemProps {
  label: string;
  routePath?: string;
  isActive?: boolean;
}

export const SubMenuItem: React.FC<SubMenuItemProps> = ({
  label,
  routePath,
  isActive,
}) => {
  const router = useRouter();

  return (
    <button
      className={`w-full group flex items-center pl-10 pr-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 
        ${isActive
          ? "text-blue-600 bg-blue-50"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        }`}
      onClick={() => {
        if (routePath) {
          router.push(routePath);
        }
      }}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-3 transition-colors ${isActive ? "bg-blue-600" : "bg-gray-300 group-hover:bg-gray-400"}`} />
      {label}
    </button>
  );
};