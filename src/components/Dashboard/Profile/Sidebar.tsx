import { AccountCircleOutlined, LocationCityOutlined, Password } from "@mui/icons-material";
import React from "react";

interface SidebarProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeComponent, setActiveComponent }) => {
  const isActive = (component: string) => activeComponent === component;

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-2">
      <nav className="space-y-6 mt-4">
        <button
          onClick={() => setActiveComponent("profile")}
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("profile") ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <AccountCircleOutlined
            className={`w-5 h-5 ${isActive("profile") ? "text-[#121212]" : "text-[#929292]"}`}
          />
          <span
            className={`${
              isActive("profile") ? "text-[#121212] font-medium" : "text-[#929292] font-normal"
            } text-[16px] leading-[24px] tracking-[0.5px]`}
          >
            Profile Details
          </span>
        </button>
        <button
          onClick={() => setActiveComponent("branch")}
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("branch") ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <LocationCityOutlined
            className={`w-5 h-5 ${isActive("branch") ? "text-[#121212]" : "text-[#929292]"}`}
          />
          <span
            className={`${
              isActive("branch") ? "text-[#121212] font-medium" : "text-[#929292] font-normal"
            } text-[16px] leading-[24px] tracking-[0.5px]`}
          >
            Branch Details
          </span>
        </button>
        <button
          onClick={() => setActiveComponent("security")}
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("security") ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <Password
            className={`w-5 h-5 ${isActive("security") ? "text-[#121212]" : "text-[#929292]"}`}
          />
          <span
            className={`${
              isActive("security") ? "text-[#121212] font-medium" : "text-[#929292] font-normal"
            } text-[16px] leading-[24px] tracking-[0.5px]`}
          >
            Password & Pin
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
