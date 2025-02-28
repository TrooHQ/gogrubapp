import clsx from "clsx";
import styles from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Key, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { fetchTopMenuItems } from "../../slices/overviewSlice";
import PieCharts from "./PieChart";

// Predefined color palette
const colors = [
  "#9787FF",
  "#FFA5DA",
  "#0096FF",
  "#5BD222",
  "#FDB600",
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A5",
  "#A533FF",
];
const KPI = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { topMenuItems, loading } = useSelector(
    (state: RootState) => state.overview
  );
  console.log(topMenuItems, "topMenuItems");
  const { selectedBranch } = useSelector((state: any) => state.branches);

  useEffect(() => {
    dispatch(
      fetchTopMenuItems({ date_filter: "today", branch_id: selectedBranch })
    );
  }, [dispatch, selectedBranch]);

  return (
    <div className="border border-[#C7C6CF] p-6 rounded-2xl mb-12">
      {" "}
      <div className={clsx("flex justify-between items-center w-full mb-9")}>
        <h5 className={clsx(styles.salesRevenue)}>Highest Selling Product</h5>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="overflow-auto whitespace-nowrap scrollbar-hide">
          {topMenuItems?.data?.map(
            (product: any, index: Key | null | undefined) => (
              <div
                key={index}
                className="border border-[#C7C6CF] rounded-[10px] overflow-auto inline-block mr-4"
              >
                <div className="flex flex-col items-center gap-4 min-w-[200px] py-7 px-8">
                  <img
                    src={product?._id?.menuItemImage}
                    alt="product"
                    className="w-[80px] h-[60px]"
                  />
                  <h6 className="text-[#201F44] font-medium">
                    {product.menuItemName}
                  </h6>
                  <p className="text-purple200 text-sm">
                    {product.totalQuantity} quantities sold
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}
      {/* Pie chart component */}
      <div className="flex gap-2.5 mt-6">
        <div className="bg-white rounded-[10px] px-5 py-[48px]">
          <PieCharts topMenuItems={topMenuItems?.data || []} />
        </div>

        <div className="bg-white rounded-[10px] px-5 py-[48px] flex-grow flex flex-col gap-[22px]">
          {topMenuItems?.data?.map((product: any, index: any) => {
            const indicator = colors[index % colors.length];
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: indicator }}
                  ></div>
                  <div>
                    <h6 className="text-[#201F44] text-[16px] font-medium">
                      {product.menuItemName}
                    </h6>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[#858497] text-base font-normal">
                    ₦ {product.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KPI;
