import TopMenuNav from "./OnlineOrderingTopMenuNav";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import axios from "axios";
import { PAYMENT_DOMAIN, SERVER_DOMAIN } from "../../Api/Api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Customer from "../assets/streamline_customer-support-1-solid.svg";
import { TiArrowRight } from "react-icons/ti";
import { usePaystackPayment } from "react-paystack";

export const OnlineOrderingSelectPayment = () => {
  const storedOrderID = sessionStorage.getItem("OrderDetails");
  const storedOrderDetails = storedOrderID ? JSON.parse(storedOrderID) : null;

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const basketDetails = useSelector((state: RootState) => state.basket);

  const business = useSelector((state: RootState) => state.business);
  const branchId = useSelector((state: RootState) => state.business?.branchID);

  const totalPrice = basketDetails?.totalPrice ?? 0;
  const deliveryFee = basketDetails?.deliveryFee ?? 0;

  const config = {
    reference: new Date().getTime().toString(),
    email: "trooemail@gmail.com",
    publicKey: "pk_test_55e93b1ed22dbcc8b11fcafa99638414975a6b49",
    amount: basketDetails.totalPrice > 0 ? basketDetails.totalPrice * 100 : 100,
  };

  const initializePayment = usePaystackPayment(config);

  const items = basketDetails.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    totalPrice: item.totalPrice,
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
    channel: "GoGrub",
    branch_id: branchId,
    businessIdentifier: business?.businessIdentifier,
    customerName: basketDetails.customerName,
    ordered_by: basketDetails.customerName || "User",
    customerTableNumber: business?.tableNo,
    customerData: {
      email: "trooEmails@gmail",
      phoneNumber: basketDetails.customerPhone,
      customerName: basketDetails.customerName,
      address: basketDetails.cutomerStreetAddress,
    },
    items: items,
    menu_items: items,
    total_price: basketDetails.totalPrice,
    totalPrice: basketDetails.totalPrice,
    totalQuantity: basketDetails.totalQuantity,
    isScheduledOrder: basketDetails.deliveryDate ? true : false,
    scheduledDate: basketDetails?.deliveryDate
      ? new Date(basketDetails.deliveryDate).toLocaleDateString("en-GB")
      : null,
  };

  const colorScheme = useSelector(
    (state: RootState) => state.business?.businessDetails?.colour_scheme
  );

  const onSuccess = async (reference: { reference: string }) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${PAYMENT_DOMAIN}/transaction/confirm_paystack_transaction/`,
        { reference: reference.reference }
      );

      if (response.data.success) {
        toast.success("Payment Successful!");
        sessionStorage.setItem(
          "OrderDetails1",
          JSON.stringify(response.data.data)
        );

        navigate(`/demo/receipt/online_ordering/${storedOrderDetails._id}`);
      } else {
        toast.error("Payment verification failed. Contact support.");
        navigate(`/demo/receipt/online_ordering/${storedOrderDetails._id}`);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("An error occurred. Please try again.");
      navigate(`/demo/receipt/online_ordering/${storedOrderDetails._id}`);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    toast.info("Payment process was cancelled.");
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${SERVER_DOMAIN}/order/uploadBranchUserOrder`,
        payload
      );

      sessionStorage.setItem(
        "OrderDetails",
        JSON.stringify(response.data.data)
      );

      initializePayment({ onSuccess, onClose });
    } catch (error) {
      console.error("Error occurred:", error);
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
          onClick={handlePayment}
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
          <p className="font-[400] text-center text-[12px] text-[#000000]">
            Contact Support
          </p>
        </div>
      </div>
    </div>
  );
};
