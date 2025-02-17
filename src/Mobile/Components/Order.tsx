import OrderTab from "./OrderTab";
import TopMenuNav from "./TopMenuNav";

const Order = () => {
  return (
    <div className="my-[16px] mx-[16px]">
      <TopMenuNav title="KDS(Kitchen Display System)" />
      <div className=" mt-[24px]">
        <OrderTab />
      </div>
    </div>
  );
};

export default Order;
