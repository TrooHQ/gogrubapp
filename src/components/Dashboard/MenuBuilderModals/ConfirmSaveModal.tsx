import React from "react";
import Close from "../../../assets/closeIcon.svg";

interface Props {
  handleSuccessModal: () => void;
  setSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmSaveModal: React.FC<Props> = ({ handleSuccessModal, setSuccessModal }) => {
  return (
    <div className=" w-[443px] px-[32px] py-[32px]">
      <div
        className="flex items-center justify-end cursor-pointer"
        onClick={() => setSuccessModal(false)}
      >
        <img src={Close} alt="" className=" " />
      </div>
      <div className=" flex flex-col gap-[24px] items-center justify-center">
        <p className="text-grey500 text-[22px] font-[500]">Save changes</p>
        <p className="text-[16px] font-[400] text-grey500">
          Do you want to save changes made to this menu?
        </p>
        <div
          className="border border-purple500 bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-[#ffffff]"
          onClick={handleSuccessModal}
        >
          <button className=" text-[16px]">Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSaveModal;
