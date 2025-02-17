import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import TopMenuNav from "./TopMenuNav";
import Add from "../assets/Plus.svg";
import MinusMain from "../assets/MinusCounter.svg";
import { SERVER_DOMAIN } from "../../Api/Api";
import axios from "axios";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { FaCircleCheck } from "react-icons/fa6";

import {
  addItemToBasket,
  removeItemFromBasket,
  updateItemInBasket,
  updateItemQuantity,
} from "../../slices/BasketSlice";
import Loader from "../../components/Loader";
import { MdKeyboardArrowRight } from "react-icons/md";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";

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

export interface BasketItem {
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

const MenuDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<Details[]>([]);
  const ids = useSelector((state: RootState) => state.basket.items);

  const [menuModifiers, setMenuModifiers] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const [itemCount, setItemCount] = useState<number>(1);
  const dispatch = useDispatch();

  const userDetails = useSelector(
    (state: RootState) => state.business.businessDetails
  );

  const colorScheme = userDetails?.colour_scheme;

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
          value: option.modifier_name,
        },
      ]);
    }
  };
  const [loading, setLoading] = useState(false);

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

  const getItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getMenuItemByID/?business_identifier=${businessIdentifier}&menu_item_id=${id}`
      );
      setMenuItem(response.data.data);
    } catch (error) {
      console.error("Error getting Business Details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, [id]);

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

  const existingItem = basketItems.find((item) => item.id === id);

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
        }
      } else {
        if (existingItem) {
          dispatch(updateItemInBasket({ ...existingItem, ...basketItem }));
        } else {
          dispatch(addItemToBasket(basketItem));
        }
      }

      navigate(-1);
    }
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

  return (
    <div className="menu-description relative">
      {loading && <Loader />}

      <TopMenuNav />
      {menuItem && (
        <div className=" relative">
          <div className="menu-item-image-container mx-[24px] mt-[32px] max-w-[400px] h-[300px] rounded-[20px] overflow-hidden">
            <img
              src={menuItem.menu_item_image}
              alt={menuItem.menu_item_name}
              className="w-full object-cover"
            />
          </div>

          <div className="menu-item-description mt-[24px] pb-[16px] border-b">
            <div className="flex items-center justify-between mx-[24px]">
              <p className="text-grey500 font-[500] text-[18px] mb-[17px]">
                {menuItem.description || "A Delicious Delicacy"}
              </p>
            </div>
            <p className="text-grey500 text-[16px] mx-[24px]">
              &#x20A6; {menuItem.menu_item_price}
            </p>
          </div>

          {menuModifiers.length > 0 && (
            <div className="menu-item-modifiers pb-[16px] border-b">
              <p className="text-[#FF0000] mx-[24px] font-[500] text-[18px] pb-[16px] pt-[24px]">
                Customize
              </p>
              <>
                {menuModifiers.map((menu, index) => (
                  <div
                    className="text-[#606060] mx-[24px] font-[500] text-[16px] pb-[16px] pt-[24px]"
                    key={index}
                  >
                    <p className="">{menu?.modifier_group_name}</p>

                    {menu?.modifiers?.map((option) => (
                      <div key={option.modifier_name} className="border-b">
                        <div className="flex items-center justify-between py-[16px] mx-[24px]">
                          <label
                            htmlFor={option.modifier_name}
                            className="ml-2"
                          >
                            {option.modifier_name} (
                            {option.modifier_price.toLocaleString()})
                          </label>
                          <input
                            type="checkbox"
                            id={option.modifier_name}
                            value={option.modifier_name}
                            checked={selectedOptions.some(
                              (opt) => opt.name === option.modifier_name
                            )}
                            onChange={() => handleCheckboxChange(option)}
                            className={`h-5 w-5 ${
                              selectedOptions.some(
                                (opt) => opt.name === option.modifier_name
                              )
                                ? "bg-red-600"
                                : "bg-white"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            </div>
          )}

          <div className="menu-item-quantity py-[16px]">
            <p
              className=" text-[16px] font-[500] mx-[24px] mb-[10px]"
              style={{ color: colorScheme || "#ff0000" }}
            >
              Quantity
            </p>
            <hr />
            <div className="flex items-center justify-center">
              <div className="mt-[24px] mb-[37px] items-center rounded-[5px] justify-center inline-flex bg-[#E7E7E7]">
                <p className="py-[12px] px-[20px]" onClick={handleDecrement}>
                  <img src={MinusMain} alt="decrement" />
                </p>
                <p className="bg-white py-[12px] px-[25px] text-[16px] font-[500]">
                  {itemCount}
                </p>
                <p className="py-[12px] px-[20px]" onClick={handleIncrement}>
                  <img src={Add} alt="increment" />
                </p>
              </div>
            </div>
          </div>

          <div className="mx-[24px]">
            {menuItems.some(
              (menu) => menu.is_recommended && menu._id !== id
            ) && (
              <div className=" flex items-center justify-between my-[20px]">
                <p className="text-[16px] text-[#121212] font-[500] ">
                  Recommended Items
                </p>
                <div className=" text-[16px]">
                  <MdKeyboardArrowRight />
                </div>
              </div>
            )}

            <div className="flex items-center gap-[50px] overflow-x-scroll py-[11px] border-t border-[#E7E7E7] cursor-pointer">
              {menuItems.map(
                (menu) =>
                  menu.is_recommended &&
                  menu._id !== id && (
                    <div key={menu.id} className="flex-shrink-0 w-[280px]">
                      <div className="flex items-center justify-between">
                        <div className="w-[180px]">
                          <p className="text-[16px] text-[#121212] font-[500]">
                            {menu?.menu_item_name}
                          </p>
                          <p className="text-[12px] text-[#121212]">
                            {menu?.description || "A Delicious Delicacy"}
                          </p>
                        </div>
                        <Link to={`/demo/menu-details/${menu._id}/orderandpay`}>
                          <div>
                            <img
                              src={menu?.menu_item_image}
                              alt={menu.menu_item_name}
                              className="h-[80px] w-[80px] object-cover rounded-[8px]"
                            />
                          </div>
                        </Link>
                      </div>
                      <div className="pt-[8px] flex items-center justify-between">
                        <p className="text-[16px] text-[#121212] font-[500]">
                          &#x20A6;{menu?.menu_item_price.toLocaleString()}
                        </p>
                        <div className="w-[100px]">
                          {ids.find((item) => item.id === menu._id) ? (
                            <div className="flex items-center justify-between">
                              <div
                                className="inline-flex cursor-pointer text-white rounded-full"
                                onClick={() => decrement(menu)}
                                style={{
                                  backgroundColor: colorScheme || "#414141",
                                }}
                              >
                                <HiMinusSm className="text-[30px]" />
                              </div>
                              <p className="text-[16px] font-[500]">
                                {ids.find((item) => item.id === menu._id)
                                  ?.quantity || 1}
                              </p>
                              <div
                                className="inline-flex cursor-pointer text-white rounded-full"
                                onClick={() => increment(menu)}
                                style={{
                                  backgroundColor: colorScheme || "#414141",
                                }}
                              >
                                <HiPlusSm className="text-[30px]" />
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
                                    <HiPlusSm className="text-[30px]" />
                                  </div>
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>

          <div className=" mx-[24px] mb-[150px] mt-[16px]">
            <div className=" flex items-center justify-between py-[16px] ">
              <p className=" text-[16px] font-[500] text-[#121212]">
                Add Special Instructions
              </p>
            </div>

            <div className=" ">
              <div className="">
                <textarea
                  className=" text-[16px] w-full h-[153px] border  font-[400] text-[#929292] border-gray-300 rounded-md p-2 shadow-md"
                  placeholder="Enter message here "
                />
              </div>
              <div className=" mt-[10px] flex items-center justify-end">
                <button
                  className=" font-[500] text-[40px]"
                  style={{ color: colorScheme || "#ff0000" }}
                >
                  <FaCircleCheck />
                </button>
              </div>
            </div>
          </div>

          <div
            className="fixed bottom-[10px] left-1/2 transform -translate-x-1/2 w-full max-w-[calc(100%-32px)] mx-auto  my-[16px]"
            style={{
              backgroundColor: colorScheme || "#414141",
            }}
          >
            <div
              className="flex justify-between items-center py-[13px] px-[24px]  text-white rounded-[3px] cursor-pointer"
              onClick={handleAddToBasket}
            >
              <p className="text-[16px] font-[500]">
                &#x20A6; {calculateTotalPrice()}
              </p>
              <p className="text-[16px] font-[500]">Add to basket</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDetails;
