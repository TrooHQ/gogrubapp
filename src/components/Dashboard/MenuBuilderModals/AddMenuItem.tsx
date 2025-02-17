import React from "react";
import CustomInput from "../../inputFields/CustomInput";
import imageIcon from "../../../assets/image.svg";

interface Props {
  setAddMenuItem: React.Dispatch<React.SetStateAction<boolean>>;
  menuName: string;
  handleMenuName: (newValue: string) => void;
  menuDescription: string;
  handleMenuDescription: (newValue: string) => void;
  menuPrice: string;
  handleMenuPrice: (newValue: string) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  image: string | null;
  imageName: string;
  handleSaveMenuItem: () => void;
  menuGroupLoading: boolean;
}

const AddMenuItem: React.FC<Props> = ({
  setAddMenuItem,
  menuName,
  handleMenuName,
  menuDescription,
  handleMenuDescription,
  menuPrice,
  handleMenuPrice,
  handleFileChange,
  image,
  imageName,
  handleSaveMenuItem,
  menuGroupLoading,
}) => {
  return (
    <div
      className=" py-[28px] 2xl:py-[36px] px-[28px] 2xl:px-[51px] bg-white relative rounded-[20px]  w-[539px] md:h-[600px] lg:h-screen overflow-y-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className=" ">
        <p className="text-[24px] pb-[24px] font-[500] leading-[36px] text-purple500">
          Add menu Item
        </p>
        <hr className="border border-[#E7E7E7] mb-[24px]" />

        <div className=" lg:mb-[24px]">
          <div className=" grid gap-[32px] lg:gap-[32px] text-[16px] font-[400] text-grey200">
            <CustomInput
              type="text"
              label="Enter menu item name"
              value={menuName}
              error=""
              onChange={(newValue) => handleMenuName(newValue)}
            />
            <div className="">
              <textarea
                className=" w-full h-[153px] border text-[16px] font-[400] text-[#929292] border-gray-300 rounded-md p-2 outline-none"
                value={menuDescription}
                placeholder="Enter description of the menu item"
                onChange={(e) => handleMenuDescription(e.target.value)}
              />
            </div>

            <div className="">
              <p className="text-[18px] mb-[8px] font-[500] text-grey500">Pricing</p>

              <CustomInput
                type="text"
                label="Enter price"
                value={menuPrice}
                error=""
                onChange={(newValue) => handleMenuPrice(newValue)}
              />
            </div>

            <div className="">
              <p className=" text-[18px] mb-[8px] font-[500] text-grey500">Add image</p>

              <div className="flex items-center gap-[16px]">
                <label
                  htmlFor="fileInput"
                  className="w-[72px] border border-dashed p-[20px] border-[#5855B3] cursor-pointer"
                >
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <img src={imageIcon} alt="Upload Icon" />
                </label>
                <div className="">
                  <label
                    htmlFor="fileInput"
                    className="text-[#5855B3] font-[500] text-[16px] mb-[8px] cursor-pointer"
                  >
                    Click to upload{" "}
                    <span className=" font-[400] text-grey300">or drag and drop</span>
                  </label>
                  <p className=" text-[14px] font-[400] text-grey300">Max. file size: 2MB</p>
                </div>
              </div>
              {image && (
                <div className="mt-4">
                  <p className="text-[14px] text-grey500">Image: {imageName}</p>
                  <img src={image} alt="Uploaded Preview" className="mt-2 w-full h-auto" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" flex justify-end items-center pt-[12px] lg:pt-[24px] gap-2">
          <div
            className="border cursor-pointer border-purple500 rounded px-[24px]  py-[10px] font-[600] text-purple500"
            onClick={() => setAddMenuItem(false)}
          >
            <p className="font-[500] text-[16px] text-purple500 cursor-pointer">Cancel</p>
            {/* <CancelButton text="Cancel" /> */}
          </div>

          <div className="border border-purple500 bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-[#ffffff]">
            <button onClick={handleSaveMenuItem} className=" text-[16px]">
              {menuGroupLoading ? "Saving..." : "Save Menu Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItem;
