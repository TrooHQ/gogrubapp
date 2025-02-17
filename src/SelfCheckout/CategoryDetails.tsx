import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SERVER_DOMAIN } from "../Api/Api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import MenuDetailsModal from "./MenuDetails";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RiArrowUpDoubleLine } from "react-icons/ri";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Header2 from "./Header2";
import TakeAway from "../SelfCheckout/assets/take-away.svg";
import DineIn from "../SelfCheckout/assets/dinner-table.svg";
import {
  addItemToBasket,
  removeItemFromBasket,
  updateItemQuantity,
} from "../slices/BasketSlice";

import Swipe from "./assets/swipe.png";

import Modal from "../components/Modal";
import { HiMinusCircle, HiPlusCircle, HiPlusSm } from "react-icons/hi";

interface MenuItem {
  _id: string;
  menu_item_name: string;
  menu_group_name: string;
  menu_item_image: string;
  menu_item_price: number;
  name: string;

  business_name: string;
  menu_category_name: string;
}
interface Details extends MenuItem {
  name: string;
  _id: string;
  business_name: string;
  menu_category_name: string;
  menu_group_name: string;
  menu_item_name: string;
  menu_item_image: string;
}

interface GroupedMenuItems {
  [groupName: string]: MenuItem[];
}

export const CategoryDetails = () => {
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [menuItems, setMenuItems] = useState<Details[]>([]);

  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleGroupClick = (groupName: string, index: number) => {
    setSelectedGroup(groupName);

    if (groupRefs.current[index]) {
      groupRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const filteredMenuItems =
    selectedGroup === "All"
      ? menuItems
      : menuItems.filter((menu) => menu.menu_group_name === selectedGroup);

  // const groupedMenuItems: GroupedMenuItems = filteredMenuItems.reduce(
  //   (acc: GroupedMenuItems, item: MenuItem) => {
  //     const { menu_group_name } = item;
  //     if (!acc[menu_group_name]) {
  //       acc[menu_group_name] = [];
  //     }
  //     acc[menu_group_name].push(item);
  //     return acc;
  //   },
  //   {}
  // );

  const groupedMenuItems: GroupedMenuItems = filteredMenuItems.reduce(
    (acc: GroupedMenuItems, item: MenuItem) => {
      const { menu_group_name } = item;
      if (menu_group_name) {
        if (!acc[menu_group_name]) {
          acc[menu_group_name] = [];
        }
        acc[menu_group_name].push(item);
      }
      return acc;
    },
    {}
  );

  const groupNames: string[] = [
    "All",
    ...Array.from(
      new Set(menuItems.map((menu) => menu.menu_group_name))
    ).filter((groupName): groupName is string => groupName !== undefined),
  ];

  const handleNextGroupClick = () => {
    const currentIndex = groupNames.indexOf(selectedGroup);
    const nextIndex = (currentIndex + 1) % groupNames.length;
    setSelectedGroup(groupNames[nextIndex]);

    if (groupRefs.current[nextIndex]) {
      groupRefs.current[nextIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handlePrevGroupClick = () => {
    const currentIndex = groupNames.indexOf(selectedGroup);
    const prevIndex =
      (currentIndex - 1 + groupNames.length) % groupNames.length;
    setSelectedGroup(groupNames[prevIndex]);

    if (groupRefs.current[prevIndex]) {
      groupRefs.current[prevIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");

  const [isVisible, setIsVisible] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isModalOpen = localStorage.getItem("isModalOpen");

    if (!isModalOpen) {
      setIsOpen(true);
      localStorage.setItem("isModalOpen", "true");
    }
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          arrows: true,
        },
      },
    ],
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggleVisibility = () => {
    if (window.pageYOffset > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    AOS.init({
      duration: 1000,
      once: true,
    });
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const openModal = (menuItemId: string) => {
    setSelectedMenuItemId(menuItemId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const dispatch = useDispatch();
  const incrementCount = (menuItem: Details) => {
    const itemInBasket = ids.find((item) => item.id === menuItem._id);
    if (itemInBasket) {
      dispatch(
        updateItemQuantity({
          id: menuItem._id,
          quantity: itemInBasket.quantity + 1,
        })
      );
    } else {
      dispatch(
        addItemToBasket({
          id: menuItem._id,
          quantity: 1,
          selectedOptions: [],
          totalPrice: menuItem.menu_item_price,
          name: menuItem.menu_item_name,
          tableNumber: 1,
        })
      );
    }
  };

  const decrementCount = (menuItem: Details) => {
    const itemInBasket = ids.find((item) => item.id === menuItem._id);
    if (itemInBasket) {
      if (itemInBasket.quantity > 1) {
        dispatch(
          updateItemQuantity({
            id: menuItem._id,
            quantity: itemInBasket.quantity - 1,
          })
        );
      } else {
        dispatch(removeItemFromBasket({ id: menuItem._id }));
      }
    }
  };

  const ids = useSelector((state: RootState) => state.basket.items);

  const totalCount = useSelector((state: RootState) => state.basket);

  const businessDetails = useSelector(
    (state: RootState) => state.business?.businessDetails
  );
  const business_identifier = businessDetails?._id;

  const branchId = useSelector((state: RootState) => state.business?.branchID);

  const color = businessDetails?.colour_scheme || "#FF0000";

  const getItems = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getAllMenuItem/?business_identifier=${business_identifier}&branch=${branchId}`,
        headers
      );
      setMenuItems(response.data.data);
    } catch (error) {
      console.error("Error Retrieving Items:", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className=" relative ">
      <div className="  ">
        <div className="">
          <Header2>
            <div className="mt-[24px] mb-[8px] ">
              <div className="text-[50px] flex items-center gap-[20px] justify-between px-[24px] ">
                <MdKeyboardArrowLeft
                  className=" cursor-pointer"
                  onClick={handlePrevGroupClick}
                />
                <MdKeyboardArrowRight
                  className=" cursor-pointer"
                  onClick={handleNextGroupClick}
                />
              </div>

              <div className=" flex items-center gap-[10px] py-[20px] px-[14px]">
                <img
                  src={Swipe}
                  alt=""
                  className=" max-w-[50px] w-full h-auto hidden"
                  onClick={handleNextGroupClick}
                />
                <div
                  className=" flex gap-[8px] items-center  overflow-x-auto whitespace-nowrap text-[14px]"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <p
                    className={`cursor-pointer text-[32px] px-[12px] py-[8px] rounded-[4px] ${
                      selectedGroup === "All"
                        ? "font-[600] text-[#FFFFFF] border border-[#929292]"
                        : "text-[#606060] font-[400] border border-[#B6B6B6]"
                    }`}
                    style={{
                      backgroundColor:
                        selectedGroup === "All"
                          ? color || "#929292"
                          : "transparent",
                    }}
                    onClick={() => handleGroupClick("All", 0)}
                  >
                    All
                  </p>

                  <div className="flex gap-[8px] items-center">
                    {Array.from(
                      new Set(menuItems.map((menu) => menu.menu_group_name))
                    )
                      .filter((groupName) => groupName !== undefined)
                      .map((groupName, index) => (
                        <div
                          key={index}
                          ref={(el) => (groupRefs.current[index + 1] = el)}
                        >
                          <p
                            className={`cursor-pointer text-[32px] px-[12px] py-[8px] rounded-[4px] border ${
                              selectedGroup === groupName
                                ? "font-[600] text-[#FFFFFF] border-[#929292]"
                                : "text-[#606060] font-[400] border-[#B6B6B6]"
                            }`}
                            style={{
                              backgroundColor:
                                selectedGroup === groupName
                                  ? color || "#929292"
                                  : "transparent",
                              borderColor:
                                selectedGroup === groupName
                                  ? color || "#929292"
                                  : "#B6B6B6",
                            }}
                            onClick={() =>
                              handleGroupClick(groupName, index + 1)
                            }
                          >
                            {groupName}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </Header2>
        </div>

        <div className=" ">
          <div className=" flex items-center justify-between py-[32px] px-[24px]">
            <p className=" text-[32px] font-[500]">Most Popular</p>
            <div className=" text-[50px]">
              <MdKeyboardArrowRight />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Slider {...settings}>
              {menuItems.map((menu, index) => (
                <div
                  className="max-w-[406px] pb-[34px] pt-[18px] rounded-[10px] px-[7px] mb-[34px] border-2 drop-shadow border-[#E7E7E7] flex-shrink-0"
                  key={index}
                  onClick={() => openModal(menu._id)}
                >
                  <div>
                    <div className="relative">
                      <img
                        src={menu?.menu_item_image}
                        alt=""
                        className="w-full object-cover h-[300px]"
                      />

                      <div
                        className="absolute -bottom-4 text-white right-0 rounded-full"
                        style={{
                          backgroundColor: color || "#414141",
                        }}
                      >
                        <HiPlusSm className="text-[80px]" />
                      </div>
                    </div>
                    <p className="text-[32px] text-[#121212] font-[500] px-[24px] mt-[24px]">
                      {menu?.menu_item_name?.length > 18
                        ? `${menu?.menu_item_name.substring(0, 15)}...`
                        : menu?.menu_item_name}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div className="mx-[16px]">
          {Object.keys(groupedMenuItems).map((groupName) => (
            <div key={groupName} className="mb-[24px]">
              {groupName !== "undefined" && (
                <p className="text-[32px] font-bold text-[#121212] mb-[12px] px-[24px]">
                  {groupName.length > 30
                    ? `${groupName.slice(0, 30)}...`
                    : groupName}
                </p>
              )}

              {groupName !== "undefined" && (
                <div className="grid grid-cols-2 items-center gap-4 mb-[100px]">
                  {groupedMenuItems[groupName]?.map((menu) => (
                    <div
                      className="pb-[34px] pt-[18px] rounded-[10px] px-[7px] my-[34px] border-2 drop-shadow border-[#E7E7E7] max-w-[500px]"
                      key={menu._id}
                    >
                      <div>
                        <img
                          src={menu?.menu_item_image}
                          alt={menu?.menu_item_name || "Menu Item"}
                          className="w-full object-cover h-[217px] cursor-pointer"
                          onClick={() => openModal(menu._id)}
                        />

                        <p
                          className="text-[32px] text-[#121212] font-[500] px-[24px] mt-[24px]"
                          onClick={() => openModal(menu._id)}
                        >
                          {menu?.menu_item_name?.length > 18
                            ? `${menu?.menu_item_name.substring(0, 18)}...`
                            : menu?.menu_item_name}
                        </p>
                      </div>

                      <div className="pt-[8px] flex items-center justify-between px-[24px]">
                        <p
                          className="text-[36px] font-[500]"
                          style={{ color: color || "#C5291E" }}
                        >
                          &#x20A6;{menu?.menu_item_price?.toLocaleString()}
                        </p>

                        <div>
                          {ids.find((item) => item.id === menu._id) ? (
                            <div className="flex items-center justify-between gap-[20px]">
                              {/* <img
                                src={Minus}
                                alt="Minus Icon"
                                onClick={() => decrementCount(menu)}
                                className="cursor-pointer"
                              /> */}
                              <div
                                className=" flex items-center justify-end cursor-pointer rounded-full"
                                style={{
                                  backgroundColor: color || "#414141",
                                  color: "#ffffff" || "#414141",
                                }}
                                onClick={() => decrementCount(menu)}
                              >
                                <HiMinusCircle className="text-[55px]" />
                              </div>
                              <p className="text-[26px] font-[500]">
                                {ids.find((item) => item.id === menu._id)
                                  ?.quantity || 1}
                              </p>

                              <div
                                className=" flex items-center justify-end cursor-pointer rounded-full"
                                style={{
                                  backgroundColor: color || "#414141",
                                  color: "#ffffff" || "#414141",
                                }}
                                onClick={() => incrementCount(menu)}
                              >
                                <HiPlusCircle className="text-[55px]" />
                              </div>
                            </div>
                          ) : (
                            <div
                              className=" flex items-center justify-end cursor-pointer rounded-full"
                              style={{
                                backgroundColor: color || "#414141",
                                color: "#ffffff",
                              }}
                              onClick={() => openModal(menu._id)}
                            >
                              <HiPlusSm className="text-[55px]" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {ids && (
          <div className="fixed bottom-[10px] left-1/2 transform -translate-x-1/2 w-full max-w-[calc(100%-32px)] mx-auto my-[16px]">
            <div
              className="flex justify-between items-center py-[13px] px-[24px]  rounded-[3px] "
              style={{ backgroundColor: color || "#C5291E" }}
            >
              <div className="flex items-center gap-[16px] text-[44px] font-[500] text-white">
                <p>
                  Total &#x20A6;
                  {totalCount.totalPrice?.toFixed(2) || 0.0}
                </p>
              </div>
              <Link to="/demo/basket/selfcheckout">
                <p
                  className=" text-white  text-[36px] font-[500] py-[14px] px-[38px] rounded-[5px] "
                  // style={{ color: color || "#C5291E" }}
                >
                  Checkout
                </p>
              </Link>
            </div>
          </div>
        )}

        {isVisible && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 bg-[#ffffff] text-[#000000] px-4 py-4 rounded-full shadow-lg hover:bg-[#000000] hover:text-white transition-all duration-300 animate-bounce hover:animate-none"
          >
            <RiArrowUpDoubleLine className="text-2xl" />
          </button>
        )}
      </div>

      <MenuDetailsModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        menuItemId={selectedMenuItemId}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className=" pb-[128px] pt-[57px] px-[103px] flex flex-col items-center justify-center">
          <p className=" text-[36px] font-[500] text-[#000000]">
            How would you like your order?
          </p>
          <div
            className="flex items-center gap-[23px] mt-[44px]"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="px-[70px] rounded-[15px] flex flex-col gap-[41px] items-center justify-center max-w-[300px] h-[356px] w-full bg-[#F2F2F2]"
              style={
                {
                  // backgroundColor: color || "#E9B017",
                }
              }
            >
              <img src={TakeAway} alt="" className="cursor-pointer h-[150px]" />
              <p className="font-[400] text-[28px] ">Take-away</p>
            </div>
            <div
              className="px-[70px] rounded-[15px] flex flex-col gap-[41px] items-center justify-center max-w-[300px] h-[356px] w-full bg-[#F2F2F2]"
              style={
                {
                  // backgroundColor: color || "#E9B017",
                }
              }
            >
              <img src={DineIn} alt="" className="cursor-pointer h-[150px]" />
              <p className="font-[400] text-[28px]">Dine In</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
