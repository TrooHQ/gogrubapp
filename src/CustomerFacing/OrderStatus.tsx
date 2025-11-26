import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import type { RootState } from "../../../store/store";
import axios from "axios";
import { toast } from "react-toastify";
import { SERVER_DOMAIN } from "../Api/Api";
import { clearBasket } from "../slices/BasketSlice";
import { Loader } from "lucide-react";
// import { SERVER_DOMAIN } from "../../../Api/Api";
// import Loader from "../../../components/Loader";
// import { clearBasket } from "../../../slices/BasketSlice";

export default function OrderStatus() {
  const [home, setHome] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");

  const [uniqueId, setuniqueId] = useState<string>("");
  const getAxiosMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data;
      if (typeof data === 'object' && data && 'message' in data) {
        const msg = (data as { message?: unknown }).message;
        if (typeof msg === 'string') return msg;
      }
    }
    return "An error occurred. Please try again.";
  };
  useEffect(() => {
    const getBizId = () => {
      const url = localStorage.getItem("gg_h_url")?.split("/");

      console.log("url", url);
      url ? setuniqueId(url[url.length - 2]) : setuniqueId("");
    }

    getBizId();
  }, [])

  useEffect(() => {
    setErrorMsg(null);
    const homeUrl = localStorage.getItem("gg_h_url") || "";
    console.log("homeUrl", homeUrl);
    setHome(homeUrl);

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

  console.log("home", home);

  const handleBackHome = () => {
    window.location.href = home;
    // if (home) {
    // } else {
    //   navigate(-1);
    // }
  };

  console.log("uniqueId", uniqueId)

  useEffect(() => {
    if (!reference) return;
    if (!uniqueId) return;

    const verifyPayment = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${SERVER_DOMAIN}/order/confirmOrderPayment`,
          { reference: reference, businessId: uniqueId }
        );

        if (response.data?.status !== false) {
          await handlePayment();
          toast.success("Payment Successful!");
          setErrorMsg(null);
        } else {
          toast.error("Payment could not be verified.");
          setErrorMsg("Payment could not be verified.");
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
        const msg = getAxiosMessage(error);
        toast.error(msg);
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    const handlePayment = async () => {
      try {
        const order = localStorage.getItem("order_sdjgh");
        const orderObj = JSON.parse(order || "{}");
        const res = await axios.post(
          // `${SERVER_DOMAIN}/order/uploadBranchUserOrder`,
          `${SERVER_DOMAIN}/order/uploadGogrubBranchUserOrder`,
          { ...orderObj, transactionRef: reference }
        );
        // console.log("res", res)
        sessionStorage.setItem("OrderDetails", JSON.stringify(res.data.data));
        const num = res?.data?.data?.order_number || res?.data?.data?.orderNumber || res?.data?.data?.orderId || res?.data?.data?.order_id;
        if (num) setOrderNumber(String(num));
        dispatch(clearBasket());
        localStorage.removeItem("order_sdjgh");
        localStorage.removeItem("reference");
      } catch (error) {
        console.error("Error uploading order:", error);
        const msg = getAxiosMessage(error) || "An error occurred while finalizing the order.";
        toast.error(msg);
        setErrorMsg(msg);
      }
    };

    verifyPayment();
  }, [reference, uniqueId]);

  if (errorMsg) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-[18px] font-[600] text-[#FF4D4F]">Payment Error</p>
          <p className="mt-2 text-[14px] text-[#FF4D4F]">{errorMsg}</p>
          <button
            onClick={handleBackHome}
            className="mt-6 inline-flex items-center justify-center px-5 py-2 rounded-full border border-blue-600 text-blue-600 bg-white hover:bg-blue-50"
          >
            Back home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-[18px] font-[600] text-[#121212]">Order successful!</p>
        <p className="mt-2 text-[14px] text-[#121212]">Your order number is <span className="font-[700]">{formattedOrderNumber}</span>.</p>
        <p className="mt-4 text-[14px] text-[#606060]">We will notify you when your order is ready,<br /> and it will then be delivered to your room.</p>
        <button
          onClick={handleBackHome}
          className="mt-6 inline-flex items-center justify-center px-5 py-2 rounded-full border border-blue-600 text-blue-600 bg-white hover:bg-blue-50"
        >
          Back home
        </button>
      </div>
    </div>
  );
}
