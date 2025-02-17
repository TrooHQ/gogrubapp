import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useEffect, useState } from "react";
import Close from "../SelfCheckout/assets/close.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import Add from "../SelfCheckout/assets/incrementIcon.svg";
import Minus from "../SelfCheckout/assets/decrementIcon.svg";

import {
  removeItemFromBasket,
  setTip,
  updateItemQuantity,
} from "../slices/BasketSlice";
import Header2 from "./Header2";
import { TiDelete } from "react-icons/ti";
import MenuDetailsModal from "./MenuDetails";

export const Basket = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const backetDetails = useSelector((state: RootState) => state.basket);
  const tip = useSelector((state: RootState) => state.basket?.tip);
  const tipPercentages = [0.1, 0.125, 0.15];
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null
  );
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const dispatch = useDispatch();
  const totalPrice = useSelector(
    (state: RootState) => state.basket?.totalPrice
  );
  const handlePercentageClick = (tip: number) => {
    setSelectedPercentage(selectedPercentage === tip ? null : tip);
    setCustomAmount(null);
    setTimeout(() => {
      navigate("/demo/payment/selfcheckout");
    }, 2000);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [tipModal, setTipModal] = useState(false);

  const handleModal = () => {
    setIsOpen(false);
    setTipModal(true);
  };

  useEffect(() => {
    if (selectedPercentage !== null) {
      const tipAmount = totalPrice * selectedPercentage;
      dispatch(setTip(tipAmount));
    } else if (customAmount !== null) {
      dispatch(setTip(customAmount));
    } else {
      dispatch(setTip(null));
    }
  }, [selectedPercentage, customAmount, totalPrice]);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setCustomAmount(value);
      setSelectedPercentage(null);
    } else {
      setCustomAmount(null);
    }
  };

  const handleNoTipClick = () => {
    setSelectedPercentage(null);
    setCustomAmount(null);
    dispatch(setTip(null));
    navigate("/demo/payment/selfcheckout");
  };
  const handleNext = () => {
    navigate("/demo/payment/selfcheckout");
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

  const color = userDetails?.colour_scheme || "#FF0000";

  const openModal = (menuItemId: string) => {
    setSelectedMenuItemId(menuItemId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className=" ">
      <div className="  ">
        <div className="">
          <Header2 />
          <p className=" text-[44px] font-[500] text-[#606060] text-center">
            Order Summary
          </p>
        </div>
        <div className=" shadow-xl shadow-[#E7E7E7] border border-[#E7E7E7] my-[40px]  max-w-[960px] mx-[5%] rounded-[10px]">
          {backetDetails?.items.map((item, index) => (
            <div
              className={`border-[#E7E7E7] grid items-center mb-[10px]  px-[40px] py-[36px]  ${
                index % 2 === 0 ? "bg-[#f0f0f0]" : ""
              }`}
              key={index}
            >
              <div className=" flex  justify-between place-items-center text-start items-center">
                <p
                  className="text-[25px] text-[#121212] font-[400] max-w-[200px]"
                  onClick={() => openModal(item?.id)}
                >
                  {item?.name?.length > 12
                    ? `${item.name.slice(0, 10)}...`
                    : item.name}
                </p>
                <div className="flex items-center gap-[20px] max-w-[100px] ">
                  <img
                    src={Minus}
                    alt=""
                    onClick={() =>
                      handleDecreaseQuantity(item.id, item.quantity)
                    }
                  />
                  <p className="text-[30px] text-[#000000] font-[500] ">
                    x{item?.quantity}
                  </p>
                  <img
                    src={Add}
                    alt=""
                    onClick={() =>
                      handleIncreaseQuantity(item.id, item.quantity)
                    }
                  />
                </div>
                <p className="text-[25px] text-[#000000] font-[500] max-w-[100px]">
                  &#x20A6;{item.menuItem?.menu_item_price.toLocaleString()}
                </p>
                <p
                  className=" text-[50px] max-w-[100px]"
                  onClick={() =>
                    dispatch(removeItemFromBasket({ id: item.id }))
                  }
                  style={{
                    color: color || "#FF0000",
                  }}
                >
                  <TiDelete />
                </p>
              </div>

              {item.selectedOptions && item.selectedOptions?.length > 0 && (
                <div className="my-[32px]">
                  <p className="text-[20px] font-[400] text-[#606060]">
                    SIDES:
                  </p>
                  {item.selectedOptions.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex  justify-between place-items-center text-start items-center"
                    >
                      <p className="text-[20px] font-[500] text-[#606060] max-w-[200px] w-full ">
                        {option?.name?.length > 12
                          ? `${option.name.slice(0, 10)}...`
                          : option.name}
                      </p>
                      <div className="flex items-center gap-[20px] max-w-[100px] w-full opacity-0">
                        <img
                          src={Minus}
                          alt=""
                          onClick={() =>
                            handleDecreaseQuantity(item.id, item.quantity)
                          }
                        />
                        <p className="text-[30px] text-[#000000] font-[500] ">
                          x{item?.quantity}
                        </p>
                        <img
                          src={Add}
                          alt=""
                          onClick={() =>
                            handleIncreaseQuantity(item.id, item.quantity)
                          }
                        />
                      </div>
                      <p className="text-[20px] font-[500] text-[#606060] max-w-[100px] w-full text-center">
                        &#x20A6;
                        {(option.price * item.quantity).toLocaleString()}
                      </p>

                      <p
                        className=" text-[50px] opacity-0 max-w-[100px] w-full"
                        onClick={() =>
                          dispatch(removeItemFromBasket({ id: item.id }))
                        }
                        style={{
                          color: color || "#FF0000",
                        }}
                      >
                        <TiDelete />
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-[10px] hidden">
                <p className="text-[20px] text-[#000000] font-[500]">
                  Sub Total: &#x20A6;{item.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {backetDetails?.items.length > 0 ? (
          <div className="flex items-center justify-center text-[#000000] font-[600] text-[44px] my-[20px]">
            <p className="   ">To Pay:</p>
            <p className=" ">
              &#x20A6;{backetDetails?.totalPrice?.toLocaleString()}
            </p>
          </div>
        ) : (
          <p className=" text-[30px] text-center">No Items Selected</p>
        )}
        {backetDetails?.items.length > 0 && (
          <div className=" mt-[10px] flex items-center justify-center gap-[16px] mb-[40px]">
            <p
              className=" rounded-full cursor-pointer font-[500] text-[32px]  py-[20px] px-[40px] border-[3px] "
              onClick={() => navigate(-1)}
              style={{
                borderColor: color || "#FF0000",
                color: color || "#FF0000",
              }}
            >
              Cancel
            </p>
            <p
              className=" cursor-pointer inline font-[500] text-[32px] rounded-full border-[3px]   text-white py-[20px] px-[40px]"
              onClick={() => setIsOpen(true)}
              style={{
                backgroundColor: color || "#FF0000",
                borderColor: color || "#FF0000",
              }}
            >
              Proceed to Pay
            </p>
          </div>
        )}
      </div>

      <MenuDetailsModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        menuItemId={selectedMenuItemId}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className=" p-[32px]">
          <div
            className="  cursor-pointer flex items-center justify-end"
            onClick={() => setIsOpen(false)}
          >
            <img src={Close} alt="" className="" />
          </div>

          <div className=" max-w-[854px] flex flex-col items-center justify-center ">
            <div className=" px-[74px] text-center">
              <p className=" text-[44px] font-[500] text-[#121212] ">
                Add a Tip
              </p>
              <p className=" text-[32px] font-[500] text-[#121212] my-[16px]">
                Thank you
              </p>
              <p className=" text-[32px] font-[500] text-[#121212]">
                {/* Your Subtotal: ₦ {totalPrice ? totalPrice : "0"} */}
              </p>
              <div className=" grid grid-cols-2 items-center gap-[24px] mt-[40px]">
                {tipPercentages.map((tip, index) => (
                  <div
                    key={index}
                    className={`py-[39px] px-[134px] flex items-center  justify-center text-center cursor-pointer rounded-[10px] text-[#121212] text-[36px] font-[500] ${
                      selectedPercentage === tip
                        ? " text-white"
                        : "border-2 border-[#606060] "
                    }`}
                    onClick={() => handlePercentageClick(tip)}
                    style={{
                      backgroundColor:
                        selectedPercentage === tip ? color || "#ff0000" : " ",
                      borderColor:
                        selectedPercentage === tip
                          ? color || "#ff0000"
                          : "#606060",
                    }}
                  >
                    <p className=" text-center"> {(tip * 100).toFixed(1)}%</p>
                  </div>
                ))}

                <p
                  className=" cursor-pointer text-center py-[39px]  border-2 border-[#606060] rounded-[10px] text-[#121212] text-[36px] font-[500]"
                  onClick={handleModal}
                >
                  Custom
                </p>
              </div>
              <div
                className=" mt-[24px] cursor-pointer"
                onClick={handleNoTipClick}
              >
                <p className="text-center py-[39px]  border-2 border-[#606060] rounded-[10px] text-[#121212] text-[36px] font-[500]">
                  No Tip
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={tipModal} onClose={() => setTipModal(false)}>
        <div className=" p-[32px]">
          <div
            className="  cursor-pointer flex items-center justify-end"
            onClick={() => setTipModal(false)}
          >
            <img src={Close} alt="" className="" />
          </div>

          <div className=" w-[854px] flex flex-col items-center justify-center ">
            <div className=" px-[74px] text-center">
              <p className=" text-[44px] font-[500] text-[#121212] ">
                Enter Custom Tip
              </p>

              <input
                className="  border-b border-grey500 outline-none focus:border-grey500 w-full pb-[36px] text-center"
                type="number"
                placeholder="Enter Tip"
                value={customAmount !== null ? customAmount.toString() : ""}
                onChange={handleCustomAmountChange}
              />

              <div className="mt-[25px]">
                <p
                  className="px-[24px] py-[10px] bg-none inline rounded-[5px] text-[16px] font-[500] cursor-pointer"
                  onClick={() => setTipModal(false)}
                  style={{
                    color: color || "#FF0000",
                  }}
                >
                  Cancel
                </p>
                <p
                  className={`px-[24px] py-[10px] ${
                    !tip ? "bg-[#85C0BE]" : "cursor-pointer"
                  } inline rounded-[5px] text-[#ffffff] text-[16px] font-[500]`}
                  onClick={tip ? handleNext : undefined}
                  style={{
                    backgroundColor: tip ? color || "#FF0000" : "#85C0BE",
                  }}
                >
                  Next
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
