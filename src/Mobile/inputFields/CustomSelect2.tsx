import React, { useState } from "react";
import Arrow from "../../assets/arrow.png";

interface CustomSelect2Props {
  options: (string | { value: string; label: string })[];
  disabledOptions?: string[];
  placeholder?: string;
  bgColor?: string;
}

const CustomSelect2: React.FC<CustomSelect2Props> = ({
  options,
  disabledOptions,
  placeholder = "",
  bgColor = "bg-white",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(placeholder);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const getOptionLabel = (
    option: string | { value: string; label: string }
  ) => {
    if (typeof option === "string") {
      return option;
    }
    return option.label;
  };

  return (
    <div className="relative z-[999]">
      <div
        className={`border border-gray-300 p-2 focus:outline-[#5955B3] w-full rounded flex justify-between items-center ${bgColor}`}
        onClick={toggleDropdown}
      >
        <span className="selected-option">{selectedOption}</span>
        <span className={`arrow ${isOpen ? "transform rotate-180" : ""}`}>
          <img src={Arrow} alt="" />
        </span>
      </div>
      <div
        className={`options-container absolute top-full left-0 w-full border border-gray-300 shadow-md rounded-b transition-all ${
          isOpen ? "block" : "hidden"
        } ${bgColor}`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={`option p-2 cursor-pointer transition-colors hover:bg-gray-100 ${
              disabledOptions &&
              disabledOptions.includes(
                typeof option === "string" ? option : option.value
              )
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              !disabledOptions ||
              !disabledOptions.includes(
                typeof option === "string" ? option : option.value
              )
                ? selectOption(
                    typeof option === "string" ? option : option.value
                  )
                : null
            }
          >
            {getOptionLabel(option)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect2;
