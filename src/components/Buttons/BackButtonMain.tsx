import React from "react";
import { useNavigate } from "react-router-dom";
interface ButtonProps {
  text: string;
}
const BackButtonMain: React.FC<ButtonProps> = ({ text }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(-1)}>
      <p className=" font-[500] text-[16px] text-purple500 cursor-pointer">
        {text}
      </p>
    </div>
  );
};

export default BackButtonMain;
