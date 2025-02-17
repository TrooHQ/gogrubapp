import React, { useState } from "react";
import CheckCircle from "../assets/check_circle1.svg";

interface ReusableCheckInputProps {
  text: string;
}
const CheckInput: React.FC<ReusableCheckInputProps> = ({ text }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div
      className={`flex items-center justify-between py-[8px] px-[16px] cursor-pointer ${
        isChecked ? "bg-[#EFEFEF]" : ""
      }`}
      onClick={handleCheckToggle}
    >
      <p className={`cursor-pointer text-grey500 text-[16px] font-[400]`}>
        {text}
      </p>

      {isChecked && <img src={CheckCircle} alt="" />}
    </div>
  );
};

export default CheckInput;
