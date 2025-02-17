import React from "react";
import RadioChecked from "../assets/checked.svg";

interface ReusableRadioInputProps {
  text: string;
  isSelected: boolean;
  onSelect: (option: string) => void;
}

const RadioCustom: React.FC<ReusableRadioInputProps> = ({
  text,
  isSelected,
  onSelect,
}) => {
  const handleSelection = () => {
    if (isSelected) {
      onSelect("");
    } else {
      onSelect(text);
    }
  };

  return (
    <div
      className={`flex items-center justify-between py-[8px] px-[16px] cursor-pointer ${
        isSelected ? "bg-[#EFEFEF]" : ""
      }`}
      onClick={handleSelection}
    >
      <p className="cursor-pointer text-grey500 text-[16px] font-[400]">
        {text}
      </p>
      {isSelected && <img src={RadioChecked} alt="Checked" />}
    </div>
  );
};

export default RadioCustom;
