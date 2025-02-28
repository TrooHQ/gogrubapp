import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoMdSearch } from "react-icons/io";

interface Option {
  value: string;
  label: string;
  link?: string;
}

interface CustomSelect3Props {
  options: (string | Option)[];
  disabledOptions?: string[];
  placeholder?: string;
  BG?: string;
  text?: string;
  hover?: string;
  searchable?: boolean;
  onSelect?: (option: string) => void;
  value?: string | null;
}

const CustomSelect3: React.FC<CustomSelect3Props> = ({
  options,
  disabledOptions,
  placeholder = "",
  BG,
  text,
  hover = "hover:bg-gray-100",
  searchable = false,
  onSelect,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    value || placeholder
  );

  useEffect(() => {
    setSelectedOption(value || placeholder);
  }, [value, placeholder]);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: string, link?: string) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option);
    }
    setIsOpen(false);
    if (link) {
      navigate(link);
    }
  };

  const getOptionLabel = (option: string | Option) => {
    if (typeof option === "string") {
      return option;
    }
    return option.label;
  };

  const getOptionValue = (option: string | Option) => {
    if (typeof option === "string") {
      return option;
    }
    return option.label;
  };

  const filteredOptions = options.filter((option) =>
    getOptionLabel(option).toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (searchable && searchQuery !== "") {
      setIsOpen(true);
    }
  }, [searchQuery, searchable]);

  return (
    <div className="relative">
      {searchable && (
        <div className="relative mb-[8px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search outlet"
            className="p-2 w-full border border-[#929292] bg-grey700 focus:outline-none rounded-full"
            style={{ paddingLeft: "2.5rem" }}
          />
          <IoMdSearch className="absolute text-2xl top-1/2 left-2 transform -translate-y-1/2 text-[#929292]" />
        </div>
      )}
      <div
        className={`border border-gray-300 ${
          BG ? BG : "bg-white"
        } p-2 focus:outline-purple500 ${
          text ? text : "text-black"
        } w-full rounded flex justify-between items-center gap-[8px] cursor-pointer ${
          searchable ? "rounded-b-none" : "rounded"
        }`}
        onClick={toggleDropdown}
      >
        <span className="selected-option text-[14px]">{selectedOption}</span>
        <span className={`arrow ${isOpen ? "transform rotate-180" : ""}`}>
          <IoIosArrowDown />
        </span>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full border border-gray-300 bg-white shadow-md rounded-b z-10">
          <div className="options-container max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`option p-2 cursor-pointer transition-colors ${hover} ${
                    disabledOptions &&
                    disabledOptions.includes(getOptionValue(option))
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() =>
                    !disabledOptions ||
                    !disabledOptions.includes(getOptionValue(option))
                      ? selectOption(
                          getOptionValue(option),
                          typeof option === "string" ? undefined : option.link
                        )
                      : null
                  }
                >
                  {getOptionLabel(option)}
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-gray-500">
                No result found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect3;
