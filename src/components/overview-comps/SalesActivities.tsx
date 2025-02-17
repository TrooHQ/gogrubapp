import ArrowDown from "../../assets/ArrowDown.svg";
import ArrowUp from "../../assets/ArrowUp.svg";
import ArrowNeutral from "../../assets/activeArrow.svg";
import clsx from "clsx";
import styles from "./Header.module.css";
import { fetchSalesGrowthRate } from "../../slices/overviewSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
// import { ArrowDownward, ArrowUpward, Remove } from "@mui/icons-material";

const SalesActivities = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { salesGrowthRate, totalSales, averageOrderValue } = useSelector(
    (state: RootState) => state.overview
  );

  useEffect(() => {
    dispatch(fetchSalesGrowthRate());
    // dispatch(fetchTotalSales({ date_filter: "today" }));
  }, [dispatch]);
  console.log(salesGrowthRate, "salesGrowthRate");

  // Assuming salesGrowthRate.data is available
  const salesGrowthRateData = salesGrowthRate?.data || {
    salesGrowthRate: "0.00",
    getTotalSalesToday: 0,
    prevDayTotalSales: 0,
  };

  const { getTotalSalesToday, prevDayTotalSales } = salesGrowthRateData;

  let status = "No change from yesterday";
  let statusIcon = ArrowNeutral;
  let percentageChange = 0;

  if (prevDayTotalSales !== 0) {
    percentageChange = ((getTotalSalesToday - prevDayTotalSales) / prevDayTotalSales) * 100;
    if (percentageChange > 0) {
      status = `${percentageChange.toFixed(2)}% up from yesterday`;
      statusIcon = ArrowUp;
    } else if (percentageChange < 0) {
      status = `${Math.abs(percentageChange).toFixed(2)}% down from yesterday`;
      statusIcon = ArrowDown;
    }
  }

  const state = {
    salesActivities: [
      {
        icon: ArrowDown,
        title: "Total Sales Revenue",
        time: "12:45 PM",
        amount: `₦ ${totalSales?.data?.toLocaleString("en-US") || 0}`,
        statusIcon: ArrowDown,
        status: "-25% from yesterday",
      },
      {
        icon: statusIcon,
        title: "Sales Growth Rate",
        time: "12:45 PM",
        amount: `${salesGrowthRate?.data?.salesGrowthRate?.toLocaleString("en-US") || 0}%`,
        statusIcon: statusIcon,
        status: status,
      },
      {
        icon: ArrowUp,
        title: "Average Order Value",
        time: "12:45 PM",
        amount: `₦ ${averageOrderValue?.data?.averageOrderValue?.toLocaleString("en-US") || 0}`,
        statusIcon: ArrowUp,
        status: "10% from yesterday",
      },
      // {
      //   icon: ArrowDown,
      //   title: "Gross Profit",
      //   time: "12:45 PM",
      //   amount: "₦ 8,250,000",
      //   statusIcon: ArrowDown,
      //   status: "10% from yesterday",
      // },
    ],
  };
  return (
    <div className="border border-[#C7C6CF] p-6 rounded-2xl mb-12">
      <div className={clsx("flex justify-between items-center w-full mb-9")}>
        <h5 className={clsx(styles.salesActivitiesH4)}>Sales Activities</h5>
        {/* <DaysTab2
          backgroundColor="initial"
          selectedBackgroundColor="#f38d41"
          selectedColor="white"
          nonSelectedColor="#606060"
          iconClassName={clsx("text-[#ADADB9]")}
          border="1px solid var(--Kanta-Neutral-200, #C7C6CF)"
        /> */}
      </div>{" "}
      <div className="grid grid-cols-4 gap-6">
        {state.salesActivities.map((activity, index) => (
          <div
            key={index}
            className={clsx(
              styles.activityDiv,
              "flex flex-col items-start justify-center border border-[#C7C6CF] rounded-[10px] overflow-auto py-4 px-3 gap-3"
            )}
          >
            <h5>{activity.title}</h5>
            <span>{activity.amount}</span>
            <div className="flex items-center justify-start gap-2">
              <img src={activity.icon} alt="icon" />
              <p>{activity.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesActivities;
