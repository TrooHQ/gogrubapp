import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";
import { useEffect, useState } from "react";
import { SERVER_DOMAIN } from "../../Api/Api";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ChangeBranchForTicket from "./ChangeBranchForTicket";
import { CalendarMonth } from "@mui/icons-material";
import * as XLSX from "xlsx"; // For Excel export
import { saveAs } from "file-saver"; // To save files locally
import Papa from "papaparse"; // For CSV export
import { truncateText } from "../../utils/truncateText";

const OrderHistory = () => {
  const { selectedBranch } = useSelector((state: any) => state.branches);
  console.log(selectedBranch);

  const [openTicket, setOpenTicket] = useState<boolean>(false); // to open ticket details modal
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const userDetails = useSelector((state: any) => state.user);

  const token = userDetails?.userData?.token;

  const handleTicketMenu = () => {
    setOpenTicket(!openTicket);
  };

  const getTickets = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/order/getOrderByBranch/?branch_id=${selectedBranch.id}`,
        headers
      );
      console.log(response.data);
      setData(response.data);
      // toast.success(response.data.message || "Successful");
    } catch (error) {
      toast.error("Error retrieving tickets");
    }
  };

  useEffect(() => {
    getTickets();
  }, [selectedBranch]);

  const handleRefresh = () => {
    getTickets();
  };

  // Function to export data as Excel
  // Function to export selected data as Excel
  const exportToExcel = () => {
    // Create an array with only the desired fields
    const selectedData = data.map((item) => ({
      order_number: item.order_number,
      date: item.createdAt.slice(0, 10),
      time: item.createdAt.slice(11, 16),
      customer_name: item.customer_name,
      channel: item.channel,
      total_price: item.total_price,
    }));

    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "order_history.xlsx");
  };

  // Function to export selected data as CSV
  const exportToCSV = () => {
    // Create an array with only the desired fields
    const selectedData = data.map((item) => ({
      order_number: item.order_number,
      date: item.createdAt.slice(0, 10),
      time: item.createdAt.slice(11, 16),
      customer_name: item.customer_name,
      channel: item.channel,
      total_price: item.total_price,
    }));

    const csv = Papa.unparse(selectedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "order_history.csv");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleDownloadCSV = () => {
    setDropdownVisible(false);
    exportToCSV();
  };

  const handleDownloadExcel = () => {
    setDropdownVisible(false);
    exportToExcel();
  };

  return (
    <div>
      <DashboardLayout>
        <TopMenuNav pathName="Tickets" />
        <div className="">
          <div className="mt-[40px]">
            <ChangeBranchForTicket handleRefresh={handleRefresh} />
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center justify-between">
                <div className="relative">
                  <input
                    type="text"
                    className="bg-[#F8F8F8] rounded p-2 pl-14 outline-none border border-[#5855B3]"
                    placeholder="Search"
                  />
                  <img
                    src={SearchIcon}
                    alt=""
                    className="absolute left-6 top-3 pointer-events-none"
                  />
                </div>
              </div> */}
              <div className="flex items-center gap-[32px]">
                <div className="">
                  <p className="font-[500] text-[16px] text-[#121212]">
                    Filter by:
                  </p>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="border border-purple500 bg-purple500 rounded-[5px] px-[16px] py-[8px] font-[400] text-[#ffffff]">
                    <button className="text-[12px]">Today</button>
                  </div>
                  <div className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[121212]">
                    <button className="text-[12px]">7 Days</button>
                  </div>
                  <div className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[#121212]">
                    <button className="text-[12px]">1 Month</button>
                  </div>
                  <div className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[#121212]">
                    <button className="text-[12px]">3 Months</button>
                  </div>
                  <div className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[#121212]">
                    <button className="text-[12px]">6 Months</button>
                  </div>
                  <div className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[#121212]">
                    <button className="text-[12px]">1 Year</button>
                  </div>
                  <div className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[#121212]">
                    <button className="text-[12px] flex items-center gap-1">
                      <CalendarMonth className="w-4 h-4" />
                      <span>Custom</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Export buttons */}
              <div className="flex items-center gap-[12px]">
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[#121212]"
                  >
                    Download
                  </button>
                  {dropdownVisible && (
                    <div className="absolute mt-2 w-[150px] bg-white border border-[#B6B6B6] rounded-[5px] shadow-lg">
                      <button
                        onClick={handleDownloadCSV}
                        className="block w-full text-left px-[16px] py-[8px] hover:bg-gray-200"
                      >
                        Download CSV
                      </button>
                      <button
                        onClick={handleDownloadExcel}
                        className="block w-full text-left px-[16px] py-[8px] hover:bg-gray-200"
                      >
                        Download Excel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="">
              <div className="py-[32px] border rounded-[10px] border-grey100 mt-[24px]">
                <p className=" px-[32px]  font-[400] text-[24px] text-[#121212]">
                  Orders
                </p>

                <div className=" text-center pb-[16px] mb-[16px] pt-[24px] px-[32px] grid grid-cols-6 border-b">
                  <p className="text-start text-[14px] text-[#121212]">
                    Order No
                  </p>
                  <p className=" text-[14px] text-[#121212]">Date</p>
                  <p className=" text-[14px] text-[#121212]">Time</p>
                  <p className=" text-[14px] text-[#121212]">Customer </p>
                  <p className=" text-[14px] text-[#121212]">Channel </p>
                  <p className=" text-[14px] text-[#121212]">Bill </p>
                  {/* <p className=" text-[14px] text-[#121212]">Actions </p> */}
                </div>
                {data.map((item, index) => (
                  <div
                    className={`cursor-pointer text-center py-[14px] px-[32px] grid grid-cols-6 items-center  font-base text-[14px] text-[#414141] ${
                      index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#F8F8F8]"
                    }`}
                    key={index}
                  >
                    <p className="text-start" onClick={handleTicketMenu}>
                      {item.order_number || "-"}
                    </p>
                    <p className=" " onClick={handleTicketMenu}>
                      {item.createdAt.slice(0, 10)}
                    </p>
                    <p className=" " onClick={handleTicketMenu}>
                      {item.createdAt.slice(11, 16)}
                    </p>
                    <p onClick={handleTicketMenu}>
                      {item.customer_name
                        ? truncateText(
                            item.customer_name.charAt(0).toUpperCase() +
                              item.customer_name.slice(1),
                            12
                          )
                        : ""}
                    </p>

                    <p>{item.channel}</p>

                    <p>&#x20A6;{item.total_price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default OrderHistory;
