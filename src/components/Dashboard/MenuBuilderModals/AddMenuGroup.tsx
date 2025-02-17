import React from "react";
import CustomInput from "../../inputFields/CustomInput";

interface Props {
  setAddMenuGroup: React.Dispatch<React.SetStateAction<boolean>>;
  groupName: string;
  handleGroupName: (newValue: string) => void;
  applyPriceToAll: boolean;
  handleOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  price: string;
  handlePrice: (newValue: string) => void;
  handleSaveMenuGroup: () => void;
  menuGroupLoading: boolean;
}

const AddMenuGroup: React.FC<Props> = ({
  setAddMenuGroup,
  groupName,
  handleGroupName,
  applyPriceToAll,
  handleOptionChange,
  price,
  handlePrice,
  handleSaveMenuGroup,
  menuGroupLoading,
}) => {
  return (
    <div
      className=" py-[28px] 2xl:py-[36px] px-[28px] 2xl:px-[51px] bg-white relative rounded-[20px]  w-[539px] md:h-[600px] lg:h-screen overflow-y-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className=" ">
        <p className="text-[24px] pb-[24px] font-[500] leading-[36px] text-purple500">
          Add menu group
        </p>
        <hr className="border border-[#E7E7E7] mb-[24px]" />

        <div className=" lg:mb-[24px]">
          <div className=" grid gap-[32px] lg:gap-[32px] text-[16px] font-[400] text-grey200">
            <CustomInput
              type="text"
              label="Enter group name"
              value={groupName}
              error=""
              onChange={(newValue) => handleGroupName(newValue)}
            />

            {/* <CustomSelect2
                      options={["Channel1", "Channel2", "Channel3"]}
                      placeholder="Channels"
                    /> */}

            <div className="">
              <p className=" text-[18px] mb-[8px] font-[500] text-grey500">Pricing</p>
              <p className=" text-[14px] font-[400] text-grey500">
                Do you want this price to apply to all the items in this menu group?
              </p>
              <div className="flex items-center mt-[8px]">
                <input
                  type="radio"
                  id="yes"
                  name="options"
                  value="yes"
                  checked={applyPriceToAll === true}
                  onChange={handleOptionChange}
                  className={`mr-2 ${applyPriceToAll === true ? "bg-purple500" : ""}`}
                />
                <label htmlFor="yes" className="mr-4  text-grey500 text-[16px] font-[400]">
                  Yes
                </label>

                <input
                  type="radio"
                  id="no"
                  name="options"
                  value="no"
                  checked={applyPriceToAll === false}
                  onChange={handleOptionChange}
                  className={`mr-2 ${applyPriceToAll === false ? "bg-purple500" : ""}`}
                />
                <label htmlFor="no" className=" text-grey500 text-[16px] font-[400]">
                  No
                </label>
              </div>
            </div>

            {applyPriceToAll && (
              <CustomInput
                type="text"
                label="Enter price"
                value={price}
                error=""
                onChange={(newValue) => handlePrice(newValue)}
              />
            )}
          </div>
        </div>

        <div className=" flex justify-end items-center pt-[12px] lg:pt-[24px] gap-2">
          <div
            className="border cursor-pointer border-purple500 rounded px-[24px]  py-[10px] font-[600] text-purple500"
            onClick={() => setAddMenuGroup(false)}
          >
            <p className="font-[500] text-[16px] text-purple500 cursor-pointer">Cancel</p>
            {/* <CancelButton text="Cancel" /> */}
          </div>

          <div
            className="border border-purple500 bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-[#ffffff]"
            onClick={handleSaveMenuGroup}
          >
            <button className=" text-[16px]">{menuGroupLoading ? "Saving..." : "Save Menu"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuGroup;
