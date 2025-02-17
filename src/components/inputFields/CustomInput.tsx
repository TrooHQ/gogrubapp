import React, { useState, useRef, useEffect, ChangeEvent } from "react";

interface CustomInputProps {
  label: string;
  type: string;
  value: string | number;
  error?: string;
  maxLength?: number;
  onChange: (value: string) => void;
  className?: string; // Optional className prop
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type,
  value,
  error,
  maxLength,
  onChange,
  className, // Destructure className prop
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Update isFocused based on the value to ensure the label position is correct
    setIsFocused(value !== "");
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(value !== "");
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
          className={`border outline-grey200 p-2 text-grey500 text-[16px] focus:outline-purple500 focus:border-none w-full rounded ${
            error ? "border-red-500" : ""
          } ${className}`} // Apply className prop
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          ref={inputRef}
        />
        <label
          className={`absolute transition-all duration-300 cursor-text ${
            isFocused
              ? "text-[14px] -top-3 left-2 bg-white px-2 text-[#000000]"
              : "top-2 left-4 bg-white text-grey200"
          } ${error ? "text-red-500" : ""}`}
          onClick={handleLabelClick}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default CustomInput;
