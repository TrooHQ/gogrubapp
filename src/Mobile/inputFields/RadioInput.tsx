import React from "react";

interface RadioInputProps {
  options: string[];
  selectedOption?: string | null;
  onChange: (value: string) => void;
  className?: string;
}

const RadioInput: React.FC<RadioInputProps> = ({
  options,
  selectedOption,
  onChange,
  className = "",
}) => {
  return (
    <div className={`gap-[32px] ${className}`}>
      {options.map((option, index) => (
        <div key={index} className="flex items-center">
          <input
            type="radio"
            id={option}
            name="radio-option"
            value={option}
            checked={selectedOption === option}
            onChange={() => onChange(option)}
            className="mr-2"
          />
          <label
            htmlFor={option}
            className="text-grey500 font-[400] text-[14px] cursor-pointer capitalize"
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioInput;
