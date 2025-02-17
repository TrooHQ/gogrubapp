import { RootState } from "../../store/store";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

interface CustomInputProps {
  label: string;
  type: string;
  value: string;
  error?: string | undefined;
  maxLength?: number;
  onChange: (value: string) => void;
  textSize?: string;
  labelSize?: string;
  showLabel?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type,
  value,
  error,
  maxLength,
  onChange,
  textSize,
  labelSize,
  showLabel = false,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const businessDetails = useSelector(
    (state: RootState) => state.business?.businessDetails
  );

  const color = businessDetails?.colour_scheme || "#FF0000";

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(value !== "" || isFocused);
  };

  const handleLabelClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <div className="relative">
        <input
          type={type}
          className={`border bg-transparent border-grey200 p-2 text-grey500 focus:outline-none w-full rounded ${
            textSize ? textSize : "text-[16px]"
          } ${error ? "border-red-500" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          ref={inputRef}
          placeholder={!showLabel ? label : ""}
          style={{
            borderColor: error ? "#FF0000" : undefined,
            outlineColor: color,
          }}
        />
        {showLabel && (
          <label
            className={`absolute transition-all duration-300 cursor-text ${
              labelSize ? labelSize : "text-[14px]"
            } ${
              isFocused
                ? `-top-3 left-2 px-2`
                : "top-2 left-4 text-grey200 text-[14px]"
            } ${error ? "text-red-500" : ""}`}
            onClick={handleLabelClick}
            style={{
              backgroundColor: isFocused ? "#EFEFEF" : "transparent",
              color: isFocused ? "#000000" : color,
            }}
          >
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
