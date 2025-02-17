import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import TopMenuNav from "./OnlineOrderingTopMenuNav";
import { Link, useNavigate } from "react-router-dom";

import Delivery from "../assets/delivery.svg";
import Pickup from "../assets/pickup.svg";
import {
  clearBasket,
  removeItemFromBasket,
  setDeliveryFee,
  updateCustomerAddress,
  updateCustomerDetails,
  updateItemQuantity,
} from "../../slices/BasketSlice";
import { TiDelete } from "react-icons/ti";
import MenuModal from "../Components/MenuModal";
import Back from "../assets/Cancel.svg";
import { useState } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import CustomSelect3 from "../inputFields/CustomSelect3";
import RadioInput from "../inputFields/RadioInput";

// interface Option {
//   value: string;
//   label: string;
// }

export const OnlineOrderingBasket = () => {
  const navigate = useNavigate();
  const basketDetails = useSelector((state: RootState) => state.basket);
  const dispatch = useDispatch();
  const [deliveryModal, setDeliveryModal] = useState(false);
  const [pickupModal, setPickupModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");
  // const [selectedAddress, setSelectedAddress] = useState("");

  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  // const [town, setTown] = useState("");
  const [addressvalue, setAddressvalue] = useState("");

  const DELIVERY_PRICE = 500;
  const handleDeliveryOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value === "delivery") {
      // setPickupModal(true);
      dispatch(setDeliveryFee(DELIVERY_PRICE));
    } else if (value === "pickup") {
      // setDeliveryModal(true);
      dispatch(setDeliveryFee(0));
    }
  };

  const handleCloseDeliveryModal = () => {
    setDeliveryModal(false);
    setPickupModal(false);
    setSelectedOption("");
  };

  const handleCancelModal = () => {
    setCancelModal(false);
    dispatch(clearBasket());
  };

  // const handleOptionChange = (option: string) => {
  //   setSelectedAddress(option);
  // };
  const options = ["Lekki", "Ikeja", "Ikoyi", "Yaba", "Lagos"];

  // const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const addressLocation = event.target.value;
  //   setAddressvalue(addressLocation);
  //   dispatch(updateCustomerAddress(addressLocation));
  // };

  const handleAddress = (addressLocation: string) => {
    setAddressvalue(addressLocation);
    dispatch(updateCustomerAddress(addressLocation));
  };

  console.log(addressvalue);

  const handleAddressSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleCloseDeliveryModal();
    navigate("/demo/payment-type/online_ordering");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(updateCustomerDetails({ name: userName, phone, streetAddress }));
    handleCloseDeliveryModal();
    navigate("/demo/payment-type/online_ordering");
  };

  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    dispatch(updateItemQuantity({ id, quantity: currentQuantity + 1 }));
  };

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateItemQuantity({ id, quantity: currentQuantity - 1 }));
    }
  };

  const userDetails = useSelector(
    (state: RootState) => state.business.businessDetails
  );

  const colorScheme = userDetails?.colour_scheme;

  return (
    <div className=" ">
      <TopMenuNav exploreMenuText="Basket" />

      <div className="mt-[68px]">
        {basketDetails?.items.length > 0 ? (
          basketDetails.items.map((item, index) => (
            <>
              <div key={index}>
                <div className="mx-[24px]  border-b pb-[16px] border-[#E7E7E7] mt-[16px]">
                  <div className="grid gap-[8px]">
                    <div className="  flex items-start justify-between gap-[20px] place-items-center">
                      <Link
                        to={`/demo/menu-details/${item.id}/online_ordering`}
                      >
                        <p className="text-[16px] text-[#121212] font-[500] max-w-[100px] ">
                          <span className="pr-2">{item.quantity}x</span>
                          {item?.name?.length > 12
                            ? `${item.name.slice(0, 8)}...`
                            : item.name}
                        </p>
                      </Link>
                      <div className="flex items-center mr-[10px] max-w-[100px]">
                        <div
                          className="  cursor-pointer text-white   rounded-full"
                          onClick={() =>
                            handleDecreaseQuantity(item.id, item.quantity)
                          }
                          style={{
                            backgroundColor: colorScheme || "#414141",
                          }}
                        >
                          <HiMinusSm className=" text-[20px]" />
                        </div>

                        <p className="text-[18px] text-[#000000] font-[500] mx-[10px]">
                          x{item?.quantity}
                        </p>

                        <div
                          className="  cursor-pointer text-white   rounded-full"
                          onClick={() =>
                            handleIncreaseQuantity(item.id, item.quantity)
                          }
                          style={{
                            backgroundColor: colorScheme || "#414141",
                          }}
                        >
                          <HiPlusSm className=" text-[20px]" />
                        </div>
                      </div>
                      {item.menuItem && (
                        <p className="text-[#121212]">
                          &#x20A6;
                          {(
                            item.menuItem.menu_item_price * item.quantity
                          ).toLocaleString()}
                        </p>
                      )}

                      <p
                        className=" text-[30px] "
                        onClick={() =>
                          dispatch(removeItemFromBasket({ id: item.id }))
                        }
                        style={{
                          color: colorScheme || "#606060",
                        }}
                      >
                        <TiDelete />
                      </p>
                    </div>
                    {item.selectedOptions &&
                      item.selectedOptions.length > 0 && (
                        <div className="ml-4">
                          {item.selectedOptions.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-start justify-between"
                            >
                              <p className="text-[14px] text-[#121212] font-[400]">
                                {option.name}
                              </p>

                              <p className="text-[14px] text-[#121212] font-[400]  text-start w-[100px]">
                                &#x20A6;
                                {(
                                  option.price * item.quantity
                                ).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </>
          ))
        ) : (
          <div className="py-[20px] mx-[24px] text-center text-[16px] text-[#121212] font-[500] grid place-items-center items-center">
            <p>Your cart is empty.</p>
            <p
              className=" px-[16px] py-[9px]  text-white rounded-[8px] cursor-pointer"
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: colorScheme || "#DB7F3B",
              }}
            >
              Start Ordering
            </p>
          </div>
        )}
        {basketDetails?.items.length > 0 && (
          <div className="py-[16px] mx-[24px]">
            <div className="flex items-start justify-between gap-[20px]">
              <p className="text-[16px] text-[#121212] font-[500]">Total:</p>
              <p
                className="text-[16px] font-[500] w-[100px]"
                style={{
                  color: colorScheme || "#121212",
                }}
              >
                &#x20A6;{basketDetails?.totalPrice}
              </p>
            </div>
          </div>
        )}
      </div>

      {basketDetails?.items.length > 0 && (
        <>
          <div className="mt-[40px]">
            <div className="py-[20px] mx-[24px] grid gap-[10px] border-t-[#E7E7E7] border-t">
              <p
                className="font-[400] text-[14px]"
                style={{
                  color: colorScheme || "#414141",
                }}
              >
                Choose your pickup option
              </p>
              <div className="py-[25px] flex items-center border-b ">
                <label className="flex items-center gap-[12px] pr-[24px] border-r cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="pickup"
                    checked={selectedOption === "pickup"}
                    onChange={handleDeliveryOptionChange}
                    className=""
                  />
                  <img src={Pickup} alt="Pickup" />
                  <p
                    className="font-[500] text-[16px] "
                    style={{
                      color: colorScheme || "#414141",
                    }}
                  >
                    Pickup
                  </p>
                </label>

                <label className="flex items-center gap-[12px] pl-[24px] cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="delivery"
                    checked={selectedOption === "delivery"}
                    onChange={handleDeliveryOptionChange}
                    className=""
                  />
                  <img src={Delivery} alt="Delivery" />
                  <p
                    className="font-[500] text-[16px] "
                    style={{
                      color: colorScheme || "#414141",
                    }}
                  >
                    Delivery
                  </p>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-[24px] mx-[24px] flex items-center justify-center gap-[16px]">
            <p
              className=" w-full text-center cursor-pointer font-[500] border border-[#B11111] rounded-[5px] text-[16px] text-[#B11111] py-[10px] px-[24px]"
              onClick={() => setCancelModal(true)}
            >
              Cancel
            </p>

            <button
              type="submit"
              disabled={selectedOption === ""}
              onClick={() => {
                if (selectedOption === "delivery") {
                  setDeliveryModal(true);
                } else if (selectedOption === "pickup") {
                  setPickupModal(true);
                }
              }}
              className={` w-full text-center font-[500] text-[16px]   rounded-[5px]  text-white py-[10px] px-[24px] ${
                selectedOption === "" ? " bg-[#B6B6B6]" : "border"
              }`}
              style={{
                backgroundColor:
                  selectedOption == ""
                    ? "bg-[#B6B6B6]"
                    : colorScheme || "#11AE16",
                borderColor: colorScheme || "#11AE16",
              }}
            >
              Continue
            </button>
          </div>
        </>
      )}

      <MenuModal isOpen={cancelModal} onClose={() => setCancelModal(false)}>
        <form action="" onSubmit={handleAddressSubmit}>
          <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
            <div>
              <p
                className=" text-center text-[18px] font-[500]"
                style={{
                  color: colorScheme || "#121212",
                }}
              >
                Are you sure you want to cancel this order?
              </p>

              <div className="mt-[44px] flex items-center justify-center gap-[16px]">
                <p
                  className=" w-full text-center cursor-pointer font-[500] border border-[#B11111] rounded-[5px] text-[16px] text-[#B11111] py-[10px] px-[24px]"
                  onClick={handleCancelModal}
                >
                  Yes
                </p>

                <button
                  onClick={() => setCancelModal(false)}
                  className="text-center w-full font-[500] text-[16px] border  rounded-[5px]  text-white py-[10px] px-[24px]"
                  style={{
                    backgroundColor: colorScheme || "#11AE16",
                    borderColor: colorScheme || "#11AE16",
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </form>
      </MenuModal>

      <MenuModal isOpen={deliveryModal} onClose={handleCloseDeliveryModal}>
        <form action="" onSubmit={handleAddressSubmit}>
          <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
            <div
              className=" cursor-pointer flex items-center justify-end"
              onClick={handleCloseDeliveryModal}
            >
              <img src={Back} alt="" />
            </div>
            <div>
              <p
                className="  text-[18px] font-[500]"
                style={{
                  color: colorScheme || "#121212",
                }}
              >
                Enter your details
              </p>

              <div className="py-[25px] grid gap-[16px]">
                <input
                  type="text"
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter Full Name"
                  className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />

                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[\d\s\-()+]*$/.test(value)) {
                      setPhone(value);
                    }
                  }}
                  placeholder="Phone Number"
                  className="bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full"
                  inputMode="tel"
                />
                <input
                  type="text"
                  id="name"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Street Address"
                  className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />

                <CustomSelect3
                  options={["Lekki", "Ikeja", "Ikoyi", "Yaba", "Lagos"]}
                  placeholder="City"
                  onSelect={handleAddress}
                />
              </div>
              <div className="mt-[24px] flex items-center justify-center gap-[16px]">
                <p
                  className="cursor-pointer font-[500] border border-[#B11111] rounded-[5px] text-[16px] text-[#B11111] py-[10px] px-[24px]"
                  onClick={handleCloseDeliveryModal}
                >
                  Cancel
                </p>

                <button
                  type="submit"
                  disabled={!addressvalue}
                  className=" font-[500] text-[16px] border  rounded-[5px]  text-white py-[10px] px-[24px]"
                  style={{
                    backgroundColor: colorScheme || "#11AE16",
                    borderColor: colorScheme || "#11AE16",
                  }}
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </div>
        </form>
      </MenuModal>

      <MenuModal isOpen={pickupModal} onClose={handleCloseDeliveryModal}>
        <form action="" onSubmit={handleSubmit}>
          <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
            <div
              className=" cursor-pointer flex items-center justify-end"
              onClick={handleCloseDeliveryModal}
            >
              <img src={Back} alt="" />
            </div>
            <div>
              <p
                className=" text-left text-[18px] font-[500] "
                style={{
                  color: colorScheme || "#121212",
                }}
              >
                Choose your preferred pickup location
              </p>

              <div className=" grid gap-[20px] mt-[20px]">
                <RadioInput
                  className="grid gap-[20px] text-[18px] font-[400] text-[#121212]"
                  options={options}
                  onChange={handleAddress}
                  selectedOption={addressvalue}
                />
              </div>

              <div className="mt-[24px] flex items-center justify-center gap-[16px]">
                <p
                  className="cursor-pointer font-[500] border border-[#B11111] rounded-[5px] text-[16px] text-[#B11111] py-[10px] px-[24px]"
                  onClick={handleCloseDeliveryModal}
                >
                  Cancel
                </p>

                <button
                  type="submit"
                  disabled={!addressvalue}
                  className=" font-[500] text-[16px] border rounded-[5px]  text-white py-[10px] px-[24px]"
                  style={{
                    backgroundColor: colorScheme || "#11AE16",
                    borderColor: colorScheme || "#11AE16",
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </form>
      </MenuModal>
    </div>
  );
};
