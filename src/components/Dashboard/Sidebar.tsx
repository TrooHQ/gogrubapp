import React, { useState, useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/troo-logo.png";
import LogoMini from "../../assets/logo-mini-icon.svg";
import OverviewIcon from "../../assets/OverviewIcon.svg";
import TicketIcon from "../../assets/Tickets.svg";
import MenuIcon from "../../assets/menuIcon.svg";
import RestaurantDetailsIcon from "../../assets/restaurantDetails.svg";
import ManageTablesIcon from "../../assets/manageTableIcon.svg";
import AccountCircleIcon from "../../assets/account_circle.svg";
import HomeIcon from "../../assets/troo-logo-white.png";
import ManageUsersIcon from "../../assets/manageUsers.svg";
import HubIcon from "../../assets/hub.svg";
import LogoutIcon from "../../assets/logout.svg";
import ArrowToggle from "../../assets/arrowToggle.svg";
import { TextField, Button, Popper, Paper } from "@mui/material";
import {
  ArrowCircleRightOutlined,
  ArrowDropDown,
  Search,
} from "@mui/icons-material";
import { CustomAutocomplete } from "./Overview";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  clearSelectedBranch,
  fetchBranches,
  userSelectedBranch,
} from "../../slices/branchSlice";
import { clearUserData } from "../../slices/UserSlice";
import getPermittedMenuItems from "../../utils/getPermittedMenuItems";

interface MenuItem {
  subTitle?: string;
  title?: string;
  gap?: boolean;
  Subgap?: boolean;
  icon?: string;
  subMenu?: MenuItem[];
  link?: string;
}

interface SideBarProps {
  userType: "user" | "admin";
}

