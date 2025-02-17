import { useNavigate } from "react-router-dom";
import Back from "../SelfCheckout/assets/Back.svg";
import System from "../SelfCheckout/assets/system.png";
import QRCode from "../SelfCheckout/assets//qrcodeScan.png";
import Money from "../SelfCheckout/assets/money.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import axios from "axios";
import { SERVER_DOMAIN } from "../Api/Api";
import { clearBasket } from "../slices/BasketSlice";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const PaymentScreen = () => {
  const basketDetails = useSelector((state: RootState) => state.basket);
  const branchId = useSelector((state: RootState) => state.business?.branchID);

  const business = useSelector((state: RootState) => state.business);
  console.log(business?.businessDetails?._id);

  const totalPrice = basketDetails?.totalPrice ?? 0;
  const tip = basketDetails?.tip ?? 0;
  console.log(tip);

  const finalTotal = totalPrice + tip;
  console.log(finalTotal);
  console.log(basketDetails);

  const color = useSelector(
    (state: RootState) => state.business?.businessDetails?.colour_scheme
  );

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState("");

  const items = basketDetails.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    totalPrice: item.totalPrice,
    menuItem: item.menuItem
      ? {
          _id: item.menuItem._id,
          menu_category_name: item.menuItem.menu_category_name,
          menu_group_name: item.menuItem.menu_group_name,
          menu_item_name: item.menuItem.menu_item_name,
          menu_item_price: item.menuItem.menu_item_price,
          menu_item_image: item.menuItem.menu_item_image,
        }
      : undefined,
    name: item.name,
    selectedOptions: item.selectedOptions.map((option) => ({
      name: option.name,
      price: option.price,
    })),
    tableNumber: item.tableNumber,
  }));

  const payload = {
    is_paid: "true",
    channel: "self-checkout",
    branch_id: branchId,
    businessIdentifier: business?.businessDetails?._id,
    customerName: basketDetails.customerName,
    customerTableNumber: business?.tableNo,
    items: items,
    totalPrice: basketDetails.totalPrice,
    totalQuantity: basketDetails.totalQuantity,

    ordered_by: basketDetails.customerName || "User",
    menu_items: items,
    total_price: basketDetails.totalPrice,
  };
  const handlePayment = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${SERVER_DOMAIN}/order/uploadBranchUserOrder`,
        payload
      );
      setLoading(false);
      console.log(response.data?.data?.order_number);
      sessionStorage.setItem("orderId", response.data?.data?.order_number);
      sessionStorage.setItem(
        "OrderDetails",
        JSON.stringify(response.data.data)
      );

      sessionStorage.setItem(
        "collection_number",
        response.data?.data?.collection_number
      );

      dispatch(clearBasket());
      localStorage.clear();
      toast.success("Order has been Made successfully");
      navigate(`/demo/success/selfcheckout`);
    } catch (error) {
      console.error("Error occurred:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" ">
      <img
        src={Back}
        alt=""
        onClick={() => navigate(-1)}
        className="p-[10px] cursor-pointer"
      />

      <div className=" text-center mt-[7px] max-w-[554px] mx-auto">
        <p className=" text-[#121212] text-[44px] font-[500]">
          Payment Options
        </p>
        <p className=" text-[#000000] text-[32px] font-[500] mt-[56px]">
          Balance Due:{" "}
          <span className=" text-[#121212]">
            ₦ {totalPrice ? totalPrice.toLocaleString() : "0"}
          </span>
        </p>
        <p className=" text-[#000000] text-[32px] font-[500]">
          Tip: ₦ {}{" "}
          <span className=" text-[#000000]">{tip.toLocaleString() || 0} </span>
        </p>

        <hr className=" border border-[#414141] mb-[16px] mt-[24px]" />
        <p className="text-[#000000] text-[32px] font-[600]">
          Pay:{" "}
          <span className="text-[#121212]">
            ₦{(totalPrice + (tip ?? 0)).toLocaleString()}
          </span>
        </p>
      </div>

      <div className="bg-[#F8F8F8] border border-[#E7E7E7] px-[24px] py-[32px] rounded-[10px] grid grid-cols-3 gap-[8px] items-center mx-[18px] mt-[80px]">
        <p
          className={`text-[25px] font-[500] cursor-pointer text-center py-[35px] px-[8px] bg-white rounded-[10px] ${
            selectedOption === "Bank Transfer QR"
              ? "border-4 text-white"
              : "border-4 text-[#414141]"
          }`}
          onClick={() => setSelectedOption("Bank Transfer QR")}
          style={{
            borderColor:
              selectedOption === "Bank Transfer QR"
                ? color || "#5855B3"
                : "#B6B6B6",
            color:
              selectedOption === "Bank Transfer QR"
                ? color || "#5855B3"
                : "#414141",
          }}
        >
          Bank Transfer QR
        </p>

        <p
          className={`text-[25px] font-[500] cursor-pointer  py-[35px] px-[8px] text-center border  bg-white rounded-[10px] ${
            selectedOption === "WebPay"
              ? "border-4 text-white"
              : "border-4 text-[#414141]"
          }`}
          onClick={() => setSelectedOption("WebPay")}
          style={{
            borderColor:
              selectedOption === "WebPay" ? color || "#5855B3" : "#B6B6B6",
            color: selectedOption === "WebPay" ? color || "#5855B3" : "#414141",
          }}
        >
          WebPay
        </p>
        <p
          className={`text-[25px] font-[500] cursor-pointer text-[#414141] py-[35px] px-[8px] text-center  bg-white rounded-[10px] ${
            selectedOption === "Terminals"
              ? "border-4 text-white"
              : "border-4 text-[#414141]"
          }`}
          onClick={() => setSelectedOption("Terminals")}
          style={{
            borderColor:
              selectedOption === "Terminals" ? color || "#5855B3" : "#B6B6B6",
            color:
              selectedOption === "Terminals" ? color || "#5855B3" : "#414141",
          }}
        >
          Terminals
        </p>
      </div>

      {selectedOption && (
        <div className=" mx-[42px] mt-[20px]">
          {selectedOption === "Bank Transfer QR" && (
            <div className="">
              <p className=" text-[32px] font-[500] text-[#414141] px-[28px] py-[15px]">
                Bank Transfer QR
              </p>
              <hr className=" border-[#929292] border" />

              <div className=" my-[40px] max-w-[566px] mx-auto text-center">
                <p className=" text-[28px]  font-[400] text-[#121212]">
                  Scan QR Code below in your bank app to complete this payment
                </p>

                <div className=" flex justify-center">
                  <img src={QRCode} alt="" className=" mt-[40px]" />
                </div>
              </div>

              <div className=" flex items-center  justify-center">
                <p
                  className="cursor-pointer inline font-[500] text-[32px] rounded-full border py-[37px] px-[40px]"
                  onClick={handlePayment}
                  style={{
                    backgroundColor: color || "#FF0000",
                    borderColor: color || "#FF0000",
                    color: "#FFFFFF",
                  }}
                >
                  Proceed to Pay
                </p>
              </div>
            </div>
          )}
          {selectedOption === "WebPay" && (
            <div className="">
              <p className=" text-[32px] font-[500] text-[#414141] px-[28px] py-[15px]">
                WebPay
              </p>
              <hr className=" border-[#929292] border" />

              <div className=" my-[40px] max-w-[566px] mx-auto text-center">
                <p className=" text-[28px]  font-[400] text-[#121212]">
                  Scan QR Code with your phone camera
                </p>

                <div className=" flex justify-center">
                  <img src={QRCode} alt="" className=" mt-[40px]" />
                </div>
              </div>

              <div className=" flex items-center  justify-center">
                <p
                  className="cursor-pointer inline font-[500] text-[32px] rounded-full border py-[37px] px-[40px]"
                  onClick={handlePayment}
                  style={{
                    backgroundColor: color || "#FF0000",
                    borderColor: color || "#FF0000",
                    color: "#FFFFFF",
                  }}
                >
                  Proceed to Pay
                </p>
              </div>
            </div>
          )}
          {selectedOption === "Terminals" && (
            <div className="">
              <p className=" text-[32px] font-[500] text-[#414141] px-[28px] py-[15px]">
                Terminals
              </p>
              <hr className=" border-[#929292] border" />

              <div className=" my-[40px] max-w-[566px] mx-auto text-center">
                <p className=" text-[28px]  font-[400] text-[#121212]">
                  Tap attached NFC device
                </p>

                <div className=" flex justify-center">
                  <img src={System} alt="" className=" mt-[40px]" />
                </div>
              </div>

              <div className=" flex items-center  justify-center">
                <p
                  className="cursor-pointer inline font-[500] text-[32px] rounded-full border py-[37px] px-[40px]"
                  onClick={handlePayment}
                  style={{
                    backgroundColor: color || "#FF0000",
                    borderColor: color || "#FF0000",
                    color: "#FFFFFF",
                  }}
                >
                  Proceed to Pay
                </p>
              </div>
            </div>
          )}
          {selectedOption === "Cash" && (
            <div className="">
              <p className=" text-[32px] font-[500] text-[#414141] px-[28px] py-[15px]">
                Cash
              </p>
              <hr className=" border-[#929292] border" />
              <div className=" my-[40px] max-w-[566px] mx-auto text-center">
                <p className=" text-[28px]  font-[400] text-[#121212]">
                  Make your cash payment with the cashier
                </p>

                <div className=" flex justify-center">
                  <img src={Money} alt="" className=" mt-[40px]" />
                </div>
              </div>
              <div className=" flex items-center  justify-center">
                <p
                  className=" cursor-pointer inline font-[500] text-[32px] rounded-full border  bg-[#FF0000] border-[#FF0000] text-white py-[37px] px-[40px]"
                  onClick={handlePayment}
                >
                  {loading ? "Making Payment..." : "Proceed to Pay"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentScreen;
