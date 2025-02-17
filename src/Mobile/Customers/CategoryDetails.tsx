import { useEffect, useRef, useState } from "react";
import TopMenuNav from "./TopMenuNav";
import { Link } from "react-router-dom";
import axios from "axios";
import { SERVER_DOMAIN } from "../../Api/Api";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import {
  addItemToBasket,
  removeItemFromBasket,
  updateItemQuantity,
} from "../../slices/BasketSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Swipe from "../assets/swipe.png";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";

interface MenuItem {
  _id: string;
  menu_item_name: string;
  menu_group_name: string;
  menu_item_image: string;
  menu_item_price: number;
  name: string;
  business_name: string;
  description: string;
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
  const [menuItems, setMenuItems] = useState<Details[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState("All");

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

  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  const groupNames = [
    "All",
    ...Array.from(
      new Set(menuItems.map((menu) => menu.menu_group_name))
    ).filter((groupName) => groupName !== undefined),
  ];

  const handleNextGroupClick = () => {
    const currentIndex = groupNames.indexOf(selectedGroup);
    const nextIndex = (currentIndex + 1) % groupNames.length;
    setSelectedGroup(groupNames[nextIndex]);

    if (groupRefs.current[nextIndex]) {
      groupRefs?.current[nextIndex]?.scrollIntoView({
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
      groupRefs?.current[prevIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const ids = useSelector((state: RootState) => state.basket.items);
  const totalCount = useSelector((state: RootState) => state.basket);

  const businessDetails = useSelector(
    (state: RootState) => state.business?.businessDetails
  );
  const business_identifier = businessDetails?._id;
  const branchId = useSelector((state: RootState) => state.business?.branchID);

  const colorScheme = businessDetails?.colour_scheme;

  const getItems = async () => {
    setLoading(true);
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
      setMenuItems(response?.data?.data);
    } catch (error) {
      console.error("Error getting Menu Items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
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
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
          arrows: true,
        },
      },
    ],
  };

  const dispatch = useDispatch();

  const increment = (menuItem: Details) => {
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

  const decrement = (menuItem: Details) => {
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
  return (
    <div className=" relative ">
      {loading && <Loader />}
      <div className="  ">
        <TopMenuNav />

        <div className="  mb-[100px]">
          <div className="text-[16px] flex items-center gap-[20px] justify-between pt-[10px] px-[24px]">
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
              onClick={handleNextGroupClick}
              className=" ml-[5px] hidden"
            />

            <div
              className=" flex gap-[8px] items-center  overflow-x-auto whitespace-nowrap text-[14px]"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <p
                ref={(el) => (groupRefs.current[0] = el)}
                className={`cursor-pointer px-[12px] py-[8px] rounded-[4px] ${
                  selectedGroup === "All"
                    ? `font-[600] text-[#FFFFFF] border border-[#929292]`
                    : "text-[#606060] font-[400] border border-[#B6B6B6]"
                }`}
                style={{
                  backgroundColor:
                    selectedGroup === "All"
                      ? colorScheme || "#929292"
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
                    <div key={index + 1}>
                      <p
                        ref={(el) => (groupRefs.current[index + 1] = el)}
                        className={`cursor-pointer px-[12px] py-[8px] rounded-[4px] border border-[${colorScheme}]`}
                        style={{
                          backgroundColor:
                            selectedGroup === groupName
                              ? colorScheme || "#929292"
                              : "transparent",
                          borderColor:
                            selectedGroup === groupName
                              ? colorScheme || "#929292"
                              : "#B6B6B6",
                          color:
                            selectedGroup === groupName ? "#FFFFFF" : "#606060",
                          fontWeight:
                            selectedGroup === groupName ? "bold" : "400",
                          borderStyle: "solid",
                        }}
                        onClick={() => handleGroupClick(groupName, index + 1)}
                      >
                        {groupName}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className=" bg-[#F2F2F2]">
            <div className=" flex items-center justify-between py-[14px] px-[24px]">
              <p className=" text-[16px] font-[500]">Most Popular</p>
              <div className=" text-[16px]">
                <MdKeyboardArrowRight />
              </div>
            </div>
            <div className="overflow-x-auto mx-[12px]">
              <Slider {...settings}>
                {menuItems.map((menu, index) => (
                  <div
                    className="max-w-[170px] h-[167px] mx-auto pb-[34px]  p-[5px] rounded-[10px]   border-2 drop-shadow bg-[#FFFFFF] border-[#E7E7E7] flex-shrink-0"
                    key={index}
                  >
                    <Link to={`/demo/menu-details/${menu._id}/orderandpay`}>
                      <div>
                        <div className=" w-full h-[112px] relative">
                          <img
                            src={menu?.menu_item_image}
                            alt=""
                            className="w-full object-cover h-full"
                          />

                          <div
                            className="absolute -bottom-4 text-white right-0 rounded-full"
                            style={{
                              backgroundColor: colorScheme || "#414141",
                            }}
                          >
                            <HiPlusSm className="text-[37px]" />
                          </div>
                        </div>
                        <p className="text-[14px] text-[#121212] font-[500] px-[16px] mt-[8px] text-center">
                          {menu?.menu_item_name?.length > 10
                            ? `${menu?.menu_item_name.substring(0, 10)}...`
                            : menu?.menu_item_name}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          <div className=" py-[20px]">
            {Object.keys(groupedMenuItems).map((groupName) => (
              <div key={groupName} className="mb-[24px]">
                {groupName && (
                  <p
                    className="mx-[24px] text-[20px] font-bold text-[#ffffff] mb-[12px] px-[8px] py-[8px]"
                    style={{
                      borderLeft: `5px solid ${colorScheme || "#414141"}`,
                      color: colorScheme || "#414141",
                    }}
                  >
                    {groupName && groupName !== "undefined"
                      ? groupName.length > 20
                        ? `${groupName.slice(0, 20)}...`
                        : groupName
                      : ""}
                  </p>
                )}

                {groupedMenuItems[groupName].map((menu) => (
                  <div key={menu._id} className="mx-[24px]">
                    <div className="py-[11px] border-b border-[#E7E7E7]">
                      <div className="flex items-center justify-between">
                        <Link to={`/demo/menu-details/${menu._id}/orderandpay`}>
                          <div className="w-[180px]">
                            <p className="text-[16px] text-[#121212] font-[500]">
                              {menu?.menu_item_name?.length > 20
                                ? `${menu.menu_item_name.slice(0, 20)}...`
                                : menu.menu_item_name}
                            </p>
                            <p className="text-[12px] font-[400] text-[#121212]">
                              {menu?.description?.length > 50
                                ? `${menu.description.slice(0, 50)}...`
                                : menu.description || "A Delicious Delicacy"}
                            </p>
                          </div>
                        </Link>

                        <Link to={`/demo/menu-details/${menu._id}/orderandpay`}>
                          <div
                            className="h-[80px] w-[80px] border-4 rounded-[8px] overflow-hidden p-0 m-0 flex items-center justify-center"
                            style={{
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                            }}
                          >
                            <img
                              src={menu?.menu_item_image}
                              alt={menu?.menu_item_name}
                              className=" h-full w-full object-cover "
                            />
                          </div>
                        </Link>
                      </div>

                      <div className="pt-[8px] flex items-center justify-between">
                        <p className="text-[16px] text-[#121212] font-[500]">
                          From &#x20A6;{menu.menu_item_price.toLocaleString()}
                        </p>

                        <div className="w-[100px]">
                          {ids.find((item) => item.id === menu._id) ? (
                            <div className="flex items-center justify-end gap-[12px]">
                              <div
                                className="cursor-pointer text-white rounded-full"
                                onClick={() => decrement(menu)}
                                style={{
                                  backgroundColor: colorScheme || "#414141",
                                }}
                              >
                                <HiMinusSm className="text-[27px]" />
                              </div>

                              <p className="text-[16px] font-[500]">
                                {ids.find((item) => item.id === menu._id)
                                  ?.quantity || 1}
                              </p>

                              <div
                                className="cursor-pointer text-white rounded-full"
                                onClick={() => increment(menu)}
                                style={{
                                  backgroundColor: colorScheme || "#414141",
                                }}
                              >
                                <HiPlusSm className="text-[27px]" />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <Link
                                to={`/demo/menu-details/${menu._id}/orderandpay`}
                              >
                                <div className="flex items-center justify-end">
                                  <div
                                    className="inline-flex cursor-pointer text-white rounded-full"
                                    style={{
                                      backgroundColor: colorScheme || "#414141",
                                    }}
                                  >
                                    <HiPlusSm className="text-[27px]" />
                                  </div>
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {ids && (
          <div
            className=" fixed bottom-[10px] left-1/2 transform -translate-x-1/2 w-full max-w-[calc(100%-32px)] mx-auto"
            style={{
              backgroundColor: colorScheme || "#414141",
            }}
          >
            <div className="flex justify-between items-center py-[13px] px-[24px] text-white  rounded-[3px] cursor-pointer">
              <div className="flex items-center gap-[16px]">
                <p
                  className="bg-white rounded-[5px]  py-[2px] px-[10px] text-[16px] font-[500]"
                  style={{
                    color: colorScheme || "#414141",
                  }}
                >
                  {totalCount.totalQuantity || 0}
                </p>

                <p>&#x20A6;{totalCount.totalPrice.toLocaleString() || 0.0}</p>
              </div>
              <Link to="/demo/basket/orderandpay">
                <p className="text-[16px] font-[500]">View Basket</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
