import Modal from "../../Modal";
import Close from "../../../assets/closeIcon.svg";

const VacateTableModal = ({ vacateTableMenu, handleVacateTableMenu, setVacateTableMenu }: any) => {
  return (
    <div>
      <Modal isOpen={vacateTableMenu} onClose={handleVacateTableMenu}>
        <div className=" py-[28px] 2xl:py-[36px] px-[28px] 2xl:px-[51px] bg-white relative rounded-[20px]  w-[539px]">
          <div
            className="flex items-center justify-end cursor-pointer"
            onClick={() => setVacateTableMenu(false)}
          >
            <img src={Close} alt="" className=" " />
          </div>
          <div className="flex flex-col justify-center items-center gap-6">
            <p className="text-[24px] font-[500] text-purple500">Vacate Table</p>

            <div>
              <p className="text-[16px] font-[400] text-grey500">
                Table has been vacated successfully!
              </p>
              <div className="flex items-center justify-center gap-4 mt-5">
                <div
                  className="border border-purple500 bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-[#ffffff]"
                  onClick={() => setVacateTableMenu(false)}
                >
                  <button className=" text-[16px]">Continue</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VacateTableModal;
