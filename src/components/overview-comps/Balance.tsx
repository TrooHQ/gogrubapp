import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Header.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import confirmation_number from "../../assets/confirmation_number.svg";
import restaurant_menu from "../../assets/restaurant_menu.svg";
import DaysTab2 from "./DaysTab2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  fetchOpenAndClosedTickets,
  fetchTotalSales,
  fetchAverageOrderValue,
  fetchTopMenuItems,
} from "../../slices/overviewSlice";

const BalanceComp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showBalance, setShowBalance] = useState(true);
  const { openAndClosedTickets, loading, totalSales, averageOrderValue } =
    useSelector((state: RootState) => state.overview);
  const { selectedBranch } = useSelector((state: any) => state.branches);

  useEffect(() => {
    dispatch(fetchOpenAndClosedTickets({ date_filter: "today" }));
    dispatch(fetchTotalSales({ date_filter: "today" }));
    dispatch(fetchAverageOrderValue({ date_filter: "today" }));
    dispatch(
      fetchTopMenuItems({ branch_id: selectedBranch?.id, date_filter: "today" })
    );
  }, [dispatch]);

  const changeVisibility = () => {
    setShowBalance(!showBalance);
  };
  console.log(averageOrderValue?.data?.averageOrderValue);

  const handleDateFilterChange = (
    date_filter: string,
    startDate?: string,
    endDate?: string,
    number_of_days?: number
  ) => {
    dispatch(
      fetchOpenAndClosedTickets({
        date_filter,
        startDate,
        endDate,
        number_of_days,
      })
    );
    dispatch(
      fetchTotalSales({ date_filter, startDate, endDate, number_of_days })
    );
    dispatch(
      fetchAverageOrderValue({
        date_filter,
        startDate,
        endDate,
        number_of_days,
      })
    );
    dispatch(
      fetchTopMenuItems({
        branch_id: selectedBranch.id,
        date_filter,
        startDate,
        endDate,
        number_of_days,
      })
    );
  };

  const closedTickets = openAndClosedTickets?.data?.closed_tickets || 0;
  const processedOrders = openAndClosedTickets?.data?.open_tickets || 0;

  return (
    <div>
      <div className="rounded-[16px] bg-[#3e3e43] px-8 py-6">
        <div className="flex items-start justify-between">
          <h5 className="text-[#EEEEF7] text-lg font-light">Total Sales</h5>
          <DaysTab2
            backgroundColor="#606060"
            selectedBackgroundColor="#f38d41"
            selectedColor="white"
            nonSelectedColor="#C7C6CF"
            iconClassName={clsx("text-white")}
            onDateFilterChange={handleDateFilterChange}
          />
        </div>
        <div className="flex justify-start gap-10 items-center w-full mb-[55px]">
          <h2 className={clsx(styles.figure)}>
            {loading
              ? "..."
              : showBalance
              ? `₦ ${totalSales?.data?.toLocaleString("en-US")}`
              : "****"}
          </h2>
          {!showBalance ? (
            <Visibility
              className="cursor-pointer w-[32px] h-[32px] text-white"
              onClick={changeVisibility}
            />
          ) : (
            <VisibilityOff
              className="cursor-pointer w-[32px] h-[32px] text-white"
              onClick={changeVisibility}
            />
          )}
        </div>
        <div className="text-[#B2B1DC] flex items-center justify-start gap-5">
          <div className="flex items-center justify-start gap-1">
            <img src={restaurant_menu} alt="confirmation_number" />
            <h6 className={clsx(styles.manage)}>
              {" "}
              {loading ? "Loading..." : `${processedOrders} Open Orders`}
            </h6>
          </div>
          <div className="flex items-center justify-start gap-1">
            <img src={confirmation_number} alt="confirmation_number" />
            <h6 className={clsx(styles.manage)}>
              {" "}
              {loading ? "Loading..." : `${closedTickets} Closed Tickets`}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceComp;
