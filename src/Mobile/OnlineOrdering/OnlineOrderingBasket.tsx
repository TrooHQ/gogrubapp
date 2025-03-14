import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import TopMenuNav from "./OnlineOrderingTopMenuNav";
import { Link, useNavigate } from "react-router-dom";

import Delivery from "../assets/delivery.svg";
import Pickup from "../assets/pickup.svg";
import pickupIcon from "../assets/ic_outline-delivery-dining.svg";
import {
  clearBasket,
  removeItemFromBasket,
  setDeliveryFee,
  updateCustomerAddress,
  // updateCustomerAddress,
  updateCustomerDetails,
  updateCustomerName,
  updateDeliveryDetails,
  updateItemQuantity,
} from "../../slices/BasketSlice";
import { TiDelete } from "react-icons/ti";
import MenuModal from "../Components/MenuModal";
import Back from "../assets/Cancel.svg";
import { useEffect, useState } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import RadioInput from "../inputFields/RadioInput";

export const OnlineOrderingBasket = () => {
  const navigate = useNavigate();
  const basketDetails = useSelector((state: RootState) => state.basket);
  const dispatch = useDispatch();
  const [deliveryModal, setDeliveryModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [scheduleDelivery, setSheduleDelivery] = useState(true);
  const [pickupModal, setPickupModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postCode, setPostCode] = useState("");

  useEffect(() => {
    dispatch(updateCustomerName(userName));
  }, [userName, dispatch]);

  useEffect(() => {
    setIsFormValid(
      userName.trim() !== "" &&
        phone.trim() !== "" &&
        streetAddress.trim() !== ""
    );
  }, [userName, phone, streetAddress]);

  const handleDeliveryOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSelectedOption(value);

    dispatch(updateCustomerDetails({ name: "", phone: "", streetAddress: "" }));
    dispatch(updateCustomerAddress(""));

    if (value === "delivery") {
      dispatch(setDeliveryFee(DELIVERY_PRICE ?? null));
    } else if (value === "pickup") {
      dispatch(setDeliveryFee(0));
    }
  };

  const handleCloseDeliveryModal = () => {
    setDeliveryModal(false);
    setScheduleModal(true);
    setPickupModal(false);
    setSelectedOption("");
  };
  const handleCloseScheduleModal = () => {
    setScheduleModal(false);
  };

  const handleCancelModal = () => {
    setCancelModal(false);
    dispatch(clearBasket());
  };

  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (Array.isArray(deliveryDetails?.pickUpLoacation)) {
      setOptions(
        deliveryDetails.pickUpLoacation.map(
          (location: { address: string }) => location.address
        )
      );
    }
  }, []);

  const deliveryDetails = useSelector(
    (state: RootState) => state.business?.deliveryDetails
  );

  const [addressvalue, setAddressvalue] = useState(
    `${deliveryDetails?.deliveryDetails?.state}`
  );

  const DELIVERY_PRICE = deliveryDetails?.deliveryDetails?.fixedPrice;

  const handleAddress = (addressLocation: string) => {
    setAddressvalue(addressLocation);
    dispatch(updateCustomerAddress(addressLocation));
  };

  const handleAddressSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;
    dispatch(updateCustomerDetails({ name: userName, phone, streetAddress }));

    {
      deliveryDetails?.canScheduledDelivery === false
        ? handleCloseDeliveryModal()
        : navigate("/demo/payment-type/online_ordering");
    }
  };

  const handleScheduleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(updateDeliveryDetails({ time, date }));

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
                <div className="mx-[24px]  border-b pb-[16px] border-grey40 mt-[16px]">
                  <div className="grid gap-[8px]">
                    <div className="  flex items-start justify-between gap-[20px] place-items-center">
                      <Link
                        to={`/demo/menu-details/${item.id}/online_ordering`}
                      >
                        <p className="text-[16px] text-grey500 font-[500] max-w-[100px] ">
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
                        <p className="text-grey500">
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
                              <p className="text-[14px] text-grey500 font-[400]">
                                {option.name}
                              </p>

                              <p className="text-[14px] text-grey500 font-[400]  text-start w-[100px]">
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
          <div className="py-[20px] mx-[24px] text-center text-[16px] text-grey500 font-[500] grid place-items-center items-center">
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
              <p className="text-[16px] text-grey500 font-[500]">Total:</p>
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
            <div className="py-[20px] mx-[24px] grid gap-[10px] border-t-grey40 border-t">
              <p
                className="font-[400] text-[14px]"
                style={{
                  color: colorScheme || "#414141",
                }}
              >
                Choose your pickup option
              </p>
              <div className="py-[25px] flex items-center border-b ">
                {deliveryDetails?.hadPickUpLocation === true && (
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
                )}

                {deliveryDetails?.hasDeliveryDetails === true && (
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
                )}
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
                selectedOption === "" ? " bg-grey100" : "border"
              }`}
              style={{
                backgroundColor:
                  selectedOption == ""
                    ? "bg-grey100"
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
      </MenuModal>

      <MenuModal isOpen={deliveryModal} onClose={() => setDeliveryModal(false)}>
        <form action="" onSubmit={handleAddressSubmit}>
          <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
            <div
              className=" cursor-pointer flex items-center justify-end"
              onClick={() => setDeliveryModal(false)}
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
                Please Enter your details
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
                  placeholder="WhatsApp Number"
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

                <input
                  type="text"
                  id="name"
                  value={deliveryDetails?.deliveryDetails?.state}
                  placeholder="LGA"
                  onChange={(e) => handleAddress(e.target.value)}
                  className={`bg-transparent  placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                  readOnly
                />

                <input
                  type="text"
                  id="name"
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                  placeholder="Post Code (Optional)"
                  className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />
              </div>
              <div className="mt-[24px] flex items-center justify-center gap-[16px]">
                <p
                  className="cursor-pointer font-[500] border border-[#B11111] rounded-[5px] text-[16px] text-[#B11111] py-[10px] px-[24px]"
                  onClick={() => setDeliveryModal(false)}
                >
                  Cancel
                </p>

                <button
                  type="submit"
                  // disabled={!addressvalue}
                  disabled={!isFormValid}
                  className=" font-[500] text-[16px] border  rounded-[5px]  text-white py-[10px] px-[24px]"
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

      <MenuModal isOpen={scheduleModal} onClose={handleCloseDeliveryModal}>
        <form action="" onSubmit={handleScheduleSubmit}>
          <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
            <div className=" space-y-[44px]">
              <div className=" border border-[#0D0D0D] p-[28px] rounded-[5px] flex  items-center">
                <input
                  type="checkbox"
                  id="delivery"
                  className="h-[16px] w-[16px] mr-[24px] border border-black checked:bg-black"
                  checked={scheduleDelivery}
                  onChange={() => setSheduleDelivery(!scheduleDelivery)}
                />
                <div className=" flex items-center gap-[10px]">
                  <label
                    htmlFor="delivery"
                    className="text-[16px] font-[400] text-grey500"
                  >
                    Schedule Delivery
                  </label>

                  <img src={pickupIcon} alt="" />
                </div>
              </div>

              <div className="py-[25px] grid gap-[16px]">
                <p className=" font-[400] text-[12px] text-[#121212] font-GeneralSans">
                  You can now schedule your order, your selected time is below
                  and can be modified
                </p>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Set Date"
                  disabled={!scheduleDelivery}
                  min={new Date().toISOString().split("T")[0]}
                  className={` ${
                    !scheduleDelivery
                      ? " placeholder:text-[#1212123D] text-[#1212123D]"
                      : ""
                  } bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full 
                  `}
                />

                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Set Time"
                  disabled={!scheduleDelivery}
                  className={` ${
                    !scheduleDelivery
                      ? " placeholder:text-[#1212123D] text-[#1212123D]"
                      : ""
                  } bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />
              </div>
              <div className="mt-[24px] flex items-center justify-center gap-[16px]">
                <p
                  className="cursor-pointer font-[500] border border-[#B11111] rounded-[5px] text-[16px] text-[#B11111] py-[10px] px-[24px]"
                  onClick={handleCloseScheduleModal}
                >
                  Cancel
                </p>

                <button
                  type="submit"
                  disabled={
                    !addressvalue ||
                    (scheduleDelivery && !date) ||
                    (scheduleDelivery && !time)
                  }
                  className=" font-[500] text-[16px] border  rounded-[5px]  text-white py-[10px] px-[24px]"
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

      <MenuModal isOpen={pickupModal} onClose={handleCloseDeliveryModal}>
        <form action="" onSubmit={handleSubmit}>
          <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
            <div
              className=" cursor-pointer flex items-center justify-end"
              onClick={() => setPickupModal(false)}
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
                  className="grid gap-[20px] text-[18px] font-[400] text-grey500"
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
