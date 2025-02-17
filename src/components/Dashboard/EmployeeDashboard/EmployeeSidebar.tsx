import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../../assets/troo-logo-white.png";
import RestaurantLogo from "../../assets/restaurant_name.png";
import OverviewIcon from "../../assets/OverviewIcon.svg";
import TicketIcon from "../../assets/Tickets.svg";
import MenuIcon from "../../assets/menuIcon.svg";
import PaymentIcon from "../../assets/paymentIcon.svg";
import AccountingIcon from "../../assets/AccountingIcon.svg";
import RestaurantDetailsIcon from "../../assets/restaurantDetails.svg";
import ManageTablesIcon from "../../assets/manageTableIcon.svg";
import PointOfSalesIcon from "../../assets/posIcon.svg";
import HomeIcon from "../../assets/troo-logo-white.png";
import ManageUsersIcon from "../../assets/manageUsers.svg";
import LogoutIcon from "../../assets/logout.svg";
import ArrowToggle from "../../assets/arrowToggle.svg";
import { NavLink } from "react-router-dom";

interface MenuItem {
  subTitle?: string;
  title?: string;
  gap?: boolean;
  Subgap?: boolean;
  icon?: string;
  subMenu?: MenuItem[];
  link?: string;
}

interface EmployeeSidebarProps {
  userType: "user" | "admin";
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ userType }) => {
  const location = useLocation();
  // const [open, setOpen] = useState(true);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

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
      gap: false,
      icon: TicketIcon,
      link: "/tickets",
    },

    {
      title: "Menu",
      icon: MenuIcon,
      link: "/menu-home",
      subMenu: [
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
    {
      title: "Payment",
      gap: false,
      icon: PaymentIcon,
      link: "/payment",
    },
    {
      title: "Accounting",
      gap: false,
      icon: AccountingIcon,
      link: "/account",
    },
    {
      subTitle: "CONFIGURATIONS",
      Subgap: true,
    },
    {
      title: "Restaurant Details",
      gap: false,
      icon: RestaurantDetailsIcon,
      link: "/restaurant-details",
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
      title: "Point of Sales",
      gap: false,
      icon: PointOfSalesIcon,
      link: "/pos",
    },
    {
      title: "Logout",
      gap: true,
      icon: LogoutIcon,
      link: "/logout",
    },
  ];

  const adminMenu: MenuItem[] = [{ title: "AdminHome", gap: false, icon: HomeIcon }];

  const userMenu = [...commonMenu];

  const selectedMenu = userType === "admin" ? adminMenu : userMenu;

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // const isMenuItemActive = (menuLink: string) => {
  //   return location.pathname === menuLink;
  // };
  const isMenuItemActive = (menuLink: string, subMenu?: MenuItem[]): boolean => {
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

  return (
    <div>
      <div
        className={`p-2 w-[253px] h-full fixed overflow-y-auto left-0 top-0 duration-300`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        // className={` p-2 w-[253px] h-full fixed no-scrollbar overflow-y-auto left-0 top-0  pt-8 duration-300 `}
        // ${
        //   open ? "w-full" : "w-20"
        // }
      >
        {/* <img
          src="./src/assets/Arrow2.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 
       ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        /> */}

        <div className=" grid gap-10 items-center">
          <div className="flex gap-x-4  items-center justify-center">
            <img
              alt="logo"
              src={Logo}
              className={`cursor-pointer duration-500  `}
              // ${
              //   open && "rotate-[360deg]"}
            />
          </div>
          <div className="flex gap-x-4 items-center justify-center">
            <img
              alt="logo"
              src={RestaurantLogo}
              className={`cursor-pointer duration-500`}
              // ${
              //   open && "rotate-[360deg]"
              // }
            />
          </div>
        </div>
        <ul className="pt-6 pl-[15px] grid gap-[10px]">
          {/* {selectedMenu.map((menu, index) => (
            <div className="">
              <NavLink to={menu.link || "#"}>
                {" "}
                <li key={index}>
                  <p
                    className={`flex relative ${
                      menu.title && " px-[14px] cursor-pointer py-[8px]  "
                    }  ${
                      menu.subTitle && "text-[12px]"
                    } text-purple200  items-center gap-x-2
            ${menu.gap ? " mt-28" : ""} ${menu.Subgap && "my-5"} ${
                      isMenuItemActive(menu.link || "")
                        ? "  bg-selectedState font-[600] text-[16px] text-white "
                        : " "
                    }${
                      !isMenuItemActive(menu.link || "") &&
                      !menu.subTitle &&
                      "hover:bg-[#504EA3] "
                    }`}
                    onClick={() => menu.subMenu && handleSubmenuToggle(index)}
                  >
                    {menu.title && (
                      <img
                        src={menu.icon}
                        alt={menu.title}
                        style={{ width: "20px", marginRight: "8px" }}
                      />
                    )}
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200 `}
                    >
                      {menu.title}
                      {menu.subTitle}
                    </span>
                    {menu.subMenu && (
                      <img
                        src={ArrowToggle}
                        alt=""
                        className={`text-white absolute right-[10px]  transition-transform ${
                          openSubmenuIndex === index ? "rotate-180" : ""
                        }`}
                        style={{}}
                      />
                    )}
                  </p>

                  <div className="">
                    {menu.subMenu && openSubmenuIndex === index && (
                      <ul className="pl-8">
                        {" "}
                        {menu.subMenu.map((subMenuItem, subIndex) => (
                          <NavLink to={subMenuItem.link || "#"}>
                            <li
                              key={subIndex}
                              className={`flex  p-2 cursor-pointer py-2 hover:bg-purple700  text-purple200 text-sm items-center gap-x-4 ${
                                isMenuItemActive(subMenuItem.link || "")
                                  ? "text-white"
                                  : ""
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
              </NavLink>
            </div>
          ))} */}
          {selectedMenu.map((menu, index) => (
            <div key={index}>
              <NavLink to={menu.link || "#"}>
                <li>
                  <p
                    className={`flex relative ${
                      menu.title && " px-[14px] cursor-pointer py-[8px]  "
                    }  ${menu.subTitle && "text-[12px]"} text-purple200  items-center gap-x-2
            ${menu.gap ? " mt-28" : ""} ${menu.Subgap && "my-5"} ${
                      isMenuItemActive(menu.link || "", menu.subMenu)
                        ? "  bg-selectedState font-[600] text-[16px] text-white "
                        : !isMenuItemActive(menu.link || "", menu.subMenu) && !menu.subTitle
                        ? " hover:bg-[#504EA3] "
                        : ""
                    }`}
                    onClick={() => menu.subMenu && handleSubmenuToggle(index)}
                  >
                    {menu.title && (
                      <img
                        src={menu.icon}
                        alt={menu.title}
                        style={{ width: "20px", marginRight: "8px" }}
                      />
                    )}
                    <span className={`${!open && "hidden"} origin-left duration-200 `}>
                      {menu.title}
                      {menu.subTitle}
                    </span>
                    {menu.subMenu && (
                      <img
                        src={ArrowToggle}
                        alt=""
                        className={`text-white absolute right-[10px]  transition-transform ${
                          openSubmenuIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </p>

                  <div className="">
                    {menu.subMenu && openSubmenuIndex === index && (
                      <ul className="pl-8">
                        {" "}
                        {menu.subMenu.map((subMenuItem, subIndex) => (
                          <NavLink to={subMenuItem.link || "#"}>
                            <li
                              key={subIndex}
                              className={`flex  p-2 cursor-pointer py-2 hover:bg-purple700  text-purple200 text-sm items-center gap-x-4 ${
                                isMenuItemActive(subMenuItem.link || "") ? "text-white" : ""
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
              </NavLink>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
