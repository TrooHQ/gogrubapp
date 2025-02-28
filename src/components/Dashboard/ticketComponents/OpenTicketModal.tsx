import Modal from "../../Modal";
import ArrowLeft from "../../../assets/arrowLeftSmall.svg";
import CreditCard from "../../../assets/creditCard.svg";
import { RestartAlt } from "@mui/icons-material";

const OpenTicketModal = ({
  openTicket,
  handleTicketMenu,
  setOpenTicket,
  data,
}: any) => {
  return (
    <div>
      <Modal isOpen={openTicket} onClose={handleTicketMenu}>
        <div className=" py-[28px] 2xl:py-[36px] px-[28px] 2xl:px-[51px] bg-white relative rounded-[20px]  w-[80vw] ">
          <div
            className="flex items-center justify-start gap-2 cursor-pointer"
            onClick={() => setOpenTicket(false)}
          >
            <img src={ArrowLeft} alt="" className=" " />
            <span className="text-base font-normal text-grey300">
              Back to ticket
            </span>
          </div>
          <div className="flex flex-col gap-8 mt-12">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-grey500 text-[32px] font-medium">
                  Table 2
                </h2>
                <p className="text-grey300 text-[16px] font-normal">
                  Ticket #234, 10:35, 10/09/2023
                </p>
              </div>
              <div className="flex justify-end items-center gap-10">
                <div>
                  <h2 className="text-[#dc3232] text-[32px] font-medium">
                    #1,800
                  </h2>
                  <p className="text-[#dc3232] text-[16px] font-normal">
                    Left to pay
                  </p>
                </div>
                <div>
                  <h2 className="text-purple500 text-[32px] font-medium">
                    #14,500
                  </h2>
                  <p className="text-grey300 text-[16px] font-normal">
                    Total order
                  </p>
                </div>
              </div>
            </div>
            {/* Tables */}
            <div className="pb-[16px] pt-0 border rounded-[10px] border-grey100 mt-[24px]">
              {" "}
              <div className=" text-center pb-[16px] mb-[16px] pt-[24px] px-[32px] grid grid-cols-6 border-b">
                <p className=" text-[14px] text-grey500">Time</p>
                <p className=" text-[14px] text-grey500">Tip</p>
                <p className="text-start text-[14px] text-grey500">Method</p>
                <p className=" text-[14px] text-grey500">Status </p>
                <p className=" text-[14px] text-grey500">Total </p>
                <p className=" text-[14px] text-grey500"></p>
              </div>
              {data.slice(0, 3).map((item: any, index: any) => (
                <div
                  className={`text-center py-[14px] px-[32px] grid grid-cols-6 items-center font-[500] text-[14px] text-[#414141] ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F8F8F8]"
                  }`}
                  key={index}
                  onClick={handleTicketMenu}
                >
                  {/* <p className="items-center">{item.date.split("-")[1]}</p> */}
                  <p>&#x20A6;{item.tip}</p>
                  <div className="flex items-center gap-2 justify-start">
                    <img
                      src={CreditCard}
                      alt="credit"
                      className="w-[16px] h-[16px]"
                    />
                    <span className="text-start">{item.method}</span>
                  </div>

                  <p></p>

                  <p>&#x20A6;{item.amount}</p>
                  <div className="flex items-center justify-end">
                    <button className="flex items-center justify-center py-[6px] px-[10px] bg-[#e27da2] text-[12px] font-[500] text-white rounded-[5px] w-[60%]">
                      <RestartAlt className="w-[20px] h-[20px]" />
                      Refund
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-[22px] font-medium text-grey500">
                Order details
              </h4>
              <div className="pb-[16px] pt-0 border rounded-[10px] border-grey100 mt-[12px]">
                {" "}
                <div className=" text-center pb-[16px] mb-[16px] pt-[24px] px-[32px] grid grid-cols-3 border-b">
                  <p className="text-start text-[14px] text-grey500">Item</p>
                  <p className="text-end text-[14px] text-grey500">Price</p>
                  <p className=" text-[14px] text-grey500"></p>
                </div>
                {data.slice(0, 3).map((item: any, index: any) => (
                  <div
                    className={`text-center py-[14px] px-[32px] grid grid-cols-3 items-center font-[500] text-[14px] text-[#414141] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#F8F8F8]"
                    }`}
                    key={index}
                  >
                    <p className="text-start">
                      {index % 3 === 0
                        ? "Pizza"
                        : index % 3 === 1
                        ? "Cappuccino"
                        : "Waffles"}
                    </p>
                    <p className="text-end">&#x20A6;{item.amount}</p>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={handleTicketMenu}
                        className="flex items-center justify-center py-[6px] px-[10px] bg-[#e27da2] text-[12px] font-[500] text-white rounded-[5px] w-[32%]"
                      >
                        <RestartAlt className="w-[20px] h-[20px]" />
                        Refund
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OpenTicketModal;
