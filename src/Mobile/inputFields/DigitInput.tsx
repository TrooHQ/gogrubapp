import React from "react";

interface DigitInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const DigitInput: React.FC<DigitInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "");
    onChange(newValue);
  };

  return (
    <input
      type="text"
      maxLength={1}
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className="w-10 h-10 text-center border rounded-md border-gray-300 focus:border-blue-500 focus:outline-none"
    />
  );
};

export default DigitInput;
