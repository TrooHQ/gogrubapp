import TopMenuNav from "./OnlineOrderingTopMenuNav";
import { useNavigate } from "react-router-dom";
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

  const [uniqueId, setuniqueId] = useState<string>("");
  useEffect(() => {
    const getBizId = () => {
      const url = sessionStorage.getItem("url")?.split("/");

      console.log("url", url);
      url ? setuniqueId(url[url.length - 2]) : setuniqueId("");
    }

    getBizId();
  }, [])

  console.log("uniqueId", uniqueId);

  const [pricePlusTax, setPricePlusTax] = useState(0);
  const [tax, setTax] = useState(0);

  console.log("fixedPrice", deliveryDetails?.deliveryDetails?.fixedPrice)

  useEffect(() => {

    const paymentPlusTax = async () => {
      // https://troox-backend.onrender.com/api
      try {
        const response = await axios.post(
          `${SERVER_DOMAIN}/order/calculateTotalAmount`,
          { "amount": basketDetails.totalPrice }

        );
        setPricePlusTax(response.data.total);

        setTax(response.data.tax);
        // console.log(response)
      } catch (error) {
        console.error("Something went wrong", error);
        // navigate(`/demo/payment-type/online_ordering/`);
      }
    }

    if (basketDetails?.totalPrice) {
      paymentPlusTax();
    }
  }, [basketDetails?.totalPrice]);

  // console.log("basketDetails from onlineOrderingSelectPayment", basketDetails);
  console.log("pricePlusTax", pricePlusTax);

  // const totalPrice = basketDetails?.totalPrice ?? 0;
  // const deliveryFee = basketDetails?.deliveryFee ?? 0;
  const deliveryFee = deliveryDetails?.deliveryDetails?.fixedPrice;
  console.log("deliveryFee", deliveryFee);

  const [delOpt, setDelOpt] = useState<string>("pickup");
  useEffect(() => {

    const storedDelOpt = localStorage.getItem("selDelOpt");
    if (storedDelOpt) {
      setDelOpt(storedDelOpt);
    }
  }, []);


  const [totalDue, setTotalDue] = useState(pricePlusTax);
  // console.log("totalDue", totalDue);

  useEffect(() => {
    if (deliveryFee) {
      setTotalDue(parseFloat(pricePlusTax.toString()) + (delOpt === "delivery" ? parseFloat(deliveryFee.toString()) : 0));
    }
  }, [deliveryFee, pricePlusTax, delOpt]);

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
    // complimentary: item.complimentary.map((option) => ({
    //   name: option.name,
    //   price: option.price,
    // })),
    complimentary: item.complimentary,
    tableNumber: item.tableNumber,
  }));

  console.log("items", items);


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
    orderType: delOpt,
    order_type: delOpt,
    // orderType: localStorage.getItem("selDelOpt"),
    // order_type: localStorage.getItem("selDelOpt"),
    items: items,
    menu_items: items,
    total_price: totalDue,
    totalPrice: totalDue,
    // total_price: pricePlusTax,
    // totalPrice: pricePlusTax,
    totalQuantity: basketDetails.totalQuantity,
    // isScheduledOrder: basketDetails.deliveryDate ? true : false,
    isScheduledOrder: !!basketDetails.deliveryDate && !dayjs(basketDetails.deliveryDate).isBefore(dayjs(), "day"),
    scheduledDate: basketDetails?.deliveryDate,
    // scheduledDate: dayjs(basketDetails?.deliveryDate).isBefore(dayjs(), "day") ? "" : dayjs(basketDetails?.deliveryDate).format("DD-MM-YYYY"),
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

      // `${PAYMENT_DOMAIN}/transaction/confirm_transaction_by_ref/`,
      // `https://staging.troopay.co/api/v1/transaction/confirm_transaction_by_ref/`,
      const response = await axios.post(
        // `${PAYMENT_DOMAIN}/transaction/confirm_transaction_by_ref/`,
        // https://troox-backend.onrender.com/api/order/confirmOrderPayment/
        `${SERVER_DOMAIN}/order/confirmOrderPayment/`,
        { reference: reference, businessId: uniqueId });
      // { reference: reference, businessId: uniqueId?.split("_").join(" ") });


      if (response.data?.status !== false) {
        console.log("Payment verification response:", response);
        handleOrderUpload();
        toast.success("Payment Successful!");
        sessionStorage.removeItem("reference");
      } else {
        toast.error("Payment could not be verified.");
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
      localStorage.removeItem("order_srjhh");
      return;
    }

    uniqueId && verifyPayment();
  }, [uniqueId, reference]);

  // console.log("payload", payload);
  // console.log("basketDetails", basketDetails);

  const handleOrderUpload = async () => {
    try {
      setLoading(true);

      const _order = localStorage.getItem("order_srjhh")

      const order = _order ? JSON.parse(_order) : null;

      // return;
      const response = await axios.post(
        `${SERVER_DOMAIN}/order/uploadGogrubBranchUserOrder`,
        { ...order, transactionRef: reference, }
        // payload?.items.length > 0 ? payload : order
        // payload
      );

      sessionStorage.setItem(
        "OrderDetails",
        JSON.stringify(response.data.data)
      );
      dispatch(clearBasket());
      sessionStorage.removeItem("reference");
      // localStorage.removeItem("order_srjhh");
      navigate(`/demo/receipt/online_ordering/`);
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setLoading(false);
    }
  };




  const IntiatePayment = async () => {
    setLoading(true);
    // sessionStorage.removeItem("reference");
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "",
        },
      };

      localStorage.setItem("order_srjhh", JSON.stringify(payload));

      deliveryFee && sessionStorage.setItem("deliveryFee", deliveryFee.toString());

      // `https://payment.trootab.com/api/v1/transaction/initiate_paystack_transaction/`,
      // `https://staging.troopay.co/api/v1/transaction/initiate_paystack_transaction/`,
      const response = await axios.post(
        `${PAYMENT_DOMAIN}/transaction/initiate_paystack_transaction/`,
        {
          business_id: business?.businessDetails?._id,
          name: basketDetails.customerName || "User",
          platform: "Online",
          // amount: parseInt(pricePlusTax.toString()) + parseInt(deliveryFee ? deliveryFee.toString() : "0"),
          amount: totalDue,
          email: "user@example.com",
          callback_url: window.location.href.includes("netlify.app") ?
            "https://gogrub-app.netlify.app/demo/payment-type/online_ordering" : "https://gogrub.shop/demo/payment-type/online_ordering",

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

      <div className=" text-center w-full mx-[10px] mt-[44px]">


        <div className="flex items-center justify-between w-full px-4">
          <p className=" text-[#000000] text-[16px] my-1 font-semibold ">
            Order Total:{" "}
          </p>
          <p className="text-sm font-bold text-gray-500">
            ₦ {basketDetails.totalPrice ? basketDetails.totalPrice.toLocaleString() : "0"}
          </p>
        </div>

        <div className="flex items-center justify-between w-full px-4">
          <p className=" text-[#000000] text-[16px] my-1 font-semibold ">
            Service Fee:{" "}
          </p>
          <p className="text-sm font-bold text-gray-500">
            ₦ {tax ? tax.toLocaleString() : "0"}
          </p>
        </div>

        {(deliveryFee !== 0 && delOpt === "delivery") && (
          <div className="flex items-center justify-between w-full px-4">
            <p className=" text-[#000000] text-[16px] my-1 font-semibold ">
              Delivery Fee:{" "}
            </p>
            <p className="text-sm font-bold text-gray-500">
              ₦ {deliveryFee ? deliveryFee.toLocaleString() : "0"}
            </p>
          </div>
        )}

        <hr className=" border border-[#414141] mb-[16px] mt-[24px]" />
        <div className="flex items-center justify-between w-full px-4">
          <p className=" text-[#000000] text-[16px] my-1 font-semibold ">
            Balance Due:{" "}
          </p>
          <p className="font-semibold text-gray-500">
            {/* ₦{deliveryFee ? (pricePlusTax + deliveryFee) : pricePlusTax} */}
            ₦{totalDue}
          </p>
        </div>
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
          <a
            href={deliveryDetails?.deliveryDetails?.support_link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[400] text-center text-[12px] text-[#000000]"
          >
            Contact Support
          </a>
        </div>
      </div>
      {/* <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 flex justify-center">
        <div className="flex flex-wrap items-center gap-[2px]">
          <img src={Customer} alt="Customer" />
          <Link to={deliveryDetails?.deliveryDetails?.support_link ?? "#"} className="font-[400] text-center text-[12px] text-[#000000]">
            Contact Support
          </Link>
        </div>
      </div> */}


    </div>
  );
};
