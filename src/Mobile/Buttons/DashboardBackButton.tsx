import React from "react";
import { useNavigate } from "react-router-dom";
interface ButtonProps {
  text: string;
  img?: string;
}
const DashboardBackButton: React.FC<ButtonProps> = ({ text, img }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(-1)}
      className=" inline-flex items-center gap-[20px] cursor-pointer"
    >
      <img src={img} alt="" />
      <p className=" font-[500] text-[20px] text-grey500 cursor-pointer">
        {text}
      </p>
    </div>
  );
};

export default DashboardBackButton;
