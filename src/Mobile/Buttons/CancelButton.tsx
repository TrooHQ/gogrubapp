import React from "react";

interface ButtonProps {
  text: string;
}

const CancelButton: React.FC<ButtonProps> = ({ text }) => {
  return (
    <div>
      <p className="font-[500] text-[16px] text-purple500 cursor-pointer">
        {text}
      </p>
    </div>
  );
};

export default CancelButton;
