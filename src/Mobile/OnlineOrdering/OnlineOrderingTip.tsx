import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopMenuNav from "./OnlineOrderingTopMenuNav";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { setTip } from "../../slices/BasketSlice";
import Customer from "../assets/streamline_customer-support-1-solid.svg";

export const OnlineOrderingTip = () => {
  const navigate = useNavigate();
  const totalPrice = useSelector(
    (state: RootState) => state.basket?.totalPrice
  );
  const tip = useSelector((state: RootState) => state.basket?.tip);
  const dispatch = useDispatch();
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const basketDetails = useSelector((state: RootState) => state.basket);
  const tipPercentages = [0.1, 0.125, 0.15];

  useEffect(() => {
    if (tip !== null) {
      const matchingTip = tipPercentages.find(
        (percentage) => totalPrice * percentage === tip
      );
      if (matchingTip !== undefined) {
        setSelectedTip(matchingTip);
        setCustomAmount(null);
      } else {
        setSelectedTip(null);
        setCustomAmount(tip);
      }
    }
  }, [tip, totalPrice]);

  const handleTipClick = (tip: number) => {
    setSelectedTip(selectedTip === tip ? null : tip);
    setCustomAmount(null);
  };

  useEffect(() => {
    if (selectedTip !== null) {
      const tipAmount = totalPrice * selectedTip;
      dispatch(setTip(tipAmount));
    } else if (customAmount !== null) {
      dispatch(setTip(customAmount));
    } else {
      dispatch(setTip(null));
    }
  }, [selectedTip, customAmount, totalPrice]);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setCustomAmount(value);
      setSelectedTip(null);
    } else {
      setCustomAmount(null);
    }
  };

  const handleNoTipClick = () => {
    setSelectedTip(null);
    setCustomAmount(null);
    dispatch(setTip(null));
    navigate("/demo/payment-type/online_ordering");
  };

  useEffect(() => {
    console.log("Basket Details:");
  }, [basketDetails]);

  return (
    <div className="  ">
      <TopMenuNav exploreMenuText="Tip" />

      <div className=" mt-[68px] ">
        <div className=" px-[16px] grid gap-[8px] mb-[40px]">
          <p className=" text-center text-[18px] font-[500] text-[#121212]">
            Enter Tip
          </p>
          <div className=" grid grid-cols-3 gap-[8px]">
            {tipPercentages.map((tip, index) => (
              <div
                key={index}
                className={`flex flex-col items-center px-[36px] py-[8px] border border-[#B6B6B6] rounded-[3px] cursor-pointer ${
                  selectedTip === tip ? "bg-[#E0E0E0]" : ""
                }`}
                onClick={() => handleTipClick(tip)}
              >
                <p className=" text-[#121212] text-[16px] font-[500]">
                  {(tip * 100).toFixed(1)}%
                </p>
                <p className=" text-[14px] text-[#121212] font-[400]">
                  {(totalPrice * tip).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className=" flex  items-center justify-center">
          <label htmlFor="">&#x20A6;</label>
          <input
            className="border-b border-[#929292] outline-none focus:border-grey500 pb-[8px] text-center"
            type="text"
            value={customAmount !== null ? customAmount.toString() : ""}
            onChange={handleCustomAmountChange}
            placeholder="Custom Amount"
          />
        </div>

        <div className=" mt-[60px] flex items-center justify-center gap-[16px]">
          <p
            className=" cursor-pointer font-[500] text-[16px] py-[10px] px-[24px] text-[#606060]"
            onClick={handleNoTipClick}
          >
            No Tip
          </p>
          <Link to="/demo/payment-type/online_ordering">
            <p className=" inline font-[500] text-[16px] rounded-[5px] text-[#ffffff] bg-[#606060] py-[10px] px-[56px]">
              Add Tip
            </p>
          </Link>
        </div>

        <div className="fixed bottom-[20px] inset-x-0 flex justify-center">
          <div className="flex flex-wrap items-center gap-[2px] mt-[32px]">
            <img src={Customer} alt="Customer" />
            <p className="font-[400] text-center text-[12px] text-[#000000]">
              Contact Support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