const SideBar: React.FC<SideBarProps> = ({ userType }) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { branches, selectedBranch } = useSelector(
    (state: RootState) => state.branches
  );
  const { userData } = useSelector((state: RootState) => state.user);

  const [open, setOpen] = useState(true);
  const [isAutoOpen, setIsAutoOpen] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOutlet, setSelectedOutlet] = useState(
    selectedBranch
      ? selectedBranch
      : {
          label: "All outlets",
          id: "",
        }
  );

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const transformedBranches = branches.map((branch: any) => ({
    label: branch.branch_name,
    id: branch._id,
  }));

  useEffect(() => {
    if (userData?.user_role === "admin") {
      const defaultBranch = transformedBranches[0];
      (selectedBranch === null || selectedBranch === undefined) &&
        dispatch(userSelectedBranch(defaultBranch as any));
    } else if (userData?.user_role === "employee") {
      dispatch(userSelectedBranch(userData?.branch_id));
    }
  }, [dispatch, transformedBranches, selectedBranch]);
  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsAutoOpen((prev) => !prev);
  };

  const handleSelect = (event: any, value: any) => {
    event.preventDefault();
    setSelectedOutlet(value ?? { label: "All outlets" });
    dispatch(userSelectedBranch(value));
    setIsAutoOpen(false);
  };

  useEffect(() => {
    // Open the submenu if the current location is within its links
    selectedMenu.forEach((menu, index) => {
      if (
        menu.subMenu &&
        menu.subMenu.some(
          (subMenuItem) => subMenuItem.link === location.pathname
        )
      ) {
        setOpenSubmenuIndex(index);
      }
    });
  }, [location.pathname]);

  const commonMenu: MenuItem[] = [
    {
      subTitle: "MY RESTAURANT",
      Subgap: true,
    },
    {
      title: "Overview",
      gap: false,
      icon: OverviewIcon,
      link: "/overview",
    },
    {
      title: "Tickets",
      icon: TicketIcon,
      link: "/tickets",
      subMenu: [
        {
          title: "Tickets",
          link: "/tickets",
        },
        {
          title: "Order history",
          link: "/order-history",
        },
      ],
    },
    {
      title: "Menu",
      icon: MenuIcon,
      link: "/menu-list",
      subMenu: [
        {
          title: "Menu List",
          link: "/menu-list",
        },
        {
          title: "Menu Builder",
          link: "/menu-builder",
        },
        {
          title: "Price List",
          link: "/price-list",
        },
      ],
    },
    // {
    //   title: "Payment",
    //   gap: false,
    //   icon: PaymentIcon,
    //   link: "/payment",
    // },
    // {
    //   title: "Accounting",
    //   gap: false,
    //   icon: AccountingIcon,
    //   link: "/account",
    // },
    {
      subTitle: "SETTINGS",
      Subgap: true,
    },
    {
      title: "Restaurant Details",
      icon: RestaurantDetailsIcon,
      link: "/business-information",
      subMenu: [
        {
          title: "Business Information",
          link: "/business-information",
        },
        {
          title: "Manage Branches",
          link: "/manage-branches",
        },
      ],
    },
    {
      title: "Manage Assets",
      gap: false,
      icon: ManageTablesIcon,
      link: "/manage-assets",
    },
    {
      title: "Manage Users",
      gap: false,
      icon: ManageUsersIcon,
      link: "/manage-users",
    },
    {
      title: "Tenant Settings",
      gap: false,
      icon: HubIcon,
      link: "/tenant-settings",
    },
    // {
    //   title: "Point of Sales",
    //   gap: false,
    //   icon: PointOfSalesIcon,
    //   link: "/pos",
    // },
    {
      title: "Profile",
      gap: false,
      icon: AccountCircleIcon,
      link: "/profile-page",
    },
    // {
    //   title: "Logout",
    //   gap: true,
    //   icon: LogoutIcon,
    //   link: "/logout",
    // },
  ];

  const adminMenu: MenuItem[] = [
    { title: "AdminHome", gap: false, icon: HomeIcon },
  ];

  const userPermissions = userData?.permissions || [];
  const permittedMenu =
    userData?.user_role === "admin"
      ? commonMenu
      : getPermittedMenuItems(commonMenu, userPermissions);

  const selectedMenu = userType === "admin" ? adminMenu : permittedMenu;

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const isMenuItemActive = (
    menuLink: string,
    subMenu?: MenuItem[]
  ): boolean => {
    if (location.pathname === menuLink) {
      return true;
    }
    if (subMenu) {
      return subMenu.some((subMenuItem) =>
        isMenuItemActive(subMenuItem.link || "", subMenuItem.subMenu)
      );
    }
    return false;
  };

  const handleLogout = () => {
    dispatch(clearUserData());
    dispatch(clearSelectedBranch());

    navigate("/");
  };
  console.log(userData, "userData");

  return (
    <div
      className={`p-2 ${
        open ? "w-[230px]" : "w-20"
      }  h-screen relative overflow-y-auto left-0 top-0 duration-300 bg-[#ebebeb]`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="grid gap-3 items-center">
        <div className="flex gap-x-4 mt-4 items-center justify-center">
          <img
            src={userData?.business_logo ? userData.business_logo : Logo}
            alt="logo"
            className={`cursor-pointer duration-500 w-[100px] h-[100px] object-contain border-2 border-gray-300 rounded-lg shadow-lg p-2 bg-white ${
              !open ? "hidden" : "block"
            } `}
            onClick={() => setOpen(!open)}
          />
          <img
            alt="logo-mini"
            src={LogoMini}
            className={`cursor-pointer duration-500 w-[100px] h-[100px] object-contain border-2 border-gray-300 rounded-lg shadow-lg p-2 bg-white ${
              !open ? "block" : "hidden"
            } `}
            onClick={() => setOpen(!open)}
          />
        </div>

        <div
          className={`cursor-pointer duration-500 ${
            !open ? "hidden" : "block"
          } `}
        >
          <hr className="h-[2px] bg-[#929292] my-3" />
          <div className="ml-[5px] flex flex-col items-start justify-center gap-2">
            <h4 className="text-base font-medium mb-0">
              {userData?.business_name}
            </h4>

            {/* Insert Button and Popper components here */}
            {userData?.user_role === "admin" ? (
              <div>
                <Button
                  variant="contained"
                  onClick={handleButtonClick}
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #5955B3",
                    color: "#5955B3",
                    ml: 0,
                    "&:hover": {
                      backgroundColor: "#4842a3",
                      color: "white",
                    },
                  }}
                >
                  {selectedBranch?.label} <ArrowDropDown />
                </Button>
                <Popper
                  open={isAutoOpen}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                  sx={{ zIndex: 10, boxShadow: 3 }}
                >
                  <Paper sx={{ boxShadow: 3 }}>
                    <CustomAutocomplete
                      disablePortal
                      options={transformedBranches}
                      value={
                        selectedBranch
                          ? selectedBranch.label
                          : selectedOutlet.label
                      }
                      onChange={handleSelect}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search outlet"
                          variant="outlined"
                          style={{ width: "220px", marginLeft: "0px" }}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <Search
                                  style={{ color: "gray", marginRight: "4px" }}
                                />
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Paper>
                </Popper>
              </div>
            ) : (
              <div>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #5955B3",
                    color: "#5955B3",
                    ml: 0,
                    "&:hover": {
                      backgroundColor: "#4842a3",
                      color: "white",
                    },
                  }}
                >
                  {userData?.branch_name}
                </Button>
              </div>
            )}

            <p className="text-grey300 text-xs font-normal">
              {userData?.business_type}
            </p>
          </div>
          <hr className="h-[2px] bg-[#929292] my-3" />
        </div>
      </div>
      <ul className="pt-2 pl-[1px] grid gap-[10px]">
        {selectedMenu.map((menu, index) => (
          <div key={index}>
            <li>
              <div
                className={`flex relative ${
                  menu.title && "px-[4px] cursor-pointer py-[8px]"
                }  ${
                  menu.subTitle && "text-[12px] font-normal text-grey500"
                } text-purple200  items-center gap-x-2
            ${menu.gap ? " mt-28" : ""} ${menu.Subgap && "my-5"} ${
                  isMenuItemActive(menu.link || "", menu.subMenu)
                    ? "  bg-[#d3d3d3] font-bold text-[16px] text-black "
                    : !isMenuItemActive(menu.link || "", menu.subMenu) &&
                      !menu.subTitle
                    ? " "
                    : ""
                }`}
                onClick={() => menu.subMenu && handleSubmenuToggle(index)}
              >
                {menu.title && (
                  <img
                    src={menu.icon}
                    alt={menu.title}
                    style={{
                      width: "24px",
                      marginRight: "8px",
                      fontWeight: isMenuItemActive(
                        menu.link || "",
                        menu.subMenu
                      )
                        ? "bold"
                        : "normal",
                      color: isMenuItemActive(menu.link || "", menu.subMenu)
                        ? "black"
                        : "initial",
                    }}
                  />
                )}
                <NavLink to={menu.link || "#"} className="flex-grow">
                  <span
                    className={`${
                      !open && "hidden"
                    } origin-left duration-200 text-[#000]`}
                  >
                    {menu.title}
                    {menu.subTitle}
                  </span>
                </NavLink>
                {menu.subMenu && (
                  <img
                    src={ArrowToggle}
                    alt=""
                    className={`text-[#414141] absolute right-[10px]  transition-transform ${
                      openSubmenuIndex === index ? "rotate-180" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmenuToggle(index);
                    }}
                  />
                )}
              </div>
              <div className="">
                {menu.subMenu && openSubmenuIndex === index && (
                  <ul className="pl-8">
                    {" "}
                    {menu.subMenu.map((subMenuItem, subIndex) => (
                      <NavLink to={subMenuItem.link || "#"} key={subIndex}>
                        <li
                          className={`flex p-2 cursor-pointer py-2  text-sm items-center gap-x-4 ${
                            isMenuItemActive(subMenuItem.link || "")
                              ? "text-[#000] font-bold"
                              : "text-purple200"
                          }`}
                        >
                          {subMenuItem.title}
                        </li>
                      </NavLink>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          </div>
        ))}
      </ul>

      <div className="mb-10">
        <hr className="h-[2px] bg-[#929292] mt-5 mb-3" />
        <p className="text-[10px] font-medium ml-3.5">You are using the</p>
        <button className="ml-0 px-2.5 py-[6px] bg-[#DB7F3B] rounded-[100px] mt-1">
          <span className="text-white text-base font-semibold mr-2">
            Standard Plan
          </span>
          <ArrowCircleRightOutlined sx={{ color: "var(--white, #FFF)" }} />{" "}
        </button>
        <hr className="h-[2px] bg-[#929292] mt-5 mb-3" />
      </div>
      {/* Add the Logout item separately at the bottom */}
      {/* <div
        className="absolute bottom-0 w-full p-2 mt-6"
        style={{
          backgroundColor: isMenuItemActive("/logout") ? "#d3d3d3" : "transparent",
        }}
      > */}
      <div
        className="w-full p-2 mt-6"
        style={{
          backgroundColor: isMenuItemActive("/logout")
            ? "#d3d3d3"
            : "transparent",
        }}
      >
        <div
          onClick={handleLogout}
          className="flex items-center gap-x-2 cursor-pointer py-2"
        >
          <img
            src={LogoutIcon}
            alt="Logout"
            style={{
              width: "20px",
              marginRight: "8px",
              fontWeight: isMenuItemActive("/logout") ? "bold" : "normal",
              color: isMenuItemActive("/logout") ? "black" : "initial",
            }}
          />
          <span className="text-[#000] font-semibold">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
