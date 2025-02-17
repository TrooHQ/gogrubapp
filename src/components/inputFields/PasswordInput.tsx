import React, { useState, useRef, useEffect, CSSProperties } from "react";
import EyeOpen from "../../assets/eyeOpen.png";
import EyeClose from "../../assets/eyeClose.png";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  style?: CSSProperties;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, value, onChange, error, style }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Check for pre-filled value and move the label if value is present
  useEffect(() => {
    if (value !== "") {
      setIsFocused(true);
    }
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={style}>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={`border-2 outline-grey200 p-2 text-grey500 text-[16px] focus:outline-purple500 focus:border-none w-full rounded ${
            error ? "border-red-500" : ""
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputRef}
        />
        <label
          className={`absolute transition-all duration-300 cursor-text ${
            isFocused
              ? "text-[14px] -top-3 left-2 bg-white px-2 text-[#000000]"
              : "top-2 left-4 text-grey200"
          } ${error ? "text-red-500" : ""}`}
          onClick={handleLabelClick}
        >
          {label}
        </label>

        <div className="absolute top-2 right-2 cursor-pointer" onClick={togglePasswordVisibility}>
          {showPassword ? (
            <img src={EyeOpen} alt="show password" className="text-gray-400" />
          ) : (
            <img src={EyeClose} alt="hide password" className="text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
