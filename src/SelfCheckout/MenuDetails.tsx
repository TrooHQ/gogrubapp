import React, { useEffect, useState } from "react";
import Add from "../SelfCheckout/assets/incrementwhite.svg";
import Minus from "../SelfCheckout/assets/decrementwhite.svg";
import Back from "../SelfCheckout/assets/Back.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { SERVER_DOMAIN } from "../Api/Api";
import axios from "axios";
import {
  addItemToBasket,
  removeItemFromBasket,
  updateItemInBasket,
  updateItemQuantity,
} from "../slices/BasketSlice";
import Modal from "../components/Modal";

import Loader from "../components/Loader";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaCircleCheck, FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

interface MenuItem {
  _id: string;
  id?: string;
  name: string;
  price: number;
  options?: Option[];
  menu_item_image: string;
  description: string;
  business_name: string;
  menu_category_name: string;
  menu_group_name: string;
  menu_item_name: string;
  menu_item_price: number;
}

interface Modifier {
  modifier_name: string;
  modifier_price: number;
  value: string;
}
interface Option {
  modifier_name: string;
  modifier_price: number;
  value: string;
  price: number;
  name: string;
  label?: string;
  modifiers?: Modifier[];
  modifier_group_name?: string;
}

interface BasketItem {
  id: string;
  quantity: number;
  menuItem: MenuItem;
  selectedOptions: Option[];
  totalPrice: number;
  name: string;
  tableNumber: string;
}

interface Details extends MenuItem {
  is_recommended: boolean;
  name: string;
  _id: string;
  business_name: string;
  menu_category_name: string;
  menu_group_name: string;
  menu_item_name: string;
  menu_item_image: string;
}

interface MenuDetailsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  menuItemId: string;
}

