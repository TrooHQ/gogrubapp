import React, { useState } from "react";
import Arrow from "../../assets/arrow.png";

interface CustomSelect2Props {
  options: (string | { value: string; label: string })[];
  disabledOptions?: string[];
  placeholder?: string;
}

const CustomSelect2: React.FC<CustomSelect2Props> = ({
  options,
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
    setIsOpen(false);
  };

  const getOptionLabel = (option: string | { value: string; label: string }) => {
    if (typeof option === "string") {
      return option;
    }
    return option.label;
  };

  return (
    <div className="relative z-50">
      <div
        className="border border-gray-300 bg-white p-2 focus:outline-[#5955B3] w-full rounded flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <span className="selected-option text-[#a29795]">{selectedOption}</span>
        <span className={`arrow ${isOpen ? "transform rotate-180" : ""}`}>
          <img src={Arrow} alt="" />
        </span>
      </div>
      <div
        className={`options-container absolute top-full left-0 w-full border border-gray-300 bg-white shadow-md rounded-b transition-all ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={`option p-2 cursor-pointer transition-colors hover:bg-gray-100 ${
              disabledOptions &&
              disabledOptions.includes(typeof option === "string" ? option : option.value)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              !disabledOptions ||
              !disabledOptions.includes(typeof option === "string" ? option : option.value)
                ? selectOption(typeof option === "string" ? option : option.value)
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
