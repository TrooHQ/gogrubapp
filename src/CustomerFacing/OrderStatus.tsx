import { useEffect, useState } from "react";

// import { clearBasket } from "../slices/BasketSlice";
// import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { clearBasket } from "../../../slices/BasketSlice";

export default function OrderStatus() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();


  // const [uniqueId, setuniqueId] = useState<string>("");
  // const getAxiosMessage = (err: unknown): string => {
  //   if (axios.isAxiosError(err)) {
  //     const data = err.response?.data;
  //     if (typeof data === 'object' && data && 'message' in data) {
  //       const msg = (data as { message?: unknown }).message;
  //       if (typeof msg === 'string') return msg;
  //     }
  //   }
  //   return "An error occurred. Please try again.";
  // };
  // useEffect(() => {
  //   const getBizId = () => {
  //     const url = localStorage.getItem("gg_h_url")?.split("/");

  //     console.log("url", url);
  //     url ? setuniqueId(url[url.length - 2]) : setuniqueId("");
  //   }

  //   getBizId();
  // }, [])

  useEffect(() => {
    setErrorMsg(null);

    try {
      const details = sessionStorage.getItem("OrderDetails");
      if (details) {
        const parsed = JSON.parse(details || "{}");
        const num = parsed?.order_number || parsed?.orderNumber || parsed?.orderId || parsed?.order_id;
        if (num) setOrderNumber(String(num));
      }
    } catch {
      // ignore parsing issues
    }
  }, []);

  const formattedOrderNumber = `#${(orderNumber ?? "").toString().padStart(3, "0")}`;

  const navigate = useNavigate();

  const goHome = () => {
    const homeUrl = localStorage.getItem("gg_h_url") || "";
    navigate(homeUrl);
  }
  // console.log("uniqueId", uniqueId)

  if (errorMsg) {
    return (
      <div className="relative flex items-center justify-center w-full min-h-screen">
        <div className="px-4 text-center">
          <p className="text-[18px] font-[600] text-[#FF4D4F]">Payment Error</p>
          <p className="mt-2 text-[14px] text-[#FF4D4F]">{errorMsg}</p>
          <button
            onClick={goHome}
            className="inline-flex items-center justify-center px-5 py-2 mt-6 text-blue-600 bg-white border border-blue-600 rounded-full hover:bg-blue-50"
          >
            Back home
          </button>
        </div>
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div className="relative flex items-center justify-center w-full min-h-screen">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen">
      <div className="px-4 text-center">
        <p className="text-[18px] font-[600] text-[#121212]">Order successful!</p>
        <p className="mt-2 text-[14px] text-[#121212]">Your order number is <span className="font-[700]">{formattedOrderNumber}</span>.</p>
        <p className="mt-4 text-[14px] text-[#606060]">We will notify you when your order is ready,<br /> and it will then be delivered to your room.</p>
        <button
          onClick={goHome}
          className="inline-flex items-center justify-center px-5 py-2 mt-6 text-blue-600 bg-white border border-blue-600 rounded-full hover:bg-blue-50"
        >
          Back home
        </button>
      </div>
    </div>
  );
}
