import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";
import Print from "../../assets/print.svg";
import edit from "../../assets/edit.png";
import download from "../../assets/download.png";

import Publish from "../../assets/publish.svg";
const MenuHome = () => {
  return (
    <div>
      <DashboardLayout>
        <TopMenuNav pathName="Menu" />
        <div className="">
          <div className="mt-[40px]">
            <div className="flex items-center justify-between">
              <div className="border border-purple500 bg-purple500 w-[196px] rounded-[5px] px-[24px] py-[10px] font-[500] text-[#ffffff]">
                <button className="text-[16px] flex items-center gap-[8px]">
                  <img src={Print} alt="" /> Print menu list
                </button>
              </div>
              <div className="rounded-[5px] px-[24px] py-[10px] font-[500] text-purple500">
                <button className="text-[14px] flex items-center gap-[8px]">
                  <img src={Publish} alt="" /> Publish changes
                </button>
              </div>
            </div>

            <div className=" mt-[32px] grid grid-cols-6 items-center border-b px-5 border-b-grey100 text-grey300 text-[16px] font-[400]">
              <p className="col-span-2 px-3 py-2">Menu Group</p>
              <p className=" col-span-2 px-3 py-2">Menu Items</p>
              <p className="  px-3 py-2 ">Price</p>
              <p className="  px-3 py-2 text-end">Actions </p>
            </div>
            <div className=" grid mt-[16px] gap-[8px]">
              <div className=" grid grid-cols-6 items-center px-5 py-4 font-[500] bg-[#F8F8F8] text-[16px] text-grey500  ">
                <div className="col-span-2 px-3 py-2 flex items-center gap-[16px]">
                  <p className=" text-[#5855B3]"> Coffee</p>
                </div>
                <p className="col-span-2 px-3 py-2 text-[#5855B3]">
                  Cappuccino
                </p>
                <p className=" px-3 py-2 ">N1800 - N2000 </p>
                <p className=" flex items-center justify-end gap-[16px]">
                  <img src={edit} alt="" />
                  <img src={download} alt="" />
                </p>
              </div>
              <div className=" grid grid-cols-6 items-center px-5 py-4 font-[500] bg-[#ffffff] text-[16px] text-grey500  ">
                <div className="col-span-2 px-3 py-2 flex items-center gap-[16px]">
                  <p className=" text-[#5855B3]"> Coffee</p>
                </div>
                <p className="col-span-2 px-3 py-2 text-[#5855B3]">
                  Cappuccino
                </p>
                <p className=" px-3 py-2 ">N1800 - N2000 </p>
                <p className=" flex items-center justify-end gap-[16px]">
                  <img src={edit} alt="" />
                  <img src={download} alt="" />
                </p>
              </div>

              <div className=" grid grid-cols-6 items-center px-5 py-4 font-[500] bg-[#F8F8F8] text-[16px] text-grey500  ">
                <div className="col-span-2 px-3 py-2 flex items-center gap-[16px]">
                  <p className=" text-[#5855B3]"> Coffee</p>
                </div>
                <p className="col-span-2 px-3 py-2 text-[#5855B3]">
                  Cappuccino
                </p>
                <p className=" px-3 py-2 ">N1800 - N2000 </p>
                <p className=" flex items-center justify-end gap-[16px]">
                  <img src={edit} alt="" />
                  <img src={download} alt="" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default MenuHome;
