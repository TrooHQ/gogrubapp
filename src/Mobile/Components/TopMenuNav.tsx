import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Arrow from "../assets/BackArrow.svg";
import Menu from "../assets/menu.svg";
import Sidebar from "../authPages/Sidebar";

interface TopMenuNavProps {
  title: string;
}

const TopMenuNav: React.FC<TopMenuNavProps> = ({ title }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className=" mt-[20px] ">
      <div className=" flex items-center justify-between">
        <div className="inline-flex items-center gap-[20px] cursor-pointer">
          <img src={Arrow} alt="Back" onClick={() => navigate(-1)} />
          <p className="font-[400] text-[20px] text-[#121212] cursor-pointer">
            {title}
          </p>
        </div>
        <div className="cursor-pointer" onClick={toggleSidebar}>
          <img src={Menu} alt="Menu" />
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default TopMenuNav;
