import React, { useState } from "react";
import clsx from "clsx";
import styles from "./Header.module.css";
import {
  ArrowForwardIos,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import DaysTab from "./DaysTab";
// import SalesActivities from "./home/SalesActivities";
// import SalesRevenue from "./home/SalesRevenue";
// import KPI from "./home/KPI";

interface HeaderProps {
  storeData: any;
}
const Header: React.FC<HeaderProps> = ({ storeData }) => {
  const [showBalance, setShowBalance] = useState(true);

  const changeVisibility = () => {
    setShowBalance(!showBalance);
  };
  return (
    <div>
      <h1 className={clsx(styles.headerH1)}>
        Hello, <span className={clsx(styles.headerSpan)}>{storeData.name}</span>
      </h1>

      <div className={clsx(styles.balance, "mt-4 mb-[40px]")}>
        <div className={clsx("flex justify-between items-center w-full")}>
          <h5 className={clsx(styles.amount)}>Total Transactions</h5>
          <DaysTab
            backgroundColor="#38373F"
            selectedBackgroundColor="#11AE16"
            selectedColor="white"
            nonSelectedColor="#C7C6CF"
            iconClassName={clsx("text-white")}
          />
        </div>
        <div className="flex justify-start gap-10 items-center w-full mb-[55px]">
          <h2 className={clsx(styles.figure)}>
            {showBalance ? storeData.availableBalance : "****"}
          </h2>
          {!showBalance ? (
            <Visibility
              className="cursor-pointer w-[32px] h-[32px]"
              onClick={changeVisibility}
            />
          ) : (
            <VisibilityOff
              className="cursor-pointer w-[32px] h-[32px]"
              onClick={changeVisibility}
            />
          )}
        </div>
        <div className="text-[#B2B1DC] flex items-center justify-start gap-2">
          <h6 className={clsx(styles.manage)}>Manage Account</h6>
          <ArrowForwardIos className="text-[16px]" />
        </div>
      </div>

      {/* <SalesActivities />
      <SalesRevenue /> */}
      {/* <h6 className="text-[#201f44] text-xl font-medium mb-[35px]">
        Key Performing Inventories
      </h6> */}
      {/* <KPI /> */}
    </div>
  );
};

export default Header;
