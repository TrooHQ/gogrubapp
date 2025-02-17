import More from "../assets/right-arroww.svg";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import Close from "../../assets/closeIcon.svg";
import Red from "../assets/red.svg";
import Green from "../assets/green.svg";
import Orange from "../assets/orange.svg";
import axios from "axios";
import { SERVER_DOMAIN } from "../../Api/Api";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import TopMenuNav from "./TopMenuNav";
import Loader from "../../components/Loader";

interface Ticket {
  order_number: string;
  channel: string;
  menu_items: MenuItem[];
  orders: string[];
  total_price: number;
  createdAt: string | Date;
  status: string;
  name: string;
  customer_name: string;
}

interface MenuItem {
  name: string;
  price: string;
  quantity: string;
  totalPrice: number;
}

const OrderHistory = () => {
  const [ticketModal, setTicketModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const handleTicketModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setTicketModal(true);
  };

  const userDetails = useSelector((state: RootState) => state.user);
  const token = userDetails?.userData?.token;

  const getTicket = async () => {
    setLoading(true);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/order/getOrder`,
        headers
      );
      setOrderHistory(response.data);
    } catch (error) {
      console.error("Error Retrieving Tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTicket();
  }, []);
  return (
    <div className="my-[16px] mx-[24px] relative">
      {loading && <Loader />}
      <TopMenuNav title="Order History" />

      <div className="">
        <div className="my-[32px] text-[14px] font-[400] text-grey500  flex justify-between items-center border-b pb-[12px] px-[8px]">
          <p className=" w-[80px] ">Date</p>
          <p className="w-[80px]">Order No</p>
          <p className=" w-[80px]">Channel</p>
          <p className="w-[54px]">Amount</p>
        </div>

        {orderHistory
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((ticket, index) => (
            <div
              key={index}
              className="text-center my-[32px] text-[14px] font-[400] text-grey500 border-b pb-[12px] px-[8px] flex justify-between items-center"
            >
              <div className="w-[80px]">
                {typeof ticket.createdAt === "string"
                  ? ticket.createdAt.slice(0, 10)
                  : new Date(ticket.createdAt).toISOString().slice(0, 10)}
              </div>

              <p className="w-[80px]">
                #{(ticket?.order_number || "20").slice(8, 10)}
              </p>
              <p className="capitalize w-[80px]">
                {ticket?.channel.slice(0, 6)}
              </p>
              <div
                className="flex justify-between gap-[10px] items-center cursor-pointer"
                onClick={() => handleTicketModal(ticket)}
              >
                <p>&#x20A6;{ticket?.total_price.toLocaleString()}</p>
                <img src={More} alt="" />
              </div>
            </div>
          ))}
      </div>

      <Modal isOpen={ticketModal}>
        <div className=" w-[328px] h-[500px]">
          <div className=" flex items-center justify-between">
            <div className=" py-[16px] border-b border-b-[#E7E7E7] w-full">
              <p className=" text-[16px] font-[500] text-grey500 ">Name</p>
              <div className=" text-[16px] font-[400] text-grey500 flex items-center justify-between capitalize">
                <p>
                  {selectedTicket?.customer_name
                    .split(" ")
                    .map((name, index) =>
                      index === 0
                        ? name
                        : index === 1
                        ? ` ${name.charAt(0).toUpperCase()}.`
                        : ""
                    )}
                </p>
              </div>
            </div>
            <img
              src={Close}
              alt=""
              onClick={() => setTicketModal(false)}
              className=" cursor-pointer"
            />
          </div>
          <div className="  py-[16px] border-b border-b-[#E7E7E7]">
            <p className=" text-[16px] font-[500] text-grey500  pb-[16px]">
              Orders
            </p>
            <div className="text-[16px] font-[400] text-grey500">
              {selectedTicket?.menu_items.map((order, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className=" text-[16px] font-[400] text-[#121212]">
                    {order.quantity || 2}x{" "}
                    <span className=" p-[5px]">{order.name}</span>
                  </p>
                  <p> &#x20A6;{order.totalPrice || 1}</p>
                </div>
              ))}
            </div>
          </div>
          <div className=" flex items-center justify-between border-b border-b-[#E7E7E7]">
            <div className="  py-[16px]  grid gap-[8px]">
              <p className="text-[16px] font-[500] text-grey500 ">
                Order Number
              </p>
              <p className=" text-[16px] font-[400] text-grey500">
                {"#"}
                {selectedTicket?.order_number || "20"}
              </p>
            </div>
            <div className="  py-[16px]  grid gap-[8px]">
              <p className="text-[16px] font-[500] text-grey500 ">Channel</p>
              <p className=" capitalize text-[16px] font-[400] text-grey500">
                {selectedTicket?.channel || ""}
              </p>
            </div>
          </div>
          <div className="  py-[16px] border-b border-b-[#E7E7E7] grid gap-[8px]">
            <p className=" text-[16px] font-[500] text-grey500">Time</p>
            <p className=" text-[16px] font-[400] text-grey500">
              {" "}
              {dayjs(selectedTicket?.createdAt).format("h:mm a")}
            </p>
          </div>

          <div className="  py-[16px] border-b border-b-[#E7E7E7] grid gap-[8px]">
            <p className=" text-[16px] font-[500] text-grey500">
              Delivery Details
            </p>
            <p className=" text-[16px] font-[400] text-grey500"> Pick Up</p>
          </div>

          <p className=" flex items-center gap-[8px] py-[16px]">
            {selectedTicket?.status === "served" && <img src={Green} />}
            {selectedTicket?.status === "Accepted" && <img src={Red} />}
            {selectedTicket?.status === "Pending" && <img src={Orange} />}
            <span className=" font-[500] text-[16px] text-[#414141] capitalize">
              {" "}
              {selectedTicket?.status}
            </span>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default OrderHistory;
