import { useRef } from "react";
import TopMenuNav from "./OnlineOrderingTopMenuNav";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface MenuItem {
  menu_item_name: string;
  menu_item_price: number;
}

interface SelectedOption {
  name: string;
  price: number;
}

interface Menu {
  menuItem: MenuItem;
  selectedOptions: SelectedOption[];
  quantity: number;
  complimentary?: string[];
}

interface OrderDetails {
  order_number: string;
  createdAt: string;
  menu_items: Menu[];
  total_price: number;
  order_type: string; // e.g., "delivery", "pickup"
}

export const OnlineOrderingReceipt = () => {
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  console.log("Delivery Fee:", deliveryFee);

  useEffect(() => {
    const df = sessionStorage.getItem("deliveryFee");
    if (df) {
      setDeliveryFee(Number(df));
    }
  }, [])

  useEffect(() => {

    const orderDetails = sessionStorage.getItem("OrderDetails");
    if (!orderDetails) {
      const mercUrl = localStorage.getItem("merc_url") ?? "/";
      console.log(mercUrl)
      navigate(JSON.parse(mercUrl));
    }

  }, [navigate]);


  useEffect(() => {
    const fetchOrderDetails = () => {
      const storedOrderDetails = sessionStorage.getItem("OrderDetails");
      if (storedOrderDetails) {
        setOrderDetails(JSON.parse(storedOrderDetails));
        console.log(JSON.parse(storedOrderDetails));
      } else {
        setTimeout(fetchOrderDetails, 2000);
      }
    };
    fetchOrderDetails();
  }, []);



  console.log("orderDetails", orderDetails);

  const handleDownloadImage = async () => {
    const element = receiptRef.current;
    if (element) {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "receipt.png";
      link.click();
      // navigate("/demo/get-receipt/online_ordering");
    }
  };

  return (
    <div className="">
      <TopMenuNav exploreMenuText="Receipt" />

      <div className="py-[28px] mx-[16px]" ref={receiptRef}>
        <div className="mb-[20px]">
          <p className="text-[18px] font-semibold text-gray-900 text-center">
            Order - {orderDetails?.order_number || ""}
          </p>

          <p className="text-gray-500 text-[14px] font-[400] text-center">
            {orderDetails?.createdAt
              ? dayjs(orderDetails.createdAt).format(
                "HH:mm:ss dddd, DD MMM YYYY"
              )
              : "08:02:27 Wednesday, 30 Apr 2020"}
          </p>
        </div>

        <div className="border-b border-[#929292]">
          {orderDetails?.menu_items?.map((menu, index) => (
            <div key={index}>
              <div className="space-y-[8px] pb-[24px]">
                <div className="flex items-center justify-between text-base font-normal text-gray-800">
                  <div className=" gap-[8px] font-semibold relative">
                    <p>{menu?.menuItem?.menu_item_name || ""} <span className="p-1 text-xs border border-gray-500 rounded-full -right-3 -top-3" >{menu?.quantity}</span></p>
                  </div>

                  <p>
                    ₦{menu?.menuItem?.menu_item_price?.toLocaleString() || "0"}
                  </p>
                </div>

                <div className="flex w-full gap-4 p-2 my-1 bg-white border border-gray-500 rounded-md">
                  <p className="text-xs font-normal text-gray-600">
                    Complimentary:
                  </p>
                  <p className="text-xs font-semibold text-gray-600">
                    {menu?.complimentary || ""}
                  </p>
                </div>

                {menu?.selectedOptions?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 underline">
                      MODIFIERS
                    </p>
                    {menu.selectedOptions.map((item, index) => (
                      <div className="" key={index}>
                        <div className="flex items-center justify-between ml-4 space-y-2 text-xs font-bold text-gray-500">
                          <p>{item?.name}</p>

                          <p>₦{item?.price?.toLocaleString() || "0"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <hr className="w-[64px] text-[#929292]" />
            </div>
          ))}
        </div>

        <div className="mt-[8px] space-y-[8px]">

          <div className="font-[500] text-[18px] text-grey500 flex items-center justify-between">
            <p className="">Total Paid</p>
            <p>
              ₦{orderDetails?.total_price ?? 0}
              {/* {(
                // (orderDetails?.total_price ?? 0) + (deliveryFee ?? 0)
                (orderDetails?.order_type === "delivery" ? (orderDetails?.total_price ? orderDetails?.total_price + deliveryFee : orderDetails?.total_price) : orderDetails?.total_price) || 0).toLocaleString()} */}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[50px]">
        <div className="flex items-center justify-center mt-[50px] space-x-4">
          <p
            className="bg-grey300 rounded-[5px] py-[10px] px-[64px] text-center cursor-pointer inline text-[16px] font-[500] text-white"
            onClick={handleDownloadImage}
          >
            Download
          </p>
        </div>
      </div>
    </div>
  );
};
