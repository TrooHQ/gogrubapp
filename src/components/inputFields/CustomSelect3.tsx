import React, { useState } from "react";
import Arrow from "../../assets/arrow.png";

interface CustomSelect3Props {
  options: (string | { value: string; label: string })[];
  disabledOptions?: string[];
  placeholder?: string;
  onOptionSelect?: (option: string) => void;
}

const CustomSelect3: React.FC<CustomSelect3Props> = ({
  options,
  disabledOptions,
  placeholder = "",
  onOptionSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(placeholder);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onOptionSelect) {
      onOptionSelect(option);
    }
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
        className="border border-gray-300 bg-white p-2 focus:outline-purple500 w-full rounded flex justify-between items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="selected-option text-[#a29795]">{selectedOption}</span>
        <span className={`arrow ${isOpen ? "transform rotate-180" : ""}`}>
          <img src={Arrow} alt="" />
        </span>
      </div>
      <div
        className={`absolute left-0 w-full border border-gray-300 bg-white shadow-md rounded-b transition-all ${
          isOpen ? "block" : "hidden"
        }`}
        style={{ zIndex: 1000 }} // Ensure the dropdown has a high z-index
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

export default CustomSelect3;
