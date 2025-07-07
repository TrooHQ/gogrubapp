import TopMenuNav from "./OnlineOrderingTopMenuNav";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { PAYMENT_DOMAIN } from "../../Api/Api";
import { SERVER_DOMAIN } from "../../Api/Api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Customer from "../assets/streamline_customer-support-1-solid.svg";
import { TiArrowRight } from "react-icons/ti";
import { clearBasket } from "../../slices/BasketSlice";
import dayjs from "dayjs";

export const OnlineOrderingSelectPayment = () => {
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(window.location.search);
  const reference =
    searchParams.get("reference") || sessionStorage.getItem("reference");

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const basketDetails = useSelector((state: RootState) => state.basket);

  const business = useSelector((state: RootState) => state.business);

  const branchId = useSelector((state: RootState) => state.business?.branchID);

  const deliveryDetails = useSelector(
    (state: RootState) => state.business?.deliveryDetails
  );

  console.log("deliveryDetails", deliveryDetails);
  // console.log("business", business);

  const totalPrice = basketDetails?.totalPrice ?? 0;
  const deliveryFee = basketDetails?.deliveryFee ?? 0;

  const items = basketDetails.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    totalPrice: item.totalPrice,
    specialInstructions: item.specialInstructions,
    menuItem: {
      _id: item.menuItem?._id,
      menu_category_name: item.menuItem?.menu_category_name,
      menu_group_name: item.menuItem?.menu_group_name,
      menu_item_name: item.menuItem?.menu_item_name,
      menu_item_price: item.menuItem?.menu_item_price,
      menu_item_image: item.menuItem?.menu_item_image,
    },
    name: item.name,
    selectedOptions: item.selectedOptions.map((option) => ({
      name: option.name,
      price: option.price,
    })),
    tableNumber: item.tableNumber,
  }));

  const payload = {
    is_paid: "true",
    // channel: "gogrub",
    channel: "Online",
    branch_id: branchId,
    businessIdentifier: business?.businessIdentifier,
    customerName: basketDetails.customerName,
    ordered_by: basketDetails.customerName || "User",
    customerTableNumber: business?.tableNo,
    customerData: {
      email: basketDetails.customerEmail,
      phoneNumber: basketDetails.customerPhone,
      customerName: basketDetails.customerName,
      address: basketDetails.cutomerStreetAddress ?? basketDetails.cutomerTown,
    },
    orderType: localStorage.getItem("selDelOpt"),
    order_type:
      localStorage.getItem("selDelOpt"),
    items: items,
    menu_items: items,
    total_price: basketDetails.totalPrice,
    totalPrice: basketDetails.totalPrice,
    totalQuantity: basketDetails.totalQuantity,
    isScheduledOrder: basketDetails.deliveryDate ? true : false,
    scheduledDate: dayjs(basketDetails?.deliveryDate).format("DD-MM-YYYY"),
    transactionRef: sessionStorage.getItem("reference") || reference,
    // scheduledDate: basketDetails?.deliveryDate
    //   ? new Date(basketDetails.deliveryDate).toLocaleDateString("en-GB")
    //   : null,
  };

  const colorScheme = useSelector(
    (state: RootState) => state.business?.businessDetails?.colour_scheme
  );

  const verifyPayment = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${PAYMENT_DOMAIN}/transaction/confirm_transaction_by_ref/`,
        { reference: reference }
      );

      if (response.data) {
        handlePayment();
        toast.success("Payment Successful!");
        // sessionStorage.removeItem("reference");
        // navigate(`/demo/receipt/online_ordering/`);
      } else {
        toast.error("Payment verification failed. Contact support.");
        navigate(`/demo/payment-type/online_ordering/`);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("An error occurred. Please try again.");
      navigate(`/demo/payment-type/online_ordering/`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!reference) {
      return;
    }

    verifyPayment();
  }, []);

  console.log("payload", payload);
  console.log("basketDetails", basketDetails);

  const handlePayment = async () => {
    try {
      setLoading(true);




      // return;
      const response = await axios.post(
        `${SERVER_DOMAIN}/order/uploadGogrubBranchUserOrder`,
        payload
      );

      sessionStorage.setItem(
        "OrderDetails",
        JSON.stringify(response.data.data)
      );
      dispatch(clearBasket());
      sessionStorage.removeItem("reference");
      navigate(`/demo/receipt/online_ordering/`);
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const IntiatePayment = async () => {
    setLoading(true);

    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "",
        },
      };

      sessionStorage.setItem("deliveryFee", deliveryFee.toString());

      const response = await axios.post(
        `https://payment.trootab.com/api/v1/transaction/initiate_paystack_transaction/`,
        {
          business_id: business?.businessDetails?._id,
          name: basketDetails.customerName || "User",
          platform: "Online",
          amount: parseInt(totalPrice.toString()) + parseInt(deliveryFee.toString()),
          // amount: basketDetails.totalPrice,
          email: "user@example.com",
          callback_url:
            "https://gogrub-app.netlify.app/demo/payment-type/online_ordering",
          // "https://f9ed-105-112-125-160.ngrok-free.app/demo/payment-type/online_ordering",
          menu_items: items,
        },
        headers
      );

      // toast.success(
      //   response.data.paystack_data.message || "Payment Initiated successfully!"
      // );
      sessionStorage.setItem("reference", response?.data?.transaction?.ref);
      console.log("reference", response?.data?.transaction?.ref);
      // route this to a blank page
      window.location.href = response.data.paystack_data.data.authorization_url;
      // window.open(response.data.paystack_data.data.authorization_url, "_blank")
      // window.location.href = response.data.paystack_data.data.authorization_url;
    } catch (error) {
      console.error("Error initiating payment:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  relative mb-[20px]">
      <TopMenuNav exploreMenuText="Select Payment" />
      {loading && <Loader />}

      <div className=" text-center mt-[7px] w-full mx-[10px]">
        <p className=" text-[#000000] text-[18px] font-[400] mt-[36px]">
          Balance Due:{" "}
          <span className=" text-grey500">
            ₦ {totalPrice ? totalPrice.toLocaleString() : "0"}
          </span>
        </p>

        {deliveryFee !== 0 && (
          <p className=" text-[#000000] text-[14px] font-[400] ">
            Delivery Fee:{" "}
            <span className=" text-grey500">
              ₦ {deliveryFee ? deliveryFee.toLocaleString() : "0"}
            </span>
          </p>
        )}

        <hr className=" border border-[#414141] mb-[16px] mt-[24px]" />
        <p className="text-[#000000] text-[18px] font-[600]">
          Pay:{" "}
          <span className="text-grey500">
            ₦{(totalPrice + (deliveryFee ?? 0)).toLocaleString()}
          </span>
        </p>
      </div>

      <div className=" flex items-center  justify-center mt-[90px]">
        <p
          className=" cursor-pointer inline-flex items-center gap-[5px] font-[500] text-[18px] rounded-[5px] border   text-white py-[11px] px-[20px]"
          onClick={IntiatePayment}
          style={{
            backgroundColor: colorScheme || "#606060",
            borderColor: colorScheme || "#606060",
          }}
        >
          Proceed to Pay
          <TiArrowRight />
        </p>
      </div>

      <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 flex justify-center">
        <div className="flex flex-wrap items-center gap-[2px]">
          <img src={Customer} alt="Customer" />
          <Link to={deliveryDetails?.deliveryDetails?.support_link ?? "#"} className="font-[400] text-center text-[12px] text-[#000000]">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};
