import React, { useRef } from "react";

interface CustomSelectProps {
  label: string;
  options: string[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabledOption?: string;
  bgColor?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  error,
  onChange,
  disabledOption,
  bgColor,
}) => {
  const selectRef = useRef<HTMLSelectElement | null>(null);

  return (
    <div>
      <div className="relative">
        <select
          className={`border-2 border-gray-300 p-2 focus:outline-[#5955B3] w-full rounded ${
            bgColor ? bgColor : "bg-white"
          } ${error ? "border-red-500" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={selectRef}
        >
          {disabledOption && (
            <option value="" disabled>
              {disabledOption}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option} className=" ">
              {option}
            </option>
          ))}
        </select>
        <label
          className={`absolute transition-all duration-300 cursor-text ${
            value !== ""
              ? "text-[14px] -top-3 left-2 px-2 text-[#000000]"
              : "top-2 left-4 text-gray-400"
          } ${error ? "text-red-500" : ""}`}
          onClick={() => selectRef.current?.focus()}
          style={{ backgroundColor: bgColor }}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default CustomSelect;
