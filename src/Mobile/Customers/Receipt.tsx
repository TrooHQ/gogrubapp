import TopMenuNav from "./TopMenuNav";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

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
}

interface OrderDetails {
  order_number: string;
  createdAt: string;
  menu_items: Menu[];
  total_price: number;
}

export const Receipt = () => {
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const storedOrderDetails = sessionStorage.getItem("OrderDetails");
  const orderDetails: OrderDetails | null = storedOrderDetails
    ? JSON.parse(storedOrderDetails)
    : null;

  const handleDownloadImage = async () => {
    const element = receiptRef.current;
    if (element) {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "receipt.png";
      link.click();

      navigate("/demo/get-receipt/orderandpay");
    }
  };
  return (
    <div className="  ">
      <TopMenuNav exploreMenuText="Receipt" />

      <div className="py-[28px] mx-[16px]" ref={receiptRef}>
        <div className="mb-[20px]">
          <p className="text-[18px] font-[500] text-grey500 text-center">
            Order - {orderDetails?.order_number || "CR201"}
          </p>

          <p className="text-grey500 text-[14px] font-[400] text-center">
            {orderDetails?.createdAt
              ? dayjs(orderDetails.createdAt).format(
                  "HH:mm:ss dddd, DD MMM YYYY"
                )
              : "08:02:27 Wednesday, 30 Apr 2020"}
          </p>
        </div>

        <div className="border-b border-[#929292]">
          {orderDetails?.menu_items?.map((menu, index) => (
            <div key={index} className="">
              <div className="space-y-[8px] pb-[24px]">
                <div className="font-[400] text-[16px] text-grey500 flex items-center justify-between">
                  <p>{menu?.menuItem?.menu_item_name || ""}</p>
                  <p>
                    ₦{menu?.menuItem?.menu_item_price?.toLocaleString() || "0"}
                  </p>
                </div>

                {menu?.selectedOptions?.length > 0 && (
                  <>
                    <p className="font-[500] text-[10px] text-grey300">
                      MODIFIERS
                    </p>
                    {menu.selectedOptions.map((item, index) => (
                      <div key={index} className="space-y-[8px]">
                        <div className="flex items-center justify-between text-[16px] font-[400] text-grey300">
                          <p>{item?.name || ""}</p>

                          <p>₦{item?.price?.toLocaleString() || "0"}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <hr className="w-[64px] text-[#929292]" />
            </div>
          ))}
        </div>

        <div className="mt-[8px] space-y-[8px]">
          <div className="font-[400] text-[16px] text-grey500 flex items-center justify-between">
            <p className="">Sub-Total</p>
            <p>₦{orderDetails?.total_price?.toLocaleString()}</p>
          </div>

          <div className="font-[400] text-[16px] text-grey500 flex items-center justify-between">
            <p className="">VAT</p>
            <p>₦0</p>
          </div>

          <div className="font-[500] text-[18px] text-grey500 flex items-center justify-between">
            <p className="">Paid</p>
            <p>₦{orderDetails?.total_price?.toLocaleString()}</p>
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
