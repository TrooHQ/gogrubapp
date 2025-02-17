import React, { useState } from "react";
import CustomSelect3 from "../inputFields/CustomSelect3";
import ProcessedIcon from "../assets/Processed.svg";
import AcceptedIcon from "../assets/Accepted.svg";
import CancelledIcon from "../assets/order 4.svg";
import TotalIcon from "../assets/Total.svg";
interface TabItem {
  id: number;
  label: string;
  content: JSX.Element;
}

const ReportTab: React.FC = () => {
  const tabItems: TabItem[] = [
    { id: 1, label: "Orders", content: renderOrderReporting() },
    { id: 2, label: "Income", content: renderIncomeReporting() },
  ];

  const [activeTab, setActiveTab] = useState<number>(1);

  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
  };

  function renderOrderReporting() {
    return (
      <div className=" grid gap-[8px]">
        <div className=" rounded-[10px] px-[16px] py-[20px] border-b grid gap-[17px] bg-[#EEEEF7]">
          <div className=" flex items-start gap-[9px]">
            <img src={TotalIcon} alt="" />
            <div className="">
              <p className=" text-[16px] text-[#414141]">Total Orders</p>
              <p className=" text-grey500 text-[28px]">150 orders</p>
            </div>
          </div>
        </div>
        <div className=" rounded-[10px] px-[16px] py-[20px] border-b grid gap-[17px] bg-[#F6EEE7]">
          <div className=" flex items-start gap-[9px]">
            <img src={AcceptedIcon} alt="" />
            <div className="">
              <p className=" text-[16px] text-[#414141]">Accepted Orders</p>
              <p className=" text-grey500 text-[28px]">150 orders</p>
            </div>
          </div>
        </div>
        <div className=" rounded-[10px] px-[16px] py-[20px] border-b grid gap-[17px] bg-[#E9F8E9]">
          <div className=" flex items-start gap-[9px]">
            <img src={ProcessedIcon} alt="" />
            <div className="">
              <p className=" text-[16px] text-[#414141]">Fulfilled Orders</p>
              <p className=" text-grey500 text-[28px]">127 orders</p>
            </div>
          </div>
        </div>
        <div className=" rounded-[10px] px-[16px] py-[20px] border-b grid gap-[17px] bg-[#FFD9D9]">
          <div className=" flex items-start gap-[9px]">
            <img src={CancelledIcon} alt="" />
            <div className="">
              <p className=" text-[16px] text-[#414141]">Canceled Orders</p>
              <p className=" text-grey500 text-[28px]">50 orders</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderIncomeReporting() {
    return (
      <>
        <div className=" rounded-[10px] px-[1px] py-[16px] border-b grid gap-[17px]">
          <p className=" text-[16px] text-[#414141]">Total Daily Income</p>
          <p className=" text-grey500 text-[28px]">N 85,000</p>
        </div>
        <div className=" rounded-[10px] px-[1px] py-[16px] border-b grid gap-[17px]">
          <p className=" text-[16px] text-[#414141]">Total Weekly Income</p>
          <p className=" text-grey500 text-[28px]">N 85,000</p>
        </div>
        <div className=" rounded-[10px] px-[1px] py-[16px] border-b grid gap-[17px]">
          <p className=" text-[16px] text-[#414141]">Total Monthly Income</p>
          <p className=" text-grey500 text-[28px]">N 85,000</p>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 mb-4 border-b relative">
        {tabItems.map((tab) => (
          <div
            key={tab.id}
            className={`cursor-pointer text-[16px] leading-[24px] py-4 px-[1px]`}
            onClick={() => handleTabChange(tab.id)}
          >
            <p
              className={`inline text-[16px] leading-[24px] py-[4px] px-[1px] ${
                activeTab === tab.id
                  ? "font-[600] text-grey500 border-b-4 border-[#E16B07] "
                  : "text-[#929292] font-[400]"
              }`}
            >
              {tab.label}
            </p>
          </div>
        ))}
        {activeTab === 1 && (
          <div className=" absolute bottom-0 right-0 mb-1 px-[5px]">
            <CustomSelect3
              options={["Daily", "Weekly", "Monthly", "Today"]}
              placeholder="Sort Orders"
            />
          </div>
        )}
      </div>

      <div>
        {tabItems.map(
          (tab) => activeTab === tab.id && <div key={tab.id}>{tab.content}</div>
        )}
      </div>
    </div>
  );
};

export default ReportTab;
