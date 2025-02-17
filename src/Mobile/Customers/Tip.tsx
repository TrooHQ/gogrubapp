import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopMenuNav from "./TopMenuNav";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { setTip } from "../../slices/BasketSlice";

export const Tip = () => {
  const navigate = useNavigate();
  const totalPrice = useSelector(
    (state: RootState) => state.basket?.totalPrice
  );
  const tip = useSelector((state: RootState) => state.basket?.tip);
  const dispatch = useDispatch();
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
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
    navigate("/demo/payment-type/orderandpay");
  };

  const userDetails = useSelector(
    (state: RootState) => state.business.businessDetails
  );

  const colorScheme = userDetails?.colour_scheme;

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
                className={`flex flex-col items-center px-[36px] py-[8px] border border-[#B6B6B6] rounded-[3px] cursor-pointer`}
                style={{
                  backgroundColor:
                    selectedTip === tip ? colorScheme || "#E0E0E0" : "",
                  color: selectedTip === tip ? "#ffffff" : "#121212",
                }}
                onClick={() => handleTipClick(tip)}
              >
                <p className=" text-[16px] font-[500]">
                  {(tip * 100).toFixed(1)}%
                </p>
                <p className=" text-[14px] font-[400]">
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
            className=" cursor-pointer font-[500] text-[16px] py-[10px] px-[24px] "
            style={{ color: colorScheme || "#FF0000" }}
            onClick={handleNoTipClick}
          >
            No Tip
          </p>
          <Link to="/demo/payment-type/orderandpay">
            <p
              className=" inline font-[500] text-[16px] rounded-[5px] text-[#ffffff]  py-[10px] px-[56px]"
              style={{ backgroundColor: colorScheme || "#FF0000" }}
            >
              Add Tip
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
