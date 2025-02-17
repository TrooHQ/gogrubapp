import React, { useState } from "react";
import Arrow from "../../assets/arrow.png";

interface CustomSelect4Props {
  options: (string | { value: string; label: string })[];
  onSelect: (selectedValue: string) => void; // Callback function to handle selection
  disabledOptions?: string[];
  placeholder?: string;
}

const CustomSelect4: React.FC<CustomSelect4Props> = ({
  options,
  onSelect,
  disabledOptions,
  placeholder = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(placeholder);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
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
    <div className="relative z-50">
      <div
        className="border border-grey200 bg-transparent p-2 focus:outline-[#5955B3] w-full rounded flex justify-between items-center"
        onClick={toggleDropdown}
      >
        {/* <span className="selected-option"> */}
        <span
          className={`selected-option ${
            selectedOption === placeholder ? " text-grey200" : ""
          }`}
        >
          {selectedOption}
        </span>
        <span className={`arrow ${isOpen ? "transform rotate-180" : ""}`}>
          <img src={Arrow} alt="" />
        </span>
      </div>
      <div
        className={`options-container  w-full border border-[#B6B6B6] bg-transparent rounded-b transition-all ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={`option px-2 py-2 text-[14px] cursor-pointer transition-colors  hover:bg-gray-100 ${
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

export default CustomSelect4;
