import React from "react";
import Close from "../../../assets/closeIcon.svg";
import CheckCircle from "../../../assets/check_circle.svg";

interface Props {
  setSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessModal: React.FC<Props> = ({ setSuccessModal }) => {
  return (
    <div className=" w-[443px] px-[32px] py-[32px]">
      <div
        className="flex items-center justify-end cursor-pointer"
        onClick={() => setSuccessModal(false)}
      >
        <img src={Close} alt="" className=" " />
      </div>
      <div className=" flex flex-col gap-[24px] items-center justify-center">
        <img src={CheckCircle} alt="" />
        <p className="text-grey500 text-[22px] font-[500]">Changes Saved!</p>
        <p className="text-[16px] font-[400] text-grey500">
          Changes have been saved successfully
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
