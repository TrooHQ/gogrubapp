import React from "react";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  text: string;
  loading?: boolean;
}
const BackButton: React.FC<ButtonProps> = ({ text, loading }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(-1)} className=" ">
      <button
        className=" font-[500] text-[16px] text-purple500 cursor-pointer"
        disabled={loading}
      >
        {text}
      </button>
    </div>
  );
};

export default BackButton;
