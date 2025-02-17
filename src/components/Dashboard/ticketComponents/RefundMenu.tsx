import Modal from "../../Modal";
import CustomSelect from "../../inputFields/CustomSelect";

const RefundMenu = ({
  refundMenu,
  handleRefundMenu,
  refundType,
  setRefundType,
  setOpenInput,
  openInput,
  refundAmount,
  setRefundAmount,
  setRefundMenu,
}: any) => {
  return (
    <div>
      {" "}
      <Modal isOpen={refundMenu} onClose={handleRefundMenu}>
        <div
          className=" py-[28px] 2xl:py-[36px] px-[28px] 2xl:px-[51px] bg-white relative rounded-[20px]  w-[539px] md:h-[600px] lg:h-screen overflow-y-scroll"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="">
            <p className="text-[24px] pb-[24px] font-[500] leading-[36px] text-purple500">
              Request Refund
            </p>
            <hr className="border border-[#E7E7E7] mb-[24px]" />

            <div>
              <div>
                <CustomSelect
                  label=""
                  options={["Full Refund", "Partial Refund"]}
                  value={refundType}
                  onChange={(value) => {
                    setRefundType(value);
                    setOpenInput(true);
                  }}
                  disabledOption="Choose refund type"
                />
                {refundType === "Partial Refund" && openInput && (
                  <div className="mt-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Enter Amount"
                        className="w-full pr-20 border rounded h-10 pl-2 outline-none"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                      />
                      <button
                        className="absolute top-0 right-0 h-full bg-[#5955b6] text-white px-4 rounded-r"
                        onClick={() => setOpenInput(false)}
                      >
                        Enter
                      </button>
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <label className="mb-2" htmlFor="reason">
                    Reason for refund
                  </label>
                  <textarea
                    name="reason"
                    id="reason"
                    className="w-full pr-20 border rounded pl-2 outline-none mt-2"
                    rows={4}
                  ></textarea>
                </div>
              </div>
              <hr className="border border-[#E7E7E7] mb-[24px] mt-3" />

              <div className="flex items-center justify-end gap-4 mt-5">
                <div
                  className="border cursor-pointer border-purple500 rounded px-[24px]  py-[10px] font-[600] text-purple500"
                  onClick={() => {
                    setRefundMenu(false);
                    setOpenInput(false);
                    setRefundType("");
                  }}
                >
                  <p className="font-[500] text-[16px] text-purple500 cursor-pointer">Cancel</p>
                </div>

                <div className="border border-purple500 bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-[#ffffff]">
                  <button className=" text-[16px] font-normal">Make Refund</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RefundMenu;