const MenuDetailsModal: React.FC<MenuDetailsModalProps> = ({
  isOpen,
  onRequestClose,
  menuItemId,
}) => {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);

  const ids = useSelector((state: RootState) => state.basket.items);

  const [menuItems, setMenuItems] = useState<Details[]>([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");

  const [menuModifiers, setMenuModifiers] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [itemCount, setItemCount] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const userDetails = useSelector(
    (state: RootState) => state.business.businessDetails
  );
  const basketItems = useSelector(
    (state: RootState) => state.basket.items
  ) as BasketItem[];
  const businessIdentifier = userDetails?._id;
  const branchId = useSelector((state: RootState) => state.business?.branchID);

  const handleCheckboxChange = (option: Modifier) => {
    const optionIndex = selectedOptions.findIndex(
      (selectedOption) => selectedOption.name === option.modifier_name
    );
    if (optionIndex !== -1) {
      const updatedOptions = [
        ...selectedOptions.slice(0, optionIndex),
        ...selectedOptions.slice(optionIndex + 1),
      ];
      setSelectedOptions(updatedOptions);
    } else {
      setSelectedOptions([
        ...selectedOptions,
        {
          name: option.modifier_name,
          price: option.modifier_price,
          modifier_name: option.modifier_name,
          modifier_price: option.modifier_price,
          value: option.value,
        },
      ]);
    }
  };

  const getItems = async (menuItemId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getMenuItemByID/?business_identifier=${businessIdentifier}&menu_item_id=${menuItemId}`
      );
      setMenuItem(response.data.data);
    } catch (error) {
      console.error("Error getting Menu Item Details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id: string) => {
    setSelectedMenuItemId(id);
  };

  useEffect(() => {
    if (selectedMenuItemId) {
      getItems(selectedMenuItemId);
    }
  }, [selectedMenuItemId]);

  useEffect(() => {
    if (menuItemId) {
      getItems(menuItemId);
    }
  }, [menuItemId]);

  const color = userDetails?.colour_scheme || "#FF0000";

  const getRecommendedItems = async () => {
    setLoading(true);
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getAllMenuItem/?business_identifier=${businessIdentifier}&branch=${branchId}`,
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
    getRecommendedItems();
  }, []);

  const getModifiers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getbusinessMenuModifierGroupByItem/?business_identifier=${businessIdentifier}&attach_to=item&name=${menuItem?.menu_item_name}&branch=${branchId}`
      );
      setMenuModifiers(response.data.data);
    } catch (error) {
      console.error("Error getting Modifiers", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (menuItem?.menu_item_name) {
      getModifiers();
    }
  }, [menuItem?.menu_item_name]);

  const existingItem = basketItems.find((item) => item.id === menuItemId);

  useEffect(() => {
    if (existingItem) {
      setMenuItem(existingItem.menuItem);
      setSelectedOptions(existingItem.selectedOptions);
      setItemCount(existingItem.quantity);
    }
  }, [existingItem]);

  const handleIncrement = () => {
    setItemCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setItemCount((prevCount) => (prevCount > 0 ? prevCount - 1 : prevCount));
  };

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

  const calculateTotalPrice = () => {
    if (!menuItem) return 0;

    const optionTotalPrice =
      selectedOptions.reduce((total, option) => {
        menuModifiers?.forEach((menu) => {
          const selectedOption = menu.modifiers?.find(
            (opt) => opt.modifier_name === option.modifier_name
          );
          if (selectedOption) {
            total += selectedOption.modifier_price;
          }
        });
        return total;
      }, 0) * itemCount;

    const itemPrice = menuItem.menu_item_price * itemCount;

    const totalPrice = itemPrice + optionTotalPrice;

    return totalPrice;
  };

  const handleAddToBasket = () => {
    if (menuItem) {
      const totalPrice = calculateTotalPrice();
      const basketItem: BasketItem = {
        id: menuItem._id,
        quantity: itemCount,
        menuItem,
        selectedOptions,
        totalPrice,
        name: menuItem.menu_item_name,
        tableNumber: userDetails?.tableNumber ?? "",
      };

      if (itemCount === 0) {
        if (existingItem) {
          dispatch(removeItemFromBasket({ id: existingItem.id }));
          setItemCount(0);
        }
      } else {
        if (existingItem) {
          dispatch(updateItemInBasket({ ...existingItem, ...basketItem }));
          setItemCount(0);
        } else {
          dispatch(addItemToBasket(basketItem));
          setItemCount(0);
        }
      }
      window.location.reload();
      onRequestClose();
    }
  };

  return (
    <div className=" relative">
      {loading ? (
        <Loader />
      ) : (
        <Modal isOpen={isOpen} onClose={onRequestClose} bg="bg-[#F1F1F1]">
          <div className=" relative">
            <div className="px-[8px] flex items-center justify-between mt-[66px] mx-[32px]">
              <img
                src={Back}
                alt=""
                onClick={onRequestClose}
                className="cursor-pointer"
              />
            </div>
            <div>
              {menuItem && (
                <div>
                  <div className="mx-[24px] mt-[32px]">
                    <img
                      src={menuItem.menu_item_image}
                      alt={menuItem.menu_item_name}
                      className="w-full h-[400px] object-cover rounded-[20px] mb-[32px]"
                    />
                  </div>
                  <div className="pb-[16px] mx-[49px]">
                    <div>
                      <div className="flex items-start justify-between">
                        <p className="text-grey500 max-w-[400px] font-[500] text-[36px] mb-[17px]">
                          {menuItem.menu_item_name}
                        </p>
                        <p className="text-[##121212] text-[36px] font-[500] mx-[24px]">
                          &#x20A6; {menuItem?.menu_item_price?.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-grey500 font-[400] text-[28px] mb-[17px]">
                          {menuItem.description ||
                            "If it Ain't Delicious, it Ain't from Chicken Republic"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* {menuModifiers.length > 0 && (
                    <div>
                      <p className="text-[#121212] mx-[49px] font-[500] text-[24px] pb-[16px] pt-[24px]">
                        Side Options
                      </p>
                    </div>
                  )} */}

                  <>
                    {menuModifiers.map((menu, index) => (
                      <div className="" key={index}>
                        <div className="">
                          <p className="text-[#121212] mx-[49px] font-[500] text-[24px] pb-[16px] pt-[24px] capitalize">
                            {menu?.modifier_group_name}
                          </p>
                          <div className="mx-[49px] grid grid-cols-2 gap-[20px]">
                            {menu?.modifiers?.map((option) => (
                              <div
                                key={option.modifier_name}
                                className="border-b shadow border rounded-[5px]"
                              >
                                <div
                                  className="flex items-center gap-[24px] py-[31px] px-[24px] cursor-pointer"
                                  onClick={() => handleCheckboxChange(option)}
                                >
                                  <div
                                    id={option.modifier_name}
                                    className={`h-[40px] min-w-[40px] border rounded-full ${
                                      selectedOptions.some(
                                        (opt) =>
                                          opt.name === option.modifier_name
                                      )
                                        ? "bg-red-600"
                                        : " border-[3px] border-[#B6B6B6]"
                                    }`}
                                  ></div>
                                  <label
                                    htmlFor={option.modifier_name}
                                    className="ml-2 text-[28px] font-[500]"
                                  >
                                    {option.modifier_name} <br />
                                    <span className="text-[16px] font-[400] text-[#000000]">
                                      {" "}
                                      (&#x20A6;
                                      {option.modifier_price?.toLocaleString()})
                                    </span>
                                  </label>
                                  <input
                                    type="checkbox"
                                    id={option.modifier_name}
                                    value={option.modifier_name}
                                    checked={selectedOptions.some(
                                      (opt) => opt.name === option.modifier_name
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(option)
                                    }
                                    className="sr-only "
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>

                  {menuItems.some(
                    (menu) => menu.is_recommended && menu._id !== menuItemId
                  ) && (
                    <div className="mx-[24px] my-[80px]">
                      <div className="flex items-center justify-between py-[32px] px-[24px]">
                        <p className="text-[32px] font-[500] text-[#121212]">
                          Recommended Items
                        </p>
                        <div className="text-[50px]">
                          <MdKeyboardArrowRight />
                        </div>
                      </div>

                      <div className="flex items-center gap-[50px] overflow-x-scroll py-[11px] cursor-pointer">
                        {menuItems.map(
                          (menu, index) =>
                            menu.is_recommended &&
                            menu._id !== menuItemId && (
                              <div
                                key={index}
                                className="flex-shrink-0 w-[531px] h-[231px] border shadow-md"
                              >
                                <div className="flex items-center justify-between px-[24px]">
                                  <div className="w-[180px] grid gap-[40px]">
                                    <p className="text-[28px] text-[#121212] font-[500]">
                                      {menu?.menu_item_name}
                                    </p>
                                    <p className="text-[28px] text-[#606060]">
                                      &#x20A6;
                                      {menu.menu_item_price?.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="relative">
                                    <img
                                      src={menu.menu_item_image}
                                      alt={menu.menu_item_name}
                                      className="h-[201px] w-[224px] object-cover rounded-[8px]"
                                    />
                                    <div>
                                      {ids.find(
                                        (item) => item.id === menu?._id
                                      ) ? (
                                        <div className="absolute bottom-2 right-2">
                                          <div className="flex items-center gap-[20px] p-[10px] rounded-[8px] bg-black">
                                            <FaCircleMinus
                                              className="text-[#ffffff]"
                                              size={30}
                                              onClick={() => decrement(menu)}
                                            />
                                            <p className="text-[36px] text-[#ffffff] font-[500]">
                                              {ids.find(
                                                (item) => item.id === menu?._id
                                              )?.quantity || 1}
                                            </p>
                                            <FaCirclePlus
                                              className="text-[#ffffff]"
                                              size={30}
                                              onClick={() => increment(menu)}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          className="absolute bottom-2 right-2"
                                          onClick={() => handleClick(menu?._id)}
                                        >
                                          <FaCirclePlus
                                            className="text-red-500"
                                            size={50}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  <div className=" mx-[24px] my-[150px]">
                    <div className=" flex items-center justify-between py-[32px] px-[24px]">
                      <p className=" text-[32px] font-[500] text-[#121212]">
                        Add Special Instructions
                      </p>
                    </div>

                    <div className=" ">
                      <div className="">
                        <textarea
                          className=" w-full h-[153px] border text-[24px] font-[400] text-[#929292] border-gray-300 rounded-md p-2 shadow-md"
                          placeholder="Enter message"
                        />
                      </div>
                      <div className=" mt-[10px] flex items-center justify-end">
                        <button
                          className="  font-[500] text-[80px]"
                          style={{ color: color || "#ff0000" }}
                        >
                          <FaCircleCheck />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 w-full max-w-[calc(100%-32px)] mx-auto my-[16px]">
                    <div
                      className="flex justify-between items-center py-[13px] px-[24px]  text-white rounded-[10px] w-full"
                      style={{ backgroundColor: color || "#C5291E" }}
                    >
                      <p className="text-[36px] font-[500]">
                        &#x20A6; {calculateTotalPrice().toLocaleString()}
                      </p>

                      <div className="flex items-center justify-between gap-[20px]">
                        <img
                          src={Minus}
                          alt=""
                          onClick={handleDecrement}
                          className="cursor-pointer"
                        />
                        <p className="text-[36px] font-[500]">{itemCount}</p>
                        <img
                          src={Add}
                          alt=""
                          onClick={handleIncrement}
                          className="cursor-pointer"
                        />
                      </div>

                      <p
                        className="text-[36px] font-[500] py-[14px] px-[48px] rounded-[5px] text-[#ffffff]  cursor-pointer"
                        onClick={handleAddToBasket}
                      >
                        Add
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MenuDetailsModal;
