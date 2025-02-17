import React, { useEffect, useState } from "react";
import closeIcon from "../assets/closeGrey.svg";
import Logo from "../assets/trooLogo.svg";
import LogoutIcon from "../assets/logout1.svg";
import { clearUserData } from "../../slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import CustomSelect3 from "../inputFields/CustomSelect3";
import {
  setSelectedOutlet,
  setSelectedOutletID,
} from "../../slices/OutletSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { SERVER_DOMAIN } from "../../Api/Api";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface Option {
  value: string;
  label: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearUserData());
    navigate("/demo/login/troo-portal");
  };

  const userDetails = useSelector((state: RootState) => state.user?.userData);

  const selectedOutlet = useSelector(
    (state: any) => state.outlet.selectedOutlet
  );

  const token = userDetails?.token;

  const handleSelectOutlet = (Outlet: string) => {
    const selectedOption = branch.find((option) => option.label === Outlet);
    if (selectedOption) {
      dispatch(setSelectedOutlet(selectedOption.label));
      dispatch(setSelectedOutletID(selectedOption.value));
    } else {
      console.log("No matching option found for:", Outlet);
    }
  };

  const [branch, setBranch] = useState<Option[]>([]);

  const getBranch = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/branch/getBranch`,
        headers
      );

      const branchOptions = response.data.data.map((branch: any) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranch(branchOptions);
    } catch (error) {
      console.error("Error Retrieving Branch:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  useEffect(() => {
    getBranch();
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#606060] transition-opacity duration-300 ${
          isOpen ? " pointer-events-auto" : "opacity-0 pointer-events-none"
        } z-50`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-white text-black w-64 z-50 px-[16px] py-[21px]`}
      >
        <div className="flex items-center justify-between pb-[33px] border-b border-[#E7E7E7]">
          <img src={Logo} alt="Logo" className="max-w-[147px]" />
          <img
            src={closeIcon}
            alt="Close"
            onClick={toggleSidebar}
            className="cursor-pointer"
          />
        </div>
        <div className="p-4  border-b border-[#E7E7E7] grid gap-[8px]">
          <p className="text-[16px] font-[500] text-[#121212]">
            {userDetails?.business_name}
          </p>

          <CustomSelect3
            options={branch}
            placeholder="All outlets"
            BG="bg-[#ebebeb]"
            text="text-black"
            hover="hover:bg-[#ebebeb] hover:text-black"
            searchable={true}
            onSelect={handleSelectOutlet}
            value={selectedOutlet}
          />
          <p className="text-[14px] font-[400] text-[#606060]">
            {userDetails?.business_type}
          </p>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div
            className=" flex items-center gap-[8px] py-[14px] px-[13px] border-y border-[#E7E7E7] cursor-pointer"
            onClick={handleLogout}
          >
            <img src={LogoutIcon} alt="" />
            <p className=" text-[#5855B3] font-[500] text-[14px]"> Logout</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
