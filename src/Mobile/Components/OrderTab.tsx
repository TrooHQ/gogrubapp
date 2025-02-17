import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_DOMAIN } from "../../Api/Api";
import chatMessage from "../assets/chat-message.svg";
import dayjs from "dayjs";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import Modal from "./Modal";
import Close from "../../assets/closeIcon.svg";

interface TabItem {
  id: number;
  label: string;
  content: () => JSX.Element;
}

interface Ticket {
  customer_name: string;
  menu_items: MenuItem[];
  orders: string[];
  total_price: number[];
  createdAt: string;
  status: string;
  _id: number;
  order_number: string;
}

interface SelectedOption {
  name: string;
  price: number;
}
interface MenuItem {
  name: string;
  quantity: string;
  selectedOptions: SelectedOption[];
}
const OrderTab: React.FC = () => {
  const tabItems: TabItem[] = [
    { id: 1, label: "Order", content: renderMenuCategory },
    { id: 2, label: "Ready", content: renderMenuCategoryReady },
  ];

  // const sortedTickets = [...tickets].sort(
  //   (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  // );

  const userDetails = useSelector((state: RootState) => state.user);
  const token = userDetails?.userData?.token;
  const [loading, setLoading] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [ticketModal, setTicketModal] = useState(false);

  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
  };

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const handleTicketModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setTicketModal(true);
  };

  const selectedOutletID = useSelector(
    (state: any) => state.outlet.selectedOutletID
  );

  const getTicket = async (status: string) => {
    setLoading(true);

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/order/getBranchOrderByStatus/?branch_id=${selectedOutletID}&status=${status}`,
        headers
      );
      console.log(
        `Tickets with status "${status}" retrieved successfully:`,
        response.data
      );
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving tickets by status:", error);
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    setLoader(true);

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const requestData = { order_id: id, status };

    try {
      const response = await axios.put(
        `${SERVER_DOMAIN}/order/updateOrder/`,
        requestData,
        headers
      );
      console.log("Ticket status updated successfully:", response.data);

      if (response.status === 200) {
        if (status === "accept") {
          setActiveTab(2);
        } else if (status === "serve") {
          setActiveTab(1);
        } else if (status === "cancel") {
          setActiveTab(1);
        }
        setLoader(false);
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (activeTab === 1) {
      getTicket("Ordered");
    } else if (activeTab === 2) {
      getTicket("Accepted");
    }
  }, [activeTab]);

  function renderMenuCategory() {
    return (
      <>
        {tickets.length !== 0 ? (
          loading ? (
            <Loader />
          ) : (
            <div className="grid gap-[16px]">
              {tickets
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((ticket, index) => (
                  <div
                    className="rounded-[5px] px-[24px] py-[16px] bg-[#E7E7E7] border"
                    key={index}
                  >
                    <div className="rounded-[5px] flex items-center justify-between font-[500] text-[16px]">
                      <div className="flex gap-[1px] items-center">
                        <p className="capitalize">
                          {ticket?.customer_name
                            ? ticket?.customer_name
                                .split(" ")
                                .map((name, index) =>
                                  index === 0
                                    ? name.slice(0, 6)
                                    : index === 1
                                    ? ` ${name.charAt(0).toUpperCase()}.`
                                    : ""
                                )
                                .join("")
                            : ""}
                        </p>
                        <p className="capitalize">
                          <span className="px-[4px]">|</span>#
                          {ticket?.order_number.slice(7, 10) || "20"}
                          <span className="px-[4px]">|</span>
                        </p>
                        <p>{dayjs(ticket?.createdAt).format("h:mm a")}</p>
                      </div>

                      <p> &#x20A6;{ticket?.total_price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-[400] text-[16px] mt-[8px] capitalize">
                        {ticket?.menu_items?.map((item, itemIndex) => (
                          <>
                            {" "}
                            <div key={itemIndex}>
                              <p className="text-[16px] font-[400] text-[#121212]">
                                {item?.quantity || 1}x{" "}
                                <span className="p-[5px]">{item?.name}</span>
                              </p>
                            </div>
                            <div className="">
                              {item?.selectedOptions?.map((item, index) => (
                                <div
                                  key={index}
                                  className=" flex items-center justify-between"
                                >
                                  <p>{item?.name}</p>
                                </div>
                              ))}
                            </div>
                          </>
                        ))}
                      </div>
                      <div
                        className=" cursor-pointer"
                        onClick={() => handleTicketModal(ticket)}
                      >
                        <img src={chatMessage} alt="" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-[16px] items-center">
                      <button
                        className="text-[#B3312A] text-center font-[500] text-[14px] border border-[#ED5048] py-[8px] flex items-center justify-center w-full rounded-[5px] mt-[16px]"
                        disabled={loader}
                        onClick={() => updateStatus(ticket._id, "cancel")}
                      >
                        Reject
                      </button>
                      <button
                        className="text-white text-center font-[500] text-[14px] border border-[#ED5048] bg-[#ED5048] py-[8px] flex items-center justify-center w-full rounded-[5px] mt-[16px]"
                        disabled={loader}
                        onClick={() => updateStatus(ticket._id, "accept")}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )
        ) : (
          <p>No Order Available</p>
        )}
      </>
    );
  }

  function renderMenuCategoryReady() {
    return (
      <>
        <>
          {tickets.length !== 0 ? (
            loading ? (
              <Loader />
            ) : (
              <div className=" grid gap-[16px]">
                {tickets
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((ticket, index) => (
                    <div
                      className="rounded-[5px] px-[24px] py-[16px] bg-[#E7E7E7] border"
                      key={index}
                    >
                      <div className="rounded-[5px] flex items-center justify-between font-[500] text-[16px]">
                        <div className=" flex items-center gap-[1px]">
                          <p className="capitalize">
                            {ticket?.customer_name
                              ? ticket?.customer_name
                                  .split(" ")
                                  .map((name, index) =>
                                    index === 0
                                      ? name
                                      : index === 1
                                      ? ` ${name.charAt(0).toUpperCase()}.`
                                      : ""
                                  )
                                  .join("")
                              : ""}
                          </p>
                          <p className="capitalize">
                            <span className=" px-[4px]">|</span>#
                            {ticket?.order_number || "20"}
                            <span className=" px-[4px]">|</span>
                          </p>
                          <p>{dayjs(ticket?.createdAt).format("h:mm a")}</p>
                        </div>
                        <p>#{ticket?.total_price.toLocaleString()}</p>
                      </div>
                      <div className="font-[400] text-[16px] mt-[8px] capitalize">
                        <div className="">
                          {ticket?.menu_items.map((item, index) => (
                            <>
                              <div key={index}>
                                <p className=" text-[16px] font-[400] text-[#121212]">
                                  {item?.quantity || 1}x{" "}
                                  <span className=" p-[5px]">{item?.name}</span>
                                </p>
                              </div>
                              <div className="">
                                {item?.selectedOptions?.map((item, index) => (
                                  <div key={index}>
                                    <p>{item?.name}</p>
                                  </div>
                                ))}
                              </div>
                            </>
                          ))}
                        </div>
                      </div>

                      <button
                        className="text-white text-center font-[500] text-[14px] bg-[#11AE16] py-[8px] flex items-center justify-center w-full rounded-[5px] mt-[16px] "
                        disabled={loader}
                        onClick={() => updateStatus(ticket._id, "serve")}
                      >
                        Serve
                      </button>
                    </div>
                  ))}
              </div>
            )
          ) : (
            <p>No Order Available</p>
          )}
        </>
      </>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-2  mb-4 border-b">
        {tabItems.map((tab) => (
          <div
            key={tab.id}
            className={`cursor-pointer text-[16px] leading-[24px] py-4 px-4`}
            onClick={() => handleTabChange(tab.id)}
          >
            <p
              className={` inline text-[16px] leading-[24px] py-4 px-4 ${
                activeTab === tab.id
                  ? "font-[600] text-grey500 border-b-4 border-[#E16B07] "
                  : "text-[#929292] font-[400]"
              }`}
            >
              {tab.label}
            </p>
          </div>
        ))}
      </div>
      <div>
        {tabItems.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab !== tab.id ? "hidden" : ""}`}
          >
            {tab.content()}
          </div>
        ))}
      </div>

      <Modal isOpen={ticketModal}>
        <div className=" w-[328px] min-h-[181px]">
          <div className="border-b border-b-[#E7E7E7] flex items-center justify-between">
            <div className=" py-[16px]  w-full">
              {/* <p className=" text-[16px] font-[500] text-grey500 ">James O.</p> */}
              <div className="text-[16px] font-[500] text-grey500 flex items-center justify-between capitalize">
                <p>
                  {selectedTicket?.customer_name
                    ?.split(" ")
                    .map((name, index) =>
                      index === 0
                        ? name
                        : index === 1
                        ? ` ${name.charAt(0).toUpperCase()}.`
                        : ""
                    )}
                  | #{selectedTicket?.order_number || "23"}
                  {" | "}
                  {dayjs(selectedTicket?.createdAt).format("h:mm a")}
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

          <div className="">
            <p>Please I want the spaghetti with less spice and extra hot dog</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderTab;
