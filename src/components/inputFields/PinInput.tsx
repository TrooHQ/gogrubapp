import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Icons for show/hide

interface PinInputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  maxLength?: number; // Allows setting the length of the PIN (e.g., 4-digit)
}

const PinInput: React.FC<PinInputProps> = ({ label, value, onChange, maxLength = 4 }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPin, setShowPin] = useState(false); // State to toggle show/hide pin

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Allow only numeric input and restrict length based on maxLength
    if (/^\d*$/.test(value) && value.length <= maxLength) {
      onChange(value);
    }
  };

  const toggleShowPin = () => {
    setShowPin((prevShowPin) => !prevShowPin);
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-gray-600 font-semibold text-sm">{label}</label>
      <div className="relative">
        <input
          type={showPin ? "text" : "password"} // Toggle between text and password types
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          className={`w-full px-4 py-2 border rounded-md outline-none transition-all ${
            isFocused ? "border-purple500" : "border-gray-300"
          }`}
          placeholder="●●●●" // This placeholder mimics PIN dots for clarity
        />
        {/* Toggle Icon for Show/Hide */}
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
          onClick={toggleShowPin}
        >
          {showPin ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
        </span>
      </div>
    </div>
  );
};

export default PinInput;
